"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerTimeoutWorker = exports.dispatchWorker = exports.dispatchService = exports.DispatchService = void 0;
/**
 * DispatchService + Worker — Layer 3: Domain Services
 *
 * Algorithm:
 *   1. Find top-3 online partners within radius who have the required skill
 *   2. Sort by: distance ASC, rating DESC, acceptance_rate DESC
 *   3. Send offer to Partner[0] with TTL (30s instant, 120s scheduled)
 *   4. Partner accepts → atomic SETNX lock (race-safe)
 *   5. On accept: revoke other pending offers, transition booking → assigned
 *   6. On expire/reject: cascade to Partner[1], then Partner[2]
 *   7. If all 3 fail → booking: no_partner (admin must intervene)
 */
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const partners_js_1 = require("../../db/schema/partners.js");
const services_js_1 = require("../../db/schema/services.js");
const booking_service_js_1 = require("../booking/booking.service.js");
const notification_service_js_1 = require("../notification/notification.service.js");
const redis_js_1 = require("../../lib/redis.js");
const queue_js_1 = require("../../lib/queue.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const circuitBreaker_js_1 = require("../../lib/circuitBreaker.js");
const drizzle_orm_1 = require("drizzle-orm");
const users_js_1 = require("../../db/schema/users.js");
// ─── Config ───────────────────────────────────────────────────────────────────
const SEARCH_RADIUS_KM = parseFloat(process.env.SEARCH_RADIUS_KM ?? '10');
const RADIUS_EXPAND_FACTOR = parseFloat(process.env.RADIUS_EXPAND_FACTOR ?? '1.5');
const MAX_RADIUS_KM = parseFloat(process.env.MAX_SEARCH_RADIUS_KM ?? '30');
const INSTANT_OFFER_TTL_SECS = parseInt(process.env.INSTANT_OFFER_TTL ?? '30', 10);
const SCHEDULED_OFFER_TTL = parseInt(process.env.SCHEDULED_OFFER_TTL ?? '120', 10);
const MAX_OFFERS_PER_DISPATCH = 3;
// ─── DispatchService ─────────────────────────────────────────────────────────
class DispatchService {
    // Fallback / Protection Circuit Breaker for Dispatch algorithm
    dispatchBreaker = new circuitBreaker_js_1.CircuitBreaker('DispatchMatching', 3, // Max 3 failures before open
    15000 // 15s timeout
    );
    /**
     * Main dispatch entry: find and rank eligible partners, create offer records.
     * Called by the BullMQ worker.
     */
    async dispatch(bookingId, isScheduled, offerIndex = 0, preferredPartnerId) {
        await this.dispatchBreaker.fire(async () => {
            await this.internalDispatch(bookingId, isScheduled, offerIndex, preferredPartnerId);
        }).catch(async (err) => {
            logger_js_1.logger.error({ bookingId, err }, '[dispatch] Circuit breaker opened or timeout during matching');
            // Graceful Degradation: Mark booking as no_partner (or delayed_dispatch) immediately 
            // without failing the whole system.
            try {
                await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', { note: 'Dispatch matching timeout or error' });
            }
            catch (fallbackErr) {
                logger_js_1.logger.error({ bookingId, fallbackErr }, '[dispatch] Failed to transition after breaker opened');
            }
        });
    }
    async internalDispatch(bookingId, isScheduled, offerIndex, preferredPartnerId) {
        const booking = await booking_service_js_1.bookingService.get(bookingId);
        // Get required skill from service
        const [svc] = await client_js_1.db.select({ skillTag: services_js_1.services.skillTag, city: services_js_1.services.categoryId })
            .from(services_js_1.services).where((0, drizzle_orm_1.eq)(services_js_1.services.id, booking.serviceId)).limit(1);
        // Get customer address for geo-lookup
        const { addresses } = await import('../../db/schema/users.js');
        const [addr] = await client_js_1.db.select({ latitude: addresses.latitude, longitude: addresses.longitude })
            .from(addresses).where((0, drizzle_orm_1.eq)(addresses.id, booking.addressId)).limit(1);
        if (!addr?.latitude || !addr?.longitude) {
            logger_js_1.logger.warn({ bookingId }, '[dispatch] Customer address has no coordinates');
            await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', { note: 'No address coordinates' });
            return;
        }
        const lat = parseFloat(addr.latitude);
        const lng = parseFloat(addr.longitude);
        // Expand radius based on how many times dispatch has been retried (incremented by SLA worker)
        const retryCount = booking.dispatchRetryCount ?? 0;
        const currentRadiusKm = Math.min(SEARCH_RADIUS_KM * Math.pow(RADIUS_EXPAND_FACTOR, retryCount), MAX_RADIUS_KM);
        const SEARCH_RADIUS_METERS = currentRadiusKm * 1000;
        logger_js_1.logger.debug({ bookingId, retryCount, currentRadiusKm }, '[dispatch] Effective search radius');
        // Find nearby partners using PostGIS ST_DWithin (Search radius in meters)
        const { partnerLocations } = await import('../../db/schema/partners.js');
        // Requires PostGIS extension. ST_DWithin on geography/geometry.
        // Assuming SRID 4326, we cast to geography for meters based distance.
        const nearbyLocations = await client_js_1.db.select({
            partnerId: partnerLocations.partnerId,
            distance: (0, drizzle_orm_1.sql) `ST_Distance(
        ${partnerLocations.geom}::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
      )`.mapWith(Number).as('distance')
        })
            .from(partnerLocations)
            .where((0, drizzle_orm_1.sql) `ST_DWithin(
      ${partnerLocations.geom}::geography,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
      ${SEARCH_RADIUS_METERS}
    )`);
        if (nearbyLocations.length === 0) {
            logger_js_1.logger.warn({ bookingId, radiusKm: currentRadiusKm }, '[dispatch] No partners in radius via PostGIS');
            await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', { note: `No partners within ${currentRadiusKm}km radius` });
            return;
        }
        const nearbyPartnerIds = nearbyLocations.map((nl) => ({
            partnerId: nl.partnerId,
            distanceKm: nl.distance / 1000,
        }));
        // Filter: online + correct skill + available status + gender preference
        const eligible = await this.filterEligiblePartners(nearbyPartnerIds.map((np) => np.partnerId), booking.serviceId, svc?.skillTag ?? undefined, isScheduled, booking.preferredGender ?? undefined);
        if (eligible.length === 0) {
            logger_js_1.logger.warn({ bookingId }, '[dispatch] No eligible partners after filtering');
            await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', { note: 'No eligible partners' });
            return;
        }
        // Rank: by distance (from Redis), then rating, then acceptance rate
        let ranked = this.rankPartners(eligible, nearbyPartnerIds);
        // If a specific partner was pre-selected by the batch matching engine, promote
        // them to the front of the queue so they receive the first offer.
        if (preferredPartnerId) {
            const idx = ranked.findIndex(p => p.id === preferredPartnerId);
            if (idx > 0) {
                const [preferred] = ranked.splice(idx, 1);
                ranked = [preferred, ...ranked];
                logger_js_1.logger.debug({ bookingId, preferredPartnerId }, '[dispatch] Promoted batch-matched partner to rank 0');
            }
        }
        // Take top N offers
        const topPartners = ranked.slice(0, MAX_OFFERS_PER_DISPATCH);
        // Create offer record for the specific partner
        const p = topPartners[offerIndex];
        if (!p) {
            await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', { note: 'No eligible partners' });
            return;
        }
        const ttl = isScheduled ? SCHEDULED_OFFER_TTL : INSTANT_OFFER_TTL_SECS;
        const expiresAt = new Date(Date.now() + ttl * 1_000);
        const [offer] = await client_js_1.db.insert(bookings_js_1.offers).values({
            bookingId,
            partnerId: p.id,
            status: 'pending',
            rank: offerIndex + 1,
            offerTtl: ttl,
            expiresAt: expiresAt,
        }).returning();
        // Send offer notification
        await this.sendOfferNotification(p.id, bookingId, svc, ttl);
        // Enqueue timeout job
        const { QUEUES } = await import('../../lib/queue.js');
        const { Queue } = await import('bullmq');
        const { redis } = await import('../../lib/redis.js');
        const offerQueue = new Queue(QUEUES.OFFER_TIMEOUT, { connection: redis });
        await offerQueue.add('timeout', {
            offerId: offer.id,
            bookingId,
            partnerId: p.id,
            offerIndex,
        }, { delay: ttl * 1000 });
        logger_js_1.logger.info({ bookingId, offeredTo: p.id, rank: offerIndex + 1 }, '[dispatch] Offer created');
    }
    /**
     * Partner accepts an offer. Atomic via Redis SETNX lock.
     */
    async acceptOffer(offerId, partnerId) {
        const [offer] = await client_js_1.db.select().from(bookings_js_1.offers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.id, offerId), (0, drizzle_orm_1.eq)(bookings_js_1.offers.partnerId, partnerId), (0, drizzle_orm_1.eq)(bookings_js_1.offers.status, 'pending')))
            .limit(1);
        if (!offer)
            throw errors_js_1.Errors.notFound('Offer');
        if (offer.expiresAt < new Date())
            throw errors_js_1.Errors.offerExpired();
        // Race-safe: first partner to acquire lock wins
        const lockAcquired = await (0, redis_js_1.acquireDispatchLock)(offer.bookingId, partnerId);
        if (!lockAcquired)
            throw errors_js_1.Errors.raceLost();
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, offer.bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        // 2. Prevent double-booking for scheduled/amc_visit jobs
        if (booking.bookingType === 'scheduled' || booking.bookingType === 'amc_visit') {
            const { partnerAvailabilitySlots } = await import('../../db/schema/partners.js');
            const dateStr = booking.scheduledTime?.toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0];
            const slotStart = booking.scheduledTime ? `${booking.scheduledTime.getHours().toString().padStart(2, '0')}:00` : '00:00';
            const slotEnd = booking.scheduledTime ? `${(booking.scheduledTime.getHours() + 2).toString().padStart(2, '0')}:00` : '02:00';
            const [existingSlot] = await client_js_1.db.select().from(partnerAvailabilitySlots)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(partnerAvailabilitySlots.partnerId, partnerId), (0, drizzle_orm_1.eq)(partnerAvailabilitySlots.date, dateStr), (0, drizzle_orm_1.eq)(partnerAvailabilitySlots.slotStart, slotStart), (0, drizzle_orm_1.eq)(partnerAvailabilitySlots.isBooked, true))).limit(1);
            if (existingSlot) {
                throw errors_js_1.Errors.conflict('You already have a booked slot at this time.');
            }
            await client_js_1.db.insert(partnerAvailabilitySlots).values({
                partnerId,
                date: dateStr,
                slotStart,
                slotEnd,
                isBooked: true,
                bookingId: booking.id
            });
        }
        await client_js_1.db.transaction(async (tx) => {
            // 3. Accept this offer
            await tx.update(bookings_js_1.offers)
                .set({ status: 'accepted', respondedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(bookings_js_1.offers.id, offerId));
            // 4. Revoke all other pending offers for this booking
            await tx.update(bookings_js_1.offers)
                .set({ status: 'revoked' })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.bookingId, offer.bookingId), (0, drizzle_orm_1.eq)(bookings_js_1.offers.status, 'pending')));
            // 5. Business Rule: Boost acceptance rate on accept (min increment, capped at 100)
            await tx.update(partners_js_1.partners)
                .set({
                acceptanceRate: (0, drizzle_orm_1.sql) `LEAST(100, ${partners_js_1.partners.acceptanceRate} + 1)`,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
        });
        // Assign partner and transition booking
        await booking_service_js_1.bookingService.assignPartner(offer.bookingId, partnerId, {
            changedById: partnerId,
            changedByRole: 'partner',
            note: 'Partner accepted offer',
        });
        logger_js_1.logger.info({ offerId, partnerId, bookingId: offer.bookingId }, '[dispatch] Offer accepted');
    }
    /**
     * Partner rejects / offer expires → cascade to next offer.
     */
    async handleOfferTimeout(offerId, bookingId, currentOfferIndex) {
        const [offer] = await client_js_1.db.select().from(bookings_js_1.offers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.id, offerId), (0, drizzle_orm_1.eq)(bookings_js_1.offers.status, 'pending')))
            .limit(1);
        if (!offer)
            return; // Offer was already accepted/handled
        await client_js_1.db.update(bookings_js_1.offers)
            .set({ status: 'expired', respondedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(bookings_js_1.offers.id, offerId));
        // Cascade to next offer index
        const nextIndex = currentOfferIndex + 1;
        if (nextIndex >= MAX_OFFERS_PER_DISPATCH) {
            await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', {
                note: 'All 3 offers exhausted',
            });
            logger_js_1.logger.warn({ bookingId }, '[dispatch] No_partner — all 3 offers exhausted');
            return;
        }
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            return;
        logger_js_1.logger.info({ bookingId, nextIndex }, '[dispatch] Cascading to next offer');
        // Continue dispatch loop for the next partner
        await this.dispatch(bookingId, booking.bookingType === 'scheduled', nextIndex);
    }
    // ─── Admin force-assign ──────────────────────────────────────────────────────
    async forceAssign(bookingId, partnerId, adminId) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        // Revoke all outstanding offers
        await client_js_1.db.update(bookings_js_1.offers)
            .set({ status: 'revoked' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.bookingId, bookingId), (0, drizzle_orm_1.eq)(bookings_js_1.offers.status, 'pending')));
        // Reset to searching if needed
        if (booking.status === 'no_partner') {
            await booking_service_js_1.bookingService.transition(bookingId, 'searching', {
                changedById: adminId, changedByRole: 'admin', note: 'Admin re-dispatch',
            });
        }
        await booking_service_js_1.bookingService.assignPartner(bookingId, partnerId, {
            changedById: adminId, changedByRole: 'admin', note: 'Admin force-assign',
        });
    }
    // ─── Compliance: Worker Classification ───────────────────────────────────────
    /**
     * Hour Tracking
     * Required for Minimum Wage and Overtime compliance if partners are deemed employees.
     */
    async recordShiftTime(partnerId, action, latitude, longitude) {
        const timestamp = new Date();
        // 1. Log event in DB (schema stubbed)
        // await db.insert(shiftLogs).values({ partnerId, action, timestamp, latitude, longitude });
        // 2. Update partner online status
        await client_js_1.db.update(partners_js_1.partners)
            .set({ workStatus: action === 'clock_in' ? 'available' : 'offline', updatedAt: timestamp })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
        logger_js_1.logger.info({ partnerId, action, timestamp }, '[compliance] Worker shift recorded');
    }
    // ─── Private helpers ─────────────────────────────────────────────────────────
    async filterEligiblePartners(candidateIds, serviceId, requiredSkill, isScheduled, preferredGender) {
        // Check online status (from Redis heartbeat) in parallel
        const onlineChecks = await Promise.all(candidateIds.map(id => (0, redis_js_1.isPartnerOnline)(id)));
        const onlineIds = candidateIds.filter((_, i) => isScheduled || onlineChecks[i]);
        if (onlineIds.length === 0)
            return [];
        const baseConditions = [
            (0, drizzle_orm_1.inArray)(partners_js_1.partners.id, onlineIds),
            (0, drizzle_orm_1.eq)(partners_js_1.partners.status, 'active'),
            (0, drizzle_orm_1.eq)(partners_js_1.partners.kycStatus, 'verified'),
            (0, drizzle_orm_1.eq)(partners_js_1.partners.isAvailable, true)
        ];
        if (preferredGender) {
            baseConditions.push((0, drizzle_orm_1.eq)(users_js_1.users.gender, preferredGender));
        }
        // DB filter: active status + has the service + available + gender (if any)
        const eligiblePartners = await client_js_1.db.select({
            id: partners_js_1.partners.id,
            rating: partners_js_1.partners.rating,
            acceptanceRate: partners_js_1.partners.acceptanceRate,
            skillTags: partners_js_1.partners.skillTags,
        })
            .from(partners_js_1.partners)
            .innerJoin(users_js_1.users, (0, drizzle_orm_1.eq)(partners_js_1.partners.id, users_js_1.users.id))
            .innerJoin(partners_js_1.partnerServices, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(partners_js_1.partnerServices.partnerId, partners_js_1.partners.id), (0, drizzle_orm_1.eq)(partners_js_1.partnerServices.serviceId, serviceId)))
            .where((0, drizzle_orm_1.and)(...baseConditions));
        // Optional skill filter (Hard filter)
        if (!requiredSkill)
            return eligiblePartners;
        return eligiblePartners.filter(p => {
            const tags = p.skillTags || [];
            return tags.includes(requiredSkill);
        });
    }
    rankPartners(partners, nearbyIds) {
        const distMap = new Map(nearbyIds.map(n => [n.partnerId, n.distanceKm]));
        return [...partners].sort((a, b) => {
            const distA = distMap.get(a.id) ?? 999;
            const distB = distMap.get(b.id) ?? 999;
            if (Math.abs(distA - distB) > 0.5)
                return distA - distB; // closer first
            if (a.rating !== b.rating)
                return b.rating - a.rating; // higher rating
            return b.acceptanceRate - a.acceptanceRate; // higher acceptance
        });
    }
    async sendOfferNotification(partnerId, bookingId, svc, ttlSecs) {
        await notification_service_js_1.notificationService.sendToUser(partnerId, {
            title: '🔔 New Job Offer',
            body: `New booking available! Accept within ${ttlSecs}s.`,
            type: 'push',
            data: { bookingId, ttlSecs },
        });
    }
}
exports.DispatchService = DispatchService;
exports.dispatchService = new DispatchService();
// ─── BullMQ Worker ────────────────────────────────────────────────────────────
exports.dispatchWorker = (0, queue_js_1.createWorker)('dispatch', async (job) => {
    const { bookingId, isScheduled, offerIndex } = job.data;
    const preferredPartnerId = job.data.preferredPartnerId;
    logger_js_1.logger.info({ bookingId, jobId: job.id, preferredPartnerId }, '[dispatch-worker] Processing');
    await exports.dispatchService.dispatch(bookingId, isScheduled, offerIndex, preferredPartnerId);
}, 5);
exports.dispatchWorker.on('completed', (job) => logger_js_1.logger.info({ jobId: job.id }, '[dispatch-worker] Completed'));
exports.dispatchWorker.on('failed', (job, err) => logger_js_1.logger.error({ jobId: job?.id, err }, '[dispatch-worker] Failed'));
exports.offerTimeoutWorker = (0, queue_js_1.createWorker)('offer-timeout', async (job) => {
    const { offerId, bookingId, offerIndex } = job.data;
    logger_js_1.logger.info({ offerId, bookingId, jobId: job.id }, '[offer-timeout-worker] Processing');
    await exports.dispatchService.handleOfferTimeout(offerId, bookingId, offerIndex);
}, 10);
exports.offerTimeoutWorker.on('failed', (job, err) => logger_js_1.logger.error({ jobId: job?.id, err }, '[offer-timeout-worker] Failed'));
//# sourceMappingURL=dispatch.service.js.map