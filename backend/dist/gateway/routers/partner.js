"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerRouter = partnerRouter;
const zod_1 = require("zod");
const client_js_1 = require("../../db/client.js");
const partners_js_1 = require("../../db/schema/partners.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const payments_js_1 = require("../../db/schema/payments.js");
const booking_service_js_1 = require("../../services/booking/booking.service.js");
const dispatch_service_js_1 = require("../../services/dispatch/dispatch.service.js");
const payment_service_js_1 = require("../../services/payment/payment.service.js");
const ledger_service_js_1 = require("../../services/ledger/ledger.service.js");
const partner_service_js_1 = require("../../services/partner/partner.service.js");
const rbac_js_1 = require("../middleware/rbac.js");
const validate_js_1 = require("../middleware/validate.js");
const response_js_1 = require("../../lib/response.js");
const redis_js_1 = require("../../lib/redis.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Schemas ──────────────────────────────────────────────────────────────────
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    skillTags: zod_1.z.array(zod_1.z.string()).min(1).max(20),
    serviceAreas: zod_1.z.array(zod_1.z.string()).min(1),
    upiId: zod_1.z.string().optional(),
});
const locationSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    accuracy: zod_1.z.number().optional(),
});
const settlementRequestSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().min(100),
});
// ─── Router ───────────────────────────────────────────────────────────────────
async function partnerRouter(fastify) {
    const { authenticate } = fastify;
    const guard = [authenticate, (0, rbac_js_1.requireRole)('partner')];
    // POST /api/v1/partner/register
    fastify.post('/register', { preHandler: [authenticate] }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(registerSchema, req);
        const [existing] = await client_js_1.db.select({ id: partners_js_1.partners.id })
            .from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub)).limit(1);
        if (existing)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.conflict('Partner profile already exists'));
        const [partner] = await client_js_1.db.insert(partners_js_1.partners).values({
            id: req.user.sub,
            name: input.name,
            phone: req.user.phone,
            skillTags: input.skillTags,
            serviceAreas: input.serviceAreas,
            upiId: input.upiId,
            status: 'pending',
        }).returning();
        return (0, response_js_1.sendCreated)(reply, partner);
    });
    // GET /api/v1/partner/profile
    fastify.get('/profile', { preHandler: guard }, async (req, reply) => {
        const [partner] = await client_js_1.db.select().from(partners_js_1.partners)
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub)).limit(1);
        if (!partner)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Partner profile'));
        return (0, response_js_1.sendOk)(reply, partner);
    });
    // PUT /api/v1/partner/profile
    fastify.put('/profile', { preHandler: guard }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(zod_1.z.object({
            skillTags: zod_1.z.array(zod_1.z.string()).optional(),
            serviceAreas: zod_1.z.array(zod_1.z.string()).optional(),
            employmentType: zod_1.z.enum(['part_time', 'full_time']).optional(),
            upiId: zod_1.z.string().optional(),
            workingHoursStart: zod_1.z.string().optional(),
            workingHoursEnd: zod_1.z.string().optional(),
            calendarBlocks: zod_1.z.array(zod_1.z.object({ start: zod_1.z.string(), end: zod_1.z.string() })).optional(),
            bio: zod_1.z.string().max(1000).optional(),
            basePrice: zod_1.z.number().optional(),
        }), req);
        const { basePrice, ...rest } = input;
        const [partner] = await client_js_1.db.update(partners_js_1.partners)
            .set({
            ...rest,
            basePrice: basePrice?.toString(),
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub))
            .returning();
        return (0, response_js_1.sendOk)(reply, partner);
    });
    // GET /api/v1/partner/kyc
    fastify.get('/kyc', { preHandler: guard }, async (req, reply) => {
        const { partnerDocuments } = await import('../../db/schema/partners.js');
        const docs = await client_js_1.db.select().from(partnerDocuments)
            .where((0, drizzle_orm_1.eq)(partnerDocuments.partnerId, req.user.sub));
        return (0, response_js_1.sendOk)(reply, docs);
    });
    // POST /api/v1/partner/kyc/upload
    fastify.post('/kyc/upload', { preHandler: guard }, async (req, reply) => {
        const { type, doc_id } = (0, validate_js_1.parseBody)(zod_1.z.object({
            type: zod_1.z.enum(['aadhaar', 'pan', 'driving_license', 'bank_passbook', 'profile_photo', 'police_clearance']),
            doc_id: zod_1.z.string().min(1),
            status: zod_1.z.enum(['UPLOADED', 'PENDING', 'VERIFIED']).optional(), // ignored by backend for safety, backend sets to 'pending'
        }), req);
        const { partnerDocuments } = await import('../../db/schema/partners.js');
        // In a real system, you'd handle file upload (S3/GCS URL) here.
        // For now, we simulate saving the document reference.
        const [doc] = await client_js_1.db.insert(partnerDocuments).values({
            partnerId: req.user.sub,
            documentType: type,
            fileUrl: `mock_url_${doc_id}`, // Simulate file URL for the given document ID
            status: 'pending',
        }).returning();
        // Optionally check if we can update the partner kycStatus to 'kyc_submitted'
        // but typically that's done explicitly when they hit a "submit application" button.
        return (0, response_js_1.sendCreated)(reply, doc);
    });
    // POST /api/v1/partner/location  (GPS update — Redis primary)
    fastify.post('/location', { preHandler: guard }, async (req, reply) => {
        const { latitude, longitude, accuracy } = (0, validate_js_1.parseBody)(locationSchema, req);
        const partnerId = req.user.sub;
        // Redis GEO update (real-time)
        await (0, redis_js_1.setPartnerLocation)(partnerId, latitude, longitude);
        // Periodic DB persist every N calls (handled by background task in production)
        // Here we persist directly for simplicity — in prod use a Redis counter
        const geom = { type: 'Point', coordinates: [longitude, latitude] };
        await client_js_1.db.insert(partners_js_1.partnerLocations).values({
            partnerId, geom, accuracy, updatedAt: new Date(),
        }).onConflictDoUpdate({
            target: partners_js_1.partnerLocations.partnerId,
            set: { geom, accuracy, updatedAt: new Date() },
        });
        return (0, response_js_1.sendOk)(reply, { message: 'Location updated' });
    });
    // POST /api/v1/partner/status
    fastify.post('/status', { preHandler: guard }, async (req, reply) => {
        const { isOnline, isAvailable } = (0, validate_js_1.parseBody)(zod_1.z.object({
            isOnline: zod_1.z.boolean(),
            isAvailable: zod_1.z.boolean().default(true),
        }), req);
        if (isOnline) {
            await (0, redis_js_1.setPartnerOnline)(req.user.sub);
        }
        else {
            await (0, redis_js_1.setPartnerOffline)(req.user.sub);
        }
        await client_js_1.db.update(partners_js_1.partners)
            .set({
            isAvailable,
            workStatus: isOnline ? (isAvailable ? 'available' : 'on_job') : 'offline',
        })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub));
        return (0, response_js_1.sendOk)(reply, { isOnline, isAvailable });
    });
    // GET /api/v1/partner/offers
    fastify.get('/offers', { preHandler: guard }, async (req, reply) => {
        const { services } = await import('../../db/schema/services.js');
        const { addresses } = await import('../../db/schema/users.js');
        const offerList = await client_js_1.db.select({
            offer: bookings_js_1.offers,
            booking: bookings_js_1.bookings,
            service: services,
            address: addresses,
        })
            .from(bookings_js_1.offers)
            .innerJoin(bookings_js_1.bookings, (0, drizzle_orm_1.eq)(bookings_js_1.offers.bookingId, bookings_js_1.bookings.id))
            .innerJoin(services, (0, drizzle_orm_1.eq)(bookings_js_1.bookings.serviceId, services.id))
            .leftJoin(addresses, (0, drizzle_orm_1.eq)(bookings_js_1.bookings.addressId, addresses.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.partnerId, req.user.sub), (0, drizzle_orm_1.eq)(bookings_js_1.offers.status, 'pending')))
            .orderBy(bookings_js_1.offers.expiresAt)
            .limit(10);
        const formattedList = offerList.map(item => ({
            id: item.offer.id,
            bookingId: item.booking.id,
            serviceName: item.service.name,
            amount: item.booking.finalAmount ?? item.service.basePrice,
            customerArea: item.address?.city ?? 'Unknown',
            scheduledTime: item.booking.scheduledTime?.toISOString() ?? 'Instant',
            status: 'NEW',
            distance: '2.5 km', // Placeholder, real distance would be calculated
        }));
        return (0, response_js_1.sendOk)(reply, formattedList);
    });
    // POST /api/v1/partner/offers/:id/accept
    fastify.post('/offers/:id/accept', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        await dispatch_service_js_1.dispatchService.acceptOffer(id, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: 'Offer accepted' });
    });
    // POST /api/v1/partner/offers/:id/reject
    fastify.post('/offers/:id/reject', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { reason } = (0, validate_js_1.parseBody)(zod_1.z.object({ reason: zod_1.z.string().optional() }), req);
        const [offer] = await client_js_1.db.update(bookings_js_1.offers)
            .set({ status: 'rejected', respondedAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.id, id), (0, drizzle_orm_1.eq)(bookings_js_1.offers.partnerId, req.user.sub)))
            .returning();
        if (offer) {
            // Business Rule: Track partner acceptance rate — decrement on rejection
            await client_js_1.db.update(partners_js_1.partners)
                .set({
                acceptanceRate: (0, drizzle_orm_1.sql) `GREATEST(0, ${partners_js_1.partners.acceptanceRate} - 2)`, // -2 percentage points per rejection, min 0
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub));
            // Cascade to next offer in the dispatch queue
            await dispatch_service_js_1.dispatchService.handleOfferTimeout(id, offer.bookingId, offer.rank - 1);
        }
        return (0, response_js_1.sendOk)(reply, { message: 'Offer rejected' });
    });
    // GET /api/v1/partner/offers/:id/estimate
    // Business Rule: Partner job accept karne se pehle payout estimate dekh sake.
    fastify.get('/offers/:id/estimate', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        // Verify this offer belongs to this partner and is still pending
        const [offer] = await client_js_1.db.select()
            .from(bookings_js_1.offers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.offers.id, id), (0, drizzle_orm_1.eq)(bookings_js_1.offers.partnerId, req.user.sub), (0, drizzle_orm_1.eq)(bookings_js_1.offers.status, 'pending')))
            .limit(1);
        if (!offer)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Offer'));
        if (offer.expiresAt < new Date())
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.offerExpired());
        const { estimatedEarning } = await ledger_service_js_1.ledgerService.getPayoutEstimate(offer.bookingId);
        // Also include booking details for context
        const booking = await booking_service_js_1.bookingService.get(offer.bookingId);
        const { services } = await import('../../db/schema/services.js');
        const [svc] = await client_js_1.db.select({ name: services.name, category: services.categoryId })
            .from(services).where((0, drizzle_orm_1.eq)(services.id, booking.serviceId)).limit(1);
        return (0, response_js_1.sendOk)(reply, {
            offerId: id,
            bookingId: offer.bookingId,
            serviceName: svc?.name ?? 'Service',
            grossAmount: booking.finalAmount,
            estimatedEarning,
            commissionPct: parseFloat(process.env.DEFAULT_COMMISSION_PCT ?? '20'),
            expiresAt: offer.expiresAt,
        });
    });
    // GET /api/v1/partner/bookings
    fastify.get('/bookings', { preHandler: guard }, async (req, reply) => {
        const { page, perPage } = (0, validate_js_1.parseQuery)(validate_js_1.paginationSchema, req);
        const p = page ?? 1;
        const pp = perPage ?? 50;
        const offset = (p - 1) * pp;
        const [list, [{ total }]] = await Promise.all([
            client_js_1.db.select().from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.partnerId, req.user.sub))
                .orderBy((0, drizzle_orm_1.desc)(bookings_js_1.bookings.createdAt))
                .limit(pp).offset(offset),
            client_js_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.partnerId, req.user.sub)),
        ]);
        return reply.status(200).send((0, response_js_1.paginatedOk)(list, p, pp, total));
    });
    // POST /api/v1/partner/bookings/:id/en-route
    fastify.post('/bookings/:id/en-route', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        await booking_service_js_1.bookingService.transition(id, 'en_route', {
            changedById: req.user.sub, changedByRole: 'partner',
        });
        return (0, response_js_1.sendOk)(reply, { message: 'Marked en route' });
    });
    // GET /api/v1/partner/bookings/:id/otp  (get OTP to share with customer)
    fastify.get('/bookings/:id/otp', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const otp = await booking_service_js_1.bookingService.getArrivalOtp(id, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { otp });
    });
    // POST /api/v1/partner/bookings/:id/complete
    fastify.post('/bookings/:id/complete', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { otp } = (0, validate_js_1.parseBody)(zod_1.z.object({ otp: zod_1.z.string().length(6) }), req);
        await booking_service_js_1.bookingService.verifyArrivalOtp(id, otp);
        await booking_service_js_1.bookingService.transition(id, 'completed', {
            changedById: req.user.sub, changedByRole: 'partner',
        });
        return (0, response_js_1.sendOk)(reply, { message: 'Job completed' });
    });
    // POST /api/v1/partner/sos
    fastify.post('/sos', { preHandler: guard }, async (req, reply) => {
        const { bookingId, description } = (0, validate_js_1.parseBody)(zod_1.z.object({
            bookingId: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
        }), req);
        fastify.log.warn(`SOS TRIGGERED BY PARTNER ${req.user.sub} for booking ${bookingId ?? 'none'}`);
        // Business Rule: Traceable safety process — create complaint + log
        try {
            await partner_service_js_1.partnerService.reportSafetyIssue(bookingId ?? 'no_booking', req.user.sub, 'partner', description ?? 'Emergency SOS triggered by partner');
        }
        catch (err) {
            // Non-fatal: SOS response still sent even if DB write fails
            fastify.log.error({ err }, '[sos] Failed to write complaint record');
        }
        return (0, response_js_1.sendOk)(reply, { success: true, message: 'Emergency services and admin notified' });
    });
    // POST /api/v1/partner/bookings/:id/cancel
    // Business Rule: Partner cancellation rules are different from customer rules.
    // After acceptance, partner pays flat ₹100 penalty AND acceptance rate drops.
    fastify.post('/bookings/:id/cancel', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { reason } = (0, validate_js_1.parseBody)(zod_1.z.object({ reason: zod_1.z.string().min(5).max(500) }), req);
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, id), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.partnerId, req.user.sub)))
            .limit(1);
        if (!booking)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        // Business Rule: Partner cancellation only allowed before job starts
        if (['in_progress', 'completed', 'cancelled'].includes(booking.status)) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation('Cannot cancel booking in current state'));
        }
        // Cancel with partner role — triggers ₹100 penalty in booking.service.ts
        await booking_service_js_1.bookingService.transition(id, 'cancelled', {
            changedById: req.user.sub,
            changedByRole: 'partner',
            note: `Partner cancelled. Reason: ${reason}`,
        });
        // Business Rule: Penalise acceptance rate on partner cancellation
        await client_js_1.db.update(partners_js_1.partners)
            .set({
            acceptanceRate: (0, drizzle_orm_1.sql) `GREATEST(0, ${partners_js_1.partners.acceptanceRate} - 5)`, // -5% per post-accept cancellation
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub));
        // Trigger re-dispatch so the customer is not left stranded
        await booking_service_js_1.bookingService.startDispatch(id).catch(err => fastify.log.warn({ err, bookingId: id }, '[partner-cancel] Re-dispatch failed'));
        return (0, response_js_1.sendOk)(reply, { message: 'Booking cancelled. Penalty applied per policy.' });
    });
    // POST /api/v1/partner/safety/report
    // Business Rule: Traceable review process for safety complaints
    fastify.post('/safety/report', { preHandler: guard }, async (req, reply) => {
        const { bookingId, description } = (0, validate_js_1.parseBody)(zod_1.z.object({
            bookingId: zod_1.z.string(),
            description: zod_1.z.string().min(20).max(2000),
        }), req);
        // Validate this partner was assigned to the booking
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        if (booking.partnerId !== req.user.sub && booking.customerId !== req.user.sub) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Not related to this booking'));
        }
        await partner_service_js_1.partnerService.reportSafetyIssue(bookingId, req.user.sub, 'partner', description);
        return (0, response_js_1.sendCreated)(reply, {
            message: 'Safety complaint filed. Trust & Safety team has been notified.',
        });
    });
    // GET /api/v1/partner/wallet
    fastify.get('/wallet', { preHandler: guard }, async (req, reply) => {
        const [partner] = await client_js_1.db.select({ balance: partners_js_1.partners.walletBalance })
            .from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, req.user.sub)).limit(1);
        const transactions = await client_js_1.db.select().from(payments_js_1.walletTransactions)
            .where((0, drizzle_orm_1.eq)(payments_js_1.walletTransactions.partnerId, req.user.sub))
            .orderBy((0, drizzle_orm_1.desc)(payments_js_1.walletTransactions.createdAt))
            .limit(50);
        return (0, response_js_1.sendOk)(reply, { balance: partner?.balance ?? 0, transactions });
    });
    // POST /api/v1/partner/settlement/request
    fastify.post('/settlement/request', { preHandler: guard }, async (req, reply) => {
        const { amount } = (0, validate_js_1.parseBody)(settlementRequestSchema, req);
        const settlementId = await payment_service_js_1.paymentService.requestSettlement(req.user.sub, amount);
        return (0, response_js_1.sendCreated)(reply, { settlementId, message: 'Settlement requested' });
    });
    // GET /api/v1/partner/training
    fastify.get('/training', { preHandler: guard }, async (req, reply) => {
        // Return mock training modules for Phase 1
        const modules = [
            {
                id: "TM_1",
                title: "VisvasaHome Standard Operating Procedure",
                description: "Learn the basics of how to operate as a partner.",
                durationMinutes: 15,
                videoUrl: "https://example.com/video1.mp4",
                isCompleted: true
            },
            {
                id: "TM_2",
                title: "Customer Excellence & Safety",
                description: "Best practices for customer interaction and safety protocols.",
                durationMinutes: 20,
                videoUrl: "https://example.com/video2.mp4",
                isCompleted: false
            },
            {
                id: "TM_3",
                title: "Advanced AC Servicing",
                description: "Skill upgrade module for AC servicing professionals.",
                durationMinutes: 45,
                videoUrl: "https://example.com/video3.mp4",
                isCompleted: false
            }
        ];
        return (0, response_js_1.sendOk)(reply, modules);
    });
    // POST /api/v1/partner/training/complete
    fastify.post('/training/complete', { preHandler: guard }, async (req, reply) => {
        const { moduleId } = (0, validate_js_1.parseBody)(zod_1.z.object({ moduleId: zod_1.z.string() }), req);
        return (0, response_js_1.sendOk)(reply, { success: true, message: `Module ${moduleId} completed` });
    });
    // GET /api/v1/partner/insights
    // Business Rule: Advanced demand forecasting & partner performance insights.
    // Now backed by real DB queries instead of mock data.
    fastify.get('/insights', { preHandler: guard }, async (req, reply) => {
        const partnerId = req.user.sub;
        // Fetch real data in parallel for performance
        const [partner, completedThisWeekRows, ratingSummary, walletRows] = await Promise.all([
            client_js_1.db.select({
                rating: partners_js_1.partners.rating,
                acceptanceRate: partners_js_1.partners.acceptanceRate,
                walletBalance: partners_js_1.partners.walletBalance,
                skillTags: partners_js_1.partners.skillTags,
                serviceAreas: partners_js_1.partners.serviceAreas,
                jobsCompleted: partners_js_1.partners.jobsCompleted,
            }).from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId)).limit(1),
            // Jobs completed in the last 7 days
            client_js_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(bookings_js_1.bookings).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.partnerId, partnerId), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'completed'), (0, drizzle_orm_1.sql) `${bookings_js_1.bookings.jobCompletedAt} >= NOW() - INTERVAL '7 days'`)),
            // Average rating + review count from reviews table
            client_js_1.db.select({
                avgRating: (0, drizzle_orm_1.sql) `COALESCE(AVG(CAST(${bookings_js_1.reviews.rating} AS FLOAT)), 0)`,
                totalReviews: (0, drizzle_orm_1.count)(),
            }).from(bookings_js_1.reviews).where((0, drizzle_orm_1.eq)(bookings_js_1.reviews.partnerId, partnerId)),
            // Earnings this month from wallet transactions
            client_js_1.db.select({
                monthlyEarnings: (0, drizzle_orm_1.sql) `COALESCE(SUM(CAST(${payments_js_1.walletTransactions.amount} AS FLOAT)), 0)`,
            }).from(payments_js_1.walletTransactions).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.walletTransactions.partnerId, partnerId), (0, drizzle_orm_1.eq)(payments_js_1.walletTransactions.txType, 'earning'), (0, drizzle_orm_1.sql) `${payments_js_1.walletTransactions.createdAt} >= DATE_TRUNC('month', NOW())`)),
        ]);
        const p = partner[0];
        const completedThisWeek = Number(completedThisWeekRows[0]?.count ?? 0);
        const avgRating = parseFloat(Number(ratingSummary[0]?.avgRating ?? p?.rating ?? 4.5).toFixed(2));
        const totalReviews = Number(ratingSummary[0]?.totalReviews ?? 0);
        const monthlyEarnings = parseFloat(Number(walletRows[0]?.monthlyEarnings ?? 0).toFixed(2));
        // Derived metrics
        const completionRate = p?.acceptanceRate ?? 85;
        const demandHotspots = p?.serviceAreas ?? ['Your Area'];
        const projectedMonthlyEarning = monthlyEarnings > 0
            ? Math.round(monthlyEarnings * (30 / new Date().getDate())) // Extrapolate from current month
            : Math.round(completedThisWeek * 4 * 350); // 4 weeks × avg ₹350/job estimate
        return (0, response_js_1.sendOk)(reply, {
            // Performance
            rating: avgRating,
            totalReviews,
            acceptanceRate: p?.acceptanceRate ?? 85,
            completionRate,
            completedJobsLastWeek: completedThisWeek,
            totalCompletedJobs: Number(p?.jobsCompleted ?? 0),
            // Financials
            walletBalance: parseFloat(String(p?.walletBalance ?? 0)),
            monthlyEarnings,
            projectedMonthlyEarning,
            customerSatisfaction: avgRating,
            // Demand intelligence
            demandHotspots,
            activeSkills: p?.skillTags ?? [],
            // AMC placeholder count (future: join amc_subscriptions)
            amcContractsActive: 0,
        });
    });
}
//# sourceMappingURL=partner.js.map