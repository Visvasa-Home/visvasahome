"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = exports.BookingService = void 0;
/**
 * BookingService — Layer 3: Domain Services
 *
 * This is the STATE MACHINE for all bookings.
 * ALL transitions MUST go through this service — no direct DB writes allowed.
 *
 * State machine:
 *   pending → searching → assigned → en_route → in_progress → completed
 *   pending | searching → no_partner
 *   any pre-completion state → cancelled
 *
 * Supported flows:
 *   ⚡ Instant:    create → (payment) → dispatch → assign → en_route → OTP → complete
 *   📅 Scheduled: same, but scheduledTime slot ≥ 1h ahead
 *   🔁 AMC visit: finalAmount=0, uses subscription visit
 */
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const payments_js_1 = require("../../db/schema/payments.js");
const partners_js_1 = require("../../db/schema/partners.js");
const services_js_1 = require("../../db/schema/services.js");
const users_js_1 = require("../../db/schema/users.js");
const outbox_js_1 = require("../../db/schema/outbox.js");
const pricing_service_js_1 = require("../pricing/pricing.service.js");
const queue_js_1 = require("../../lib/queue.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
const node_crypto_1 = __importDefault(require("node:crypto"));
// ─── Valid state transitions ──────────────────────────────────────────────────
const VALID_TRANSITIONS = {
    pending: ['searching', 'cancelled'],
    searching: ['assigned', 'no_partner', 'cancelled'],
    assigned: ['en_route', 'cancelled'],
    en_route: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    no_partner: ['searching', 'assigned', 'cancelled'],
    cancelled: [],
};
// ─── Cancellation Fee Rules ───────────────────────────────────────────────────
const CANCELLATION_FEE_PCT = {
    assigned: 0.10, // 10% if partner assigned
    en_route: 0.25, // 25% if partner on the way
    in_progress: 0.50, // 50% if work started
};
// ─── BookingService ───────────────────────────────────────────────────────────
class BookingService {
    // ─── Create ─────────────────────────────────────────────────────────────────
    async create(input) {
        // 0. Check idempotency key
        if (input.idempotencyKey) {
            const [existing] = await client_js_1.db.select().from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.idempotencyKey, input.idempotencyKey)).limit(1);
            if (existing) {
                logger_js_1.logger.info({ idempotencyKey: input.idempotencyKey }, '[booking] Idempotency cache hit');
                return { bookingId: existing.id, finalAmount: parseFloat(String(existing.finalAmount)) };
            }
        }
        // 1. Validate service exists
        const [svc] = await client_js_1.db.select().from(services_js_1.services).where((0, drizzle_orm_1.eq)(services_js_1.services.id, input.serviceId)).limit(1);
        if (!svc || !svc.isActive)
            throw errors_js_1.Errors.notFound('Service');
        // 2. Validate address exists and belongs to customer
        const [addr] = await client_js_1.db.select().from(users_js_1.addresses)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_js_1.addresses.id, input.addressId), (0, drizzle_orm_1.eq)(users_js_1.addresses.userId, input.customerId))).limit(1);
        if (!addr)
            throw errors_js_1.Errors.notFound('Address');
        // 3. Validate AMC subscription for amc_visit
        let amcSubId;
        if (input.bookingType === 'amc_visit') {
            if (!input.amcSubscriptionId)
                throw errors_js_1.Errors.notFound('AMC subscription ID required');
            const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, input.amcSubscriptionId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.customerId, input.customerId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.status, 'active'))).limit(1);
            if (!sub)
                throw errors_js_1.Errors.notFound('Active AMC subscription');
            if (sub.visitsRemaining <= 0)
                throw errors_js_1.Errors.amcVisitsExhausted();
            amcSubId = sub.id;
        }
        // 4. Price calculation
        const pricing = input.bookingType === 'amc_visit'
            ? pricing_service_js_1.pricingService.amcVisitPrice()
            : await pricing_service_js_1.pricingService.quote({
                basePrice: parseFloat(String(svc.basePrice)),
                couponCode: input.couponCode,
                serviceId: input.serviceId,
                customerId: input.customerId,
                isSurge: input.bookingType === 'instant',
            });
        // 5. Generate 6-digit arrival OTP
        const arrivalOtp = node_crypto_1.default.randomInt(100_000, 999_999).toString();
        // 6. Slot Reservation Lock
        const { redlock } = await import('../../lib/redlock.js');
        const slotKey = input.scheduledTime ? input.scheduledTime.toISOString() : 'instant';
        const lockKey = `lock:slot:${input.serviceId}:${slotKey}`;
        let lock;
        try {
            lock = await redlock.acquire([lockKey], 5000);
        }
        catch (err) {
            throw errors_js_1.Errors.conflict('This slot is currently being reserved by someone else. Please try again or select another time.');
        }
        // 7. Create booking (+ items in transaction)
        const bookingId = node_crypto_1.default.randomUUID();
        try {
            await client_js_1.db.transaction(async (tx) => {
                await tx.insert(bookings_js_1.bookings).values({
                    id: bookingId,
                    bookingNumber: `VH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
                    customerId: input.customerId,
                    serviceId: input.serviceId,
                    addressId: input.addressId,
                    couponId: pricing.couponId,
                    amcSubscriptionId: amcSubId,
                    idempotencyKey: input.idempotencyKey,
                    bookingType: input.bookingType,
                    status: 'pending',
                    scheduledTime: input.scheduledTime,
                    requiredSkill: svc.skillTag ?? undefined,
                    preferredGender: input.preferredGender,
                    basePrice: String(pricing.basePrice),
                    surgeAmount: String(pricing.surgeAmount),
                    addonsAmount: String(pricing.addonsAmount),
                    discountAmount: String(pricing.discountAmount),
                    taxAmount: String(pricing.taxAmount),
                    finalAmount: String(pricing.finalAmount),
                    arrivalOtp,
                    notes: input.notes,
                });
                // Insert line item
                await tx.insert(bookings_js_1.bookingItems).values({
                    bookingId,
                    itemType: 'service',
                    name: svc.name,
                    quantity: 1,
                    unitPrice: String(svc.basePrice),
                    totalPrice: String(svc.basePrice),
                });
                // Record status history
                await tx.insert(bookings_js_1.bookingStatusHistory).values({
                    bookingId,
                    oldStatus: null,
                    newStatus: 'pending',
                    note: 'Booking created',
                });
                // Outbox Pattern: Emit booking.created
                await tx.insert(outbox_js_1.outboxEvents).values({
                    aggregateType: 'Booking',
                    aggregateId: bookingId,
                    eventType: 'booking.created',
                    payload: {
                        customerId: input.customerId,
                        serviceId: input.serviceId,
                        bookingType: input.bookingType ?? 'instant',
                    },
                });
            });
            logger_js_1.logger.info({ bookingId, customerId: input.customerId }, '[booking] Created');
            return { bookingId, finalAmount: pricing.finalAmount };
        }
        finally {
            if (lock) {
                await lock.release().catch((err) => logger_js_1.logger.warn({ err }, 'Failed to release redlock'));
            }
        }
    }
    // ─── Reschedule ────────────────────────────────────────────────────────────
    async reschedule(bookingId, customerId, newScheduledTime) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.customerId !== customerId)
            throw errors_js_1.Errors.forbidden('Not your booking');
        if (booking.bookingType !== 'scheduled' || !booking.scheduledTime) {
            throw errors_js_1.Errors.validation({ booking: 'Only scheduled bookings can be rescheduled' });
        }
        const nowMs = Date.now();
        const currentScheduledMs = booking.scheduledTime.getTime();
        const hoursRemaining = (currentScheduledMs - nowMs) / (1000 * 60 * 60);
        if (hoursRemaining < 4) {
            throw errors_js_1.Errors.validation({ reschedule: 'Reschedule allowed only up to 4 hours before the job' });
        }
        await client_js_1.db.transaction(async (tx) => {
            await tx.update(bookings_js_1.bookings)
                .set({ scheduledTime: newScheduledTime })
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId));
            await tx.insert(bookings_js_1.bookingStatusHistory).values({
                bookingId,
                oldStatus: booking.status,
                newStatus: booking.status,
                changedById: customerId,
                changedByRole: 'customer',
                note: `Rescheduled to ${newScheduledTime.toISOString()}`,
            });
            // Emit event for reminders refresh
            await tx.insert(outbox_js_1.outboxEvents).values({
                aggregateType: 'Booking',
                aggregateId: bookingId,
                eventType: 'booking.rescheduled',
                payload: { customerId, newScheduledTime },
            });
        });
        logger_js_1.logger.info({ bookingId, newScheduledTime }, '[booking] Rescheduled');
    }
    // ─── State Transition (core state machine) ───────────────────────────────────
    async transition(bookingId, newStatus, meta) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        const currentStatus = booking.status;
        const allowed = VALID_TRANSITIONS[currentStatus] ?? [];
        if (!allowed.includes(newStatus)) {
            throw errors_js_1.Errors.invalidTransition(currentStatus, newStatus);
        }
        const now = new Date();
        const timestamps = {};
        if (newStatus === 'searching')
            timestamps.searchingStartedAt = now;
        if (newStatus === 'assigned')
            timestamps.partnerAssignedAt = now;
        if (newStatus === 'en_route')
            timestamps.partnerEnRouteAt = now;
        if (newStatus === 'in_progress')
            timestamps.jobStartedAt = now;
        if (newStatus === 'completed')
            timestamps.jobCompletedAt = now;
        if (newStatus === 'cancelled')
            timestamps.cancelledAt = now;
        // Compute cancellation fee
        let cancellationFee = 0;
        if (newStatus === 'cancelled') {
            if (meta?.changedByRole === 'customer') {
                const isScheduled = booking.bookingType === 'scheduled' && booking.scheduledTime;
                const nowMs = now.getTime();
                let applyFee = false;
                let feePct = 0;
                if (isScheduled && booking.scheduledTime) {
                    const scheduledMs = booking.scheduledTime.getTime();
                    const hoursRemaining = (scheduledMs - nowMs) / (1000 * 60 * 60);
                    if (hoursRemaining <= 24) {
                        applyFee = true;
                        feePct = 0.2; // 20% partial refund penalty (VisvasaHome logic)
                    }
                }
                else {
                    // Instant booking: fee applies based on current state (e.g. en_route)
                    applyFee = true;
                    feePct = CANCELLATION_FEE_PCT[currentStatus] ?? 0;
                }
                if (applyFee) {
                    cancellationFee = parseFloat((parseFloat(String(booking.finalAmount)) * feePct).toFixed(2));
                }
            }
            else if (meta?.changedByRole === 'partner' && ['assigned', 'en_route', 'in_progress'].includes(currentStatus)) {
                // Flat ₹100 penalty for partner cancellation after acceptance
                cancellationFee = 100;
            }
        }
        await client_js_1.db.transaction(async (tx) => {
            if (meta?.changedByRole === 'partner' && cancellationFee > 0 && booking.partnerId) {
                const { ledgerService } = await import('../ledger/ledger.service.js');
                await ledgerService.recordPartnerCancellationPenalty(tx, bookingId, booking.partnerId, cancellationFee);
            }
            if (newStatus === 'completed' && booking.partnerId) {
                const { ledgerService } = await import('../ledger/ledger.service.js');
                // Record strict double-entry auditable ledger for job completion
                // The paymentId might be tracked differently, using a synthetic ID here for the ledger tx
                const syntheticPaymentId = `pay_complete_${bookingId.slice(0, 8)}`;
                await ledgerService.recordJobCompletion(tx, syntheticPaymentId, bookingId, booking.partnerId, parseFloat(String(booking.finalAmount)));
            }
            await tx.update(bookings_js_1.bookings)
                .set({
                status: newStatus,
                cancellationFee: newStatus === 'cancelled' ? String(cancellationFee) : undefined,
                cancelledBy: newStatus === 'cancelled' && meta?.changedByRole
                    ? meta.changedByRole
                    : undefined,
                ...timestamps,
                ...(meta?.updates || {}),
            })
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId));
            await tx.insert(bookings_js_1.bookingStatusHistory).values({
                bookingId,
                oldStatus: currentStatus,
                newStatus,
                changedById: meta?.changedById,
                changedByRole: meta?.changedByRole,
                note: meta?.note,
            });
            // Emit outbox event
            await tx.insert(outbox_js_1.outboxEvents).values({
                aggregateType: 'Booking',
                aggregateId: bookingId,
                eventType: `booking.${newStatus}`, // e.g. booking.cancelled
                payload: {
                    oldStatus: currentStatus,
                    changedByRole: meta?.changedByRole,
                    partnerId: booking.partnerId,
                    customerId: booking.customerId,
                    cancellationFee
                },
            });
        });
        logger_js_1.logger.info({ bookingId, from: currentStatus, to: newStatus }, '[booking] Transition');
    }
    // ─── Dispatch (pending → searching → queue) ──────────────────────────────────
    async startDispatch(bookingId) {
        await this.transition(bookingId, 'searching', { note: 'Dispatch started' });
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        const isScheduled = booking?.bookingType === 'scheduled' || booking?.bookingType === 'amc_visit';
        if (!isScheduled) {
            // ⚡ INSTANT bookings: push to Redis batch accumulator.
            // The BatchDispatchWorker drains this set every BATCH_WINDOW_MS (default 10s)
            // and runs the Hungarian assignment for globally optimal matching.
            const { enqueueForBatch } = await import('../dispatch/matching.engine.js');
            await enqueueForBatch(bookingId);
            logger_js_1.logger.info({ bookingId }, '[booking] Enqueued for batch matching window');
        }
        else {
            // 📅 SCHEDULED / AMC_VISIT: add directly to BullMQ dispatch queue.
            // The SchedulerWorker will trigger this at the appropriate time.
            await queue_js_1.dispatchQueue.add('dispatch', { bookingId, isScheduled: true }, {
                jobId: `dispatch:${bookingId}`,
                attempts: 3,
            });
        }
    }
    // ─── OTP Verification ────────────────────────────────────────────────────────
    async verifyArrivalOtp(bookingId, otp) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.status !== 'en_route') {
            throw errors_js_1.Errors.invalidTransition(booking.status, 'in_progress');
        }
        if (booking.arrivalOtp !== otp) {
            throw new Error('Invalid OTP');
        }
        await client_js_1.db.update(bookings_js_1.bookings)
            .set({ otpVerifiedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId));
        await this.transition(bookingId, 'in_progress', { note: 'OTP verified' });
    }
    /**
     * VisvasaHome-style Identity Verification (Azure Cognitive Services simulation).
     * Validates partner selfie matches their KYC profile before allowing job start.
     */
    async verifyPartnerIdentity(bookingId, partnerId, selfieUrl) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.partnerId !== partnerId)
            throw errors_js_1.Errors.forbidden('Not assigned to this booking');
        if (booking.status !== 'en_route')
            throw errors_js_1.Errors.invalidTransition(booking.status, 'in_progress');
        // Simulate Azure Cognitive Services Facial Verification
        const mockConfidence = Math.random() * (1.0 - 0.7) + 0.7; // random between 0.7 and 1.0
        if (mockConfidence < 0.85) {
            throw new Error(`Identity verification failed. Confidence score too low: ${(mockConfidence * 100).toFixed(1)}%`);
        }
        await client_js_1.db.update(bookings_js_1.bookings)
            .set({
            partnerIdentityVerifiedAt: new Date(),
            partnerIdentityConfidence: mockConfidence,
        })
            .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId));
    }
    // ─── Assign Partner (by dispatch or admin) ───────────────────────────────────
    async assignPartner(bookingId, partnerId, meta) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        await this.transition(bookingId, 'assigned', {
            ...meta,
            updates: { partnerId, partnerAssignedAt: new Date() }
        });
    }
    // ─── Complete Job ────────────────────────────────────────────────────────────
    async completeJob(bookingId, partnerId, photos) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.partnerId !== partnerId)
            throw errors_js_1.Errors.forbidden('Not your booking');
        if (booking.status !== 'in_progress') {
            throw errors_js_1.Errors.invalidTransition(booking.status, 'completed');
        }
        if (!photos || photos.length === 0) {
            throw new Error('Completion photos are required');
        }
        // Save photos and complete atomically
        await this.transition(bookingId, 'completed', {
            note: 'Job completed by partner',
            updates: { completionPhotos: photos }
        });
        // Business Rule: Increment partner's total completed jobs for ranking & level progression
        await client_js_1.db.update(partners_js_1.partners)
            .set({
            jobsCompleted: (0, drizzle_orm_1.sql) `${partners_js_1.partners.jobsCompleted} + 1`,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
    }
    // ─── AMC Visit Usage ────────────────────────────────────────────────────────
    async deductAmcVisit(subscriptionId) {
        const result = await client_js_1.db.update(payments_js_1.amcSubscriptions)
            .set({
            visitsUsed: (0, drizzle_orm_1.sql) `${payments_js_1.amcSubscriptions.visitsUsed} + 1`,
            visitsRemaining: (0, drizzle_orm_1.sql) `${payments_js_1.amcSubscriptions.visitsRemaining} - 1`,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId), (0, drizzle_orm_1.sql) `${payments_js_1.amcSubscriptions.visitsRemaining} > 0`))
            .returning({ remaining: payments_js_1.amcSubscriptions.visitsRemaining });
        if (result.length === 0)
            throw errors_js_1.Errors.amcVisitsExhausted();
        // If remaining visits hit 0, expire the contract
        if (result[0].remaining === 0) {
            await client_js_1.db.update(payments_js_1.amcSubscriptions)
                .set({ status: 'expired' })
                .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
            // Also emit a notification event for renewal
            logger_js_1.logger.info({ subscriptionId }, '[amc] Contract expired, visits exhausted');
        }
    }
    async refundAmcVisit(subscriptionId) {
        await client_js_1.db.update(payments_js_1.amcSubscriptions)
            .set({
            visitsUsed: (0, drizzle_orm_1.sql) `${payments_js_1.amcSubscriptions.visitsUsed} - 1`,
            visitsRemaining: (0, drizzle_orm_1.sql) `${payments_js_1.amcSubscriptions.visitsRemaining} + 1`,
        })
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
    }
    // ─── Get Booking ────────────────────────────────────────────────────────────
    async get(bookingId) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        return booking;
    }
    async getArrivalOtp(bookingId, requestingPartnerId) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.partnerId !== requestingPartnerId)
            throw errors_js_1.Errors.forbidden('Not your booking');
        if (!booking.arrivalOtp)
            throw new Error('No OTP for this booking');
        return booking.arrivalOtp;
    }
}
exports.BookingService = BookingService;
exports.bookingService = new BookingService();
//# sourceMappingURL=booking.service.js.map