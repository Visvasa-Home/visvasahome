"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = customerRouter;
const zod_1 = require("zod");
const client_js_1 = require("../../db/client.js");
const users_js_1 = require("../../db/schema/users.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const services_js_1 = require("../../db/schema/services.js");
const bookings_js_2 = require("../../db/schema/bookings.js");
const booking_service_js_1 = require("../../services/booking/booking.service.js");
const amc_service_js_1 = require("../../services/amc/amc.service.js");
const rating_service_js_1 = require("../../services/rating/rating.service.js");
const payment_service_js_1 = require("../../services/payment/payment.service.js");
const pricing_service_js_1 = require("../../services/pricing/pricing.service.js");
const rbac_js_1 = require("../middleware/rbac.js");
const idempotency_js_1 = require("../middleware/idempotency.js");
const validate_js_1 = require("../middleware/validate.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Schemas ──────────────────────────────────────────────────────────────────
const createBookingSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid(),
    addressId: zod_1.z.string().uuid(),
    couponCode: zod_1.z.string().max(50).optional(),
    bookingType: zod_1.z.enum(['instant', 'scheduled']).default('instant'),
    scheduledTime: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().max(500).optional(),
    idempotencyKey: zod_1.z.string().max(255).optional(), // Added for exactly-once creation
    preferredGender: zod_1.z.enum(['male', 'female', 'other']).optional(),
}).refine(data => {
    if (data.bookingType === 'scheduled') {
        return data.scheduledTime && data.scheduledTime > new Date();
    }
    return true;
}, { message: "Scheduled time must be in the future", path: ["scheduledTime"] });
const rateBookingSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().max(1000).optional(),
    photos: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
const addAddressSchema = zod_1.z.object({
    label: zod_1.z.string().max(60).optional(),
    addressLine: zod_1.z.string().min(5).max(512),
    landmark: zod_1.z.string().max(256).optional(),
    city: zod_1.z.string().min(2).max(100),
    state: zod_1.z.string().min(2).max(100),
    pincode: zod_1.z.string().regex(/^\d{6}$/, "Must be a 6 digit pincode"),
    latitude: zod_1.z.string().optional().refine(val => !val || (parseFloat(val) >= -90 && parseFloat(val) <= 90), "Invalid latitude"),
    longitude: zod_1.z.string().optional().refine(val => !val || (parseFloat(val) >= -180 && parseFloat(val) <= 180), "Invalid longitude"),
    isDefault: zod_1.z.boolean().default(false),
});
const amcSubscribeSchema = zod_1.z.object({
    planId: zod_1.z.string().uuid(),
    addressId: zod_1.z.string().uuid().optional(),
});
const amcVisitSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string().uuid(),
    addressId: zod_1.z.string().uuid().optional(),
});
// ─── Router ───────────────────────────────────────────────────────────────────
async function customerRouter(fastify) {
    const { authenticate } = fastify;
    const guard = [authenticate, (0, rbac_js_1.requireRole)('customer')];
    // ── Addresses ────────────────────────────────────────────────────────────────
    fastify.get('/addresses', { preHandler: guard }, async (req, reply) => {
        const list = await client_js_1.db.select().from(users_js_1.addresses)
            .where((0, drizzle_orm_1.eq)(users_js_1.addresses.userId, req.user.sub))
            .orderBy(users_js_1.addresses.isDefault, users_js_1.addresses.createdAt);
        return (0, response_js_1.sendOk)(reply, list);
    });
    fastify.post('/addresses', { preHandler: guard }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(addAddressSchema, req);
        const [addr] = await client_js_1.db.insert(users_js_1.addresses).values({
            ...input,
            userId: req.user.sub,
        }).returning();
        return (0, response_js_1.sendCreated)(reply, addr);
    });
    fastify.delete('/addresses/:id', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        await client_js_1.db.delete(users_js_1.addresses)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_js_1.addresses.id, id), (0, drizzle_orm_1.eq)(users_js_1.addresses.userId, req.user.sub)));
        return (0, response_js_1.sendOk)(reply, { message: 'Address deleted' });
    });
    // ── GDPR Data Deletion (Right to Erasure) ───────────────────────────────────
    fastify.delete('/account', { preHandler: guard }, async (req, reply) => {
        // Soft delete or completely wipe PII for GDPR
        // In a real system, this would trigger an async workflow (e.g. 30 day grace period, anonymization of bookings)
        const { users } = await import('../../db/schema/users.js');
        await client_js_1.db.update(users)
            .set({
            isActive: false,
            name: 'Anonymized User',
            phone: '0000000000',
            email: null,
        })
            .where((0, drizzle_orm_1.eq)(users.id, req.user.sub));
        return (0, response_js_1.sendOk)(reply, { message: 'Account scheduled for deletion according to GDPR' });
    });
    // ── Price Quote ──────────────────────────────────────────────────────────────
    fastify.get('/bookings/quote', { preHandler: guard }, async (req, reply) => {
        const query = (0, validate_js_1.parseQuery)(zod_1.z.object({
            serviceId: zod_1.z.string().uuid(),
            couponCode: zod_1.z.string().optional(),
            isSurge: zod_1.z.coerce.boolean().default(false),
        }), req);
        const { services } = await import('../../db/schema/services.js');
        const [svc] = await client_js_1.db.select({ basePrice: services.basePrice })
            .from(services).where((0, drizzle_orm_1.eq)(services.id, query.serviceId)).limit(1);
        if (!svc)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Service'));
        const quote = await pricing_service_js_1.pricingService.quote({
            basePrice: parseFloat(String(svc.basePrice)),
            couponCode: query.couponCode,
            serviceId: query.serviceId,
            customerId: req.user.sub,
            isSurge: query.isSurge,
        });
        return (0, response_js_1.sendOk)(reply, quote);
    });
    // ── Create Booking ────────────────────────────────────────────────────────────
    fastify.post('/bookings', { preHandler: [...guard, idempotency_js_1.withIdempotency] }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(createBookingSchema, req);
        const idempotencyKey = req.headers['idempotency-key'];
        const result = await booking_service_js_1.bookingService.create({
            ...input,
            bookingType: input.bookingType ?? 'instant',
            customerId: req.user.sub,
            idempotencyKey: idempotencyKey || input.idempotencyKey,
            preferredGender: input.preferredGender,
        });
        const { bookingBloomFilter } = await import('../../lib/bloom.js');
        await bookingBloomFilter.add(result.bookingId);
        return (0, response_js_1.sendCreated)(reply, result);
    });
    // ── List Bookings ────────────────────────────────────────────────────────────
    fastify.get('/bookings', { preHandler: guard }, async (req, reply) => {
        const { page, perPage } = (0, validate_js_1.parseQuery)(validate_js_1.paginationSchema, req);
        const p = page ?? 1;
        const pp = perPage ?? 50;
        const offset = (p - 1) * pp;
        const [list, [{ total }]] = await Promise.all([
            client_js_1.db.select().from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.customerId, req.user.sub))
                .orderBy((0, drizzle_orm_1.desc)(bookings_js_1.bookings.createdAt))
                .limit(pp).offset(offset),
            client_js_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.customerId, req.user.sub)),
        ]);
        return reply.status(200).send((0, response_js_1.paginatedOk)(list, p, pp, total));
    });
    // ── Get Booking ───────────────────────────────────────────────────────────────
    fastify.get('/bookings/:id', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { bookingBloomFilter } = await import('../../lib/bloom.js');
        if (!(await bookingBloomFilter.mightContain(id))) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        }
        const { fetchWithCache } = await import('../../lib/cacheWrapper.js');
        const booking = await fetchWithCache(`groot:booking:${id}`, async () => {
            const [record] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, id)).limit(1);
            return record || null;
        });
        if (!booking || booking.customerId !== req.user.sub) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        }
        return (0, response_js_1.sendOk)(reply, booking);
    });
    // ── Cancel Booking ────────────────────────────────────────────────────────────
    fastify.post('/bookings/:id/cancel', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { reason } = (0, validate_js_1.parseBody)(zod_1.z.object({ reason: zod_1.z.string().max(500).optional() }), req);
        // Verify ownership
        const [booking] = await client_js_1.db.select({ customerId: bookings_js_1.bookings.customerId })
            .from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, id)).limit(1);
        if (!booking || booking.customerId !== req.user.sub) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        }
        await booking_service_js_1.bookingService.transition(id, 'cancelled', {
            changedById: req.user.sub,
            changedByRole: 'customer',
            note: reason ?? 'Customer cancelled',
        });
        return (0, response_js_1.sendOk)(reply, { message: 'Booking cancelled' });
    });
    // ── Rate Booking ──────────────────────────────────────────────────────────────
    fastify.post('/bookings/:id/rate', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const input = (0, validate_js_1.parseBody)(rateBookingSchema, req);
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, id), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.customerId, req.user.sub))).limit(1);
        if (!booking)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        if (booking.status !== 'completed') {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation({ status: 'Booking must be completed to rate' }));
        }
        const [review] = await client_js_1.db.insert(bookings_js_2.reviews).values({
            bookingId: id,
            customerId: req.user.sub,
            partnerId: booking.partnerId ?? undefined,
            serviceId: booking.serviceId,
            rating: input.rating,
            comment: input.comment,
            photos: input.photos ?? [],
        }).returning();
        return (0, response_js_1.sendCreated)(reply, review);
    });
    // ── Reschedule Booking ───────────────────────────────────────────────────────
    fastify.post('/bookings/:id/reschedule', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { newScheduledTime } = (0, validate_js_1.parseBody)(zod_1.z.object({ newScheduledTime: zod_1.z.coerce.date() }), req);
        await booking_service_js_1.bookingService.reschedule(id, req.user.sub, newScheduledTime);
        return (0, response_js_1.sendOk)(reply, { message: 'Booking rescheduled successfully' });
    });
    // ── Create Razorpay payment order ────────────────────────────────────────────
    fastify.post('/payments/order/:bookingId', { preHandler: guard }, async (req, reply) => {
        const { bookingId } = req.params;
        const order = await payment_service_js_1.paymentService.createOrder(bookingId);
        return (0, response_js_1.sendOk)(reply, order);
    });
    // POST /api/v1/customer/bookings/:id/rating
    fastify.post('/bookings/:id/rating', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { rating, comment } = (0, validate_js_1.parseBody)(rateBookingSchema, req);
        const reviewId = await rating_service_js_1.ratingService.submitReview(id, req.user.sub, rating, comment);
        return (0, response_js_1.sendCreated)(reply, { reviewId, message: 'Rating submitted' });
    });
    // ── AMC Plans ─────────────────────────────────────────────────────────────────
    fastify.get('/amc/plans', { preHandler: guard }, async (_req, reply) => {
        const plans = await client_js_1.db.select().from(services_js_1.amcPlans).where((0, drizzle_orm_1.eq)(services_js_1.amcPlans.isActive, true));
        return (0, response_js_1.sendOk)(reply, plans);
    });
    fastify.post('/amc/subscribe', { preHandler: guard }, async (req, reply) => {
        const { planId, addressId } = (0, validate_js_1.parseBody)(amcSubscribeSchema, req);
        const result = await amc_service_js_1.amcService.subscribe(req.user.sub, planId, addressId);
        return (0, response_js_1.sendCreated)(reply, result);
    });
    fastify.get('/amc/subscriptions', { preHandler: guard }, async (req, reply) => {
        const subs = await amc_service_js_1.amcService.getByCustomer(req.user.sub);
        return (0, response_js_1.sendOk)(reply, subs);
    });
    fastify.post('/amc/visit', { preHandler: guard }, async (req, reply) => {
        const { subscriptionId, addressId } = (0, validate_js_1.parseBody)(amcVisitSchema, req);
        const result = await amc_service_js_1.amcService.useVisit(req.user.sub, subscriptionId, addressId);
        return (0, response_js_1.sendCreated)(reply, result);
    });
    fastify.post('/amc/subscriptions/:id/pause', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        await amc_service_js_1.amcService.pause(id, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: 'Subscription paused' });
    });
    fastify.post('/amc/subscriptions/:id/resume', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        await amc_service_js_1.amcService.resume(id, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: 'Subscription resumed' });
    });
    fastify.post('/amc/subscriptions/:id/cancel', { preHandler: guard }, async (req, reply) => {
        const { id } = req.params;
        const { refundAmount } = await amc_service_js_1.amcService.cancel(id, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: 'Subscription cancelled', refundAmount });
    });
}
//# sourceMappingURL=customer.js.map