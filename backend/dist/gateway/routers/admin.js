"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = adminRouter;
const zod_1 = require("zod");
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const partners_js_1 = require("../../db/schema/partners.js");
const users_js_1 = require("../../db/schema/users.js");
const services_js_1 = require("../../db/schema/services.js");
const payments_js_1 = require("../../db/schema/payments.js");
const dispatch_service_js_1 = require("../../services/dispatch/dispatch.service.js");
const booking_service_js_1 = require("../../services/booking/booking.service.js");
const payment_service_js_1 = require("../../services/payment/payment.service.js");
const rbac_js_1 = require("../middleware/rbac.js");
const audit_js_1 = require("../middleware/audit.js");
const mfa_js_1 = require("../middleware/mfa.js");
const validate_js_1 = require("../middleware/validate.js");
const response_js_1 = require("../../lib/response.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Router ───────────────────────────────────────────────────────────────────
async function adminRouter(fastify) {
    const { authenticate } = fastify;
    // All routes here require standard auth + 'admin' role
    fastify.addHook('preHandler', authenticate);
    fastify.addHook('preHandler', (0, rbac_js_1.requireRole)('admin'));
    fastify.addHook('onResponse', audit_js_1.auditAdminAction);
    const adminGuard = [];
    const financeGuard = [...adminGuard, (0, rbac_js_1.requireAdminRole)('finance_admin', 'super_admin')];
    // ── Dashboard KPIs ────────────────────────────────────────────────────────────
    fastify.get('/dashboard', { preHandler: adminGuard }, async (_req, reply) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [[{ totalBookings }], [{ todayBookings }], [{ activePartners }], [{ pendingPayouts }], [{ totalCustomers }],] = await Promise.all([
            client_js_1.db.select({ totalBookings: (0, drizzle_orm_1.count)() }).from(bookings_js_1.bookings),
            client_js_1.db.select({ todayBookings: (0, drizzle_orm_1.count)() }).from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.gte)(bookings_js_1.bookings.createdAt, today)),
            client_js_1.db.select({ activePartners: (0, drizzle_orm_1.count)() }).from(partners_js_1.partners)
                .where((0, drizzle_orm_1.eq)(partners_js_1.partners.status, 'active')),
            client_js_1.db.select({ pendingPayouts: (0, drizzle_orm_1.count)() }).from(payments_js_1.settlements)
                .where((0, drizzle_orm_1.eq)(payments_js_1.settlements.status, 'pending')),
            client_js_1.db.select({ totalCustomers: (0, drizzle_orm_1.count)() }).from(users_js_1.users)
                .where((0, drizzle_orm_1.eq)(users_js_1.users.role, 'customer')),
        ]);
        return (0, response_js_1.sendOk)(reply, {
            totalBookings,
            todayBookings,
            activePartners,
            pendingPayouts,
            totalCustomers,
        });
    });
    // ── Bookings Management ───────────────────────────────────────────────────────
    fastify.get('/bookings', { preHandler: adminGuard }, async (req, reply) => {
        const { page, perPage } = (0, validate_js_1.parseQuery)(validate_js_1.paginationSchema, req);
        const { status } = (0, validate_js_1.parseQuery)(zod_1.z.object({ status: zod_1.z.string().optional() }), req);
        const p = page ?? 1;
        const pp = perPage ?? 50;
        const offset = (p - 1) * pp;
        const whereClause = status
            ? (0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, status)
            : undefined;
        const [list, [{ total }]] = await Promise.all([
            client_js_1.db.select().from(bookings_js_1.bookings)
                .where(whereClause)
                .orderBy((0, drizzle_orm_1.desc)(bookings_js_1.bookings.createdAt))
                .limit(pp).offset(offset),
            client_js_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(bookings_js_1.bookings).where(whereClause),
        ]);
        return reply.status(200).send((0, response_js_1.paginatedOk)(list, p, pp, total));
    });
    fastify.get('/bookings/:id', { preHandler: adminGuard }, async (req, reply) => {
        const { id } = req.params;
        const booking = await booking_service_js_1.bookingService.get(id);
        return (0, response_js_1.sendOk)(reply, booking);
    });
    fastify.post('/bookings/:id/force-assign', {
        preHandler: [...adminGuard, (0, rbac_js_1.requireAdminRole)('operations_admin', 'super_admin'), mfa_js_1.requireMfa],
    }, async (req, reply) => {
        const { id } = req.params;
        const { partnerId } = (0, validate_js_1.parseBody)(zod_1.z.object({ partnerId: zod_1.z.string().uuid() }), req);
        await dispatch_service_js_1.dispatchService.forceAssign(id, partnerId, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: `Booking force-assigned to partner ${partnerId}` });
    });
    fastify.post('/bookings/:id/cancel', { preHandler: adminGuard }, async (req, reply) => {
        const { id } = req.params;
        const { reason } = (0, validate_js_1.parseBody)(zod_1.z.object({ reason: zod_1.z.string().max(500) }), req);
        await booking_service_js_1.bookingService.transition(id, 'cancelled', {
            changedById: req.user.sub, changedByRole: 'admin', note: reason,
        });
        return (0, response_js_1.sendOk)(reply, { message: 'Booking cancelled by admin' });
    });
    // ── Partner KYC Management ────────────────────────────────────────────────────
    fastify.get('/partners', {
        preHandler: [...adminGuard, (0, rbac_js_1.requireAdminRole)('partner_admin', 'super_admin')],
    }, async (req, reply) => {
        const { page, perPage } = (0, validate_js_1.parseQuery)(validate_js_1.paginationSchema, req);
        const { status } = (0, validate_js_1.parseQuery)(zod_1.z.object({ status: zod_1.z.string().optional() }), req);
        const p = page ?? 1;
        const pp = perPage ?? 50;
        const offset = (p - 1) * pp;
        const whereClause = status ? (0, drizzle_orm_1.eq)(partners_js_1.partners.status, status) : undefined;
        const [list, [{ total }]] = await Promise.all([
            client_js_1.db.select().from(partners_js_1.partners).where(whereClause)
                .orderBy((0, drizzle_orm_1.desc)(partners_js_1.partners.createdAt)).limit(pp).offset(offset),
            client_js_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(partners_js_1.partners).where(whereClause),
        ]);
        return reply.status(200).send((0, response_js_1.paginatedOk)(list, p, pp, total));
    });
    fastify.post('/partners/:id/approve', {
        preHandler: [...adminGuard, (0, rbac_js_1.requireAdminRole)('partner_admin', 'super_admin')],
    }, async (req, reply) => {
        const { id } = req.params;
        await client_js_1.db.update(partners_js_1.partners)
            .set({ status: 'active', isAvailable: true })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, id));
        return (0, response_js_1.sendOk)(reply, { message: 'Partner approved' });
    });
    fastify.post('/partners/:id/suspend', {
        preHandler: [...adminGuard, (0, rbac_js_1.requireAdminRole)('partner_admin', 'super_admin')],
    }, async (req, reply) => {
        const { id } = req.params;
        const { reason } = (0, validate_js_1.parseBody)(zod_1.z.object({ reason: zod_1.z.string() }), req);
        await client_js_1.db.update(partners_js_1.partners)
            .set({ status: 'suspended', isAvailable: false })
            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, id));
        return (0, response_js_1.sendOk)(reply, { message: `Partner suspended: ${reason}` });
    });
    // ── Finance Management ────────────────────────────────────────────────────────
    fastify.get('/settlements', { preHandler: financeGuard }, async (req, reply) => {
        const { page, perPage } = (0, validate_js_1.parseQuery)(validate_js_1.paginationSchema, req);
        const p = page ?? 1;
        const pp = perPage ?? 50;
        const offset = (p - 1) * pp;
        const [list, [{ total }]] = await Promise.all([
            client_js_1.db.select().from(payments_js_1.settlements)
                .where((0, drizzle_orm_1.eq)(payments_js_1.settlements.status, 'pending'))
                .orderBy(payments_js_1.settlements.requestedAt)
                .limit(pp).offset(offset),
            client_js_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(payments_js_1.settlements)
                .where((0, drizzle_orm_1.eq)(payments_js_1.settlements.status, 'pending')),
        ]);
        return reply.status(200).send((0, response_js_1.paginatedOk)(list, p, pp, total));
    });
    fastify.post('/settlements/:id/process', { preHandler: [...financeGuard, mfa_js_1.requireMfa] }, async (req, reply) => {
        const { id } = req.params;
        const { utrNumber } = (0, validate_js_1.parseBody)(zod_1.z.object({ utrNumber: zod_1.z.string().min(10) }), req);
        await payment_service_js_1.paymentService.processSettlement(id, req.user.sub, utrNumber);
        return (0, response_js_1.sendOk)(reply, { message: 'Settlement processed' });
    });
    fastify.get('/payments', { preHandler: financeGuard }, async (req, reply) => {
        const { page, perPage } = (0, validate_js_1.parseQuery)(validate_js_1.paginationSchema, req);
        const p = page ?? 1;
        const pp = perPage ?? 50;
        const offset = (p - 1) * pp;
        const [list, [{ total }]] = await Promise.all([
            client_js_1.db.select().from(payments_js_1.payments).orderBy((0, drizzle_orm_1.desc)(payments_js_1.payments.createdAt))
                .limit(pp).offset(offset),
            client_js_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(payments_js_1.payments),
        ]);
        return reply.status(200).send((0, response_js_1.paginatedOk)(list, p, pp, total));
    });
    fastify.post('/payments/:id/refund', { preHandler: [...financeGuard, mfa_js_1.requireMfa] }, async (req, reply) => {
        const { id } = req.params;
        const { amount, reason } = (0, validate_js_1.parseBody)(zod_1.z.object({
            amount: zod_1.z.number().positive(),
            reason: zod_1.z.string(),
        }), req);
        const refundId = await payment_service_js_1.paymentService.initiateRefund(id, amount, reason, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { refundId, message: 'Refund initiated' });
    });
    // ── Catalog Management (SERVICE_ADMIN, SUPER_ADMIN) ──────────────────────────
    const catalogGuard = [...adminGuard, (0, rbac_js_1.requireAdminRole)('service_admin', 'super_admin')];
    fastify.get('/catalog/categories', { preHandler: catalogGuard }, async (_req, reply) => {
        const list = await client_js_1.db.select().from(services_js_1.categories).orderBy(services_js_1.categories.sortOrder);
        return (0, response_js_1.sendOk)(reply, list);
    });
    fastify.post('/catalog/services', { preHandler: catalogGuard }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(zod_1.z.object({
            categoryId: zod_1.z.string().uuid(),
            name: zod_1.z.string().min(2).max(255),
            slug: zod_1.z.string().min(2).max(255),
            description: zod_1.z.string().optional(),
            skillTag: zod_1.z.string().optional(),
            basePrice: zod_1.z.number().positive(),
            durationMins: zod_1.z.number().int().positive(),
            estimatedArrivalMins: zod_1.z.number().int().positive().default(30),
            isAmcEligible: zod_1.z.boolean().default(false),
        }), req);
        const [svc] = await client_js_1.db.insert(services_js_1.services).values({
            ...input,
            basePrice: String(input.basePrice),
            estimatedArrivalMins: input.estimatedArrivalMins,
            sortOrder: 0,
        }).returning();
        return (0, response_js_1.sendCreated)(reply, svc);
    });
    fastify.post('/catalog/amc-plans', { preHandler: catalogGuard }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(zod_1.z.object({
            name: zod_1.z.string(),
            planType: zod_1.z.enum(['basic', 'standard', 'premium']),
            price: zod_1.z.number().positive(),
            validityMonths: zod_1.z.number().int().positive(),
            totalVisits: zod_1.z.number().int().positive(),
            applicableServices: zod_1.z.array(zod_1.z.string().uuid()),
            benefits: zod_1.z.array(zod_1.z.string()).default([]),
        }), req);
        const [plan] = await client_js_1.db.insert(services_js_1.amcPlans).values({
            ...input,
            price: String(input.price),
        }).returning();
        return (0, response_js_1.sendCreated)(reply, plan);
    });
    fastify.post('/catalog/coupons', { preHandler: catalogGuard }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(zod_1.z.object({
            code: zod_1.z.string().toUpperCase(),
            couponType: zod_1.z.enum(['flat', 'percent', 'free_service']),
            discountValue: zod_1.z.number().positive(),
            minOrderValue: zod_1.z.number().min(0).default(0),
            maxDiscountCap: zod_1.z.number().positive().optional(),
            validFrom: zod_1.z.coerce.date(),
            validUntil: zod_1.z.coerce.date(),
            maxUses: zod_1.z.number().int().positive().optional(),
            usesPerUser: zod_1.z.number().int().positive().default(1),
            applicableServices: zod_1.z.array(zod_1.z.string().uuid()).default([]),
        }), req);
        const [coupon] = await client_js_1.db.insert(services_js_1.coupons).values({
            ...input,
            discountValue: String(input.discountValue),
            minOrderValue: String(input.minOrderValue),
            maxDiscountCap: input.maxDiscountCap ? String(input.maxDiscountCap) : undefined,
        }).returning();
        return (0, response_js_1.sendCreated)(reply, coupon);
    });
    fastify.post('/catalog/service-areas', { preHandler: catalogGuard }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(zod_1.z.object({
            name: zod_1.z.string(),
            city: zod_1.z.string(),
            state: zod_1.z.string(),
            pincodes: zod_1.z.array(zod_1.z.string().regex(/^\d{6}$/)),
        }), req);
        const [area] = await client_js_1.db.insert(services_js_1.serviceAreas).values(input).returning();
        return (0, response_js_1.sendCreated)(reply, area);
    });
}
//# sourceMappingURL=admin.js.map