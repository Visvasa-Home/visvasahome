"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amcService = exports.AmcService = void 0;
/**
 * AmcService — Layer 3: Domain Services
 *
 * AMC (Annual Maintenance Contract) flow:
 *   1. Customer browses plans (GET /api/v1/catalog/amc-plans)
 *   2. POST /api/v1/customer/amc/subscribe → subscription created (pending_payment)
 *   3. Payment captured → webhook → AmcService.activate()
 *   4. POST /api/v1/customer/amc/visit → ₹0 booking, visit consumed
 *   5. Cancellation → AmcService.cancel() → refund visit if booking cancelled
 *   6. Expiry (cron) → AmcService.checkExpiry() → status: expired
 */
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const services_js_1 = require("../../db/schema/services.js");
const booking_service_js_1 = require("../booking/booking.service.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── AmcService ──────────────────────────────────────────────────────────────
class AmcService {
    // ─── Subscribe ──────────────────────────────────────────────────────────────
    async subscribe(customerId, planId, addressId) {
        const [plan] = await client_js_1.db.select().from(services_js_1.amcPlans)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(services_js_1.amcPlans.id, planId), (0, drizzle_orm_1.eq)(services_js_1.amcPlans.isActive, true))).limit(1);
        if (!plan)
            throw errors_js_1.Errors.notFound('AMC plan');
        const [sub] = await client_js_1.db.insert(payments_js_1.amcSubscriptions).values({
            customerId,
            planId,
            addressId,
            status: 'pending_payment',
            visitsTotal: plan.totalVisits,
            visitsUsed: 0,
            visitsRemaining: plan.totalVisits,
        }).returning({ id: payments_js_1.amcSubscriptions.id });
        logger_js_1.logger.info({ customerId, planId, subId: sub.id }, '[amc] Subscription created (pending payment)');
        return { subscriptionId: sub.id, amount: parseFloat(String(plan.price)) };
    }
    // ─── Activate (called after payment captured) ────────────────────────────────
    async activate(subscriptionId, paymentId) {
        const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId)).limit(1);
        if (!sub)
            throw errors_js_1.Errors.notFound('AMC subscription');
        const [plan] = await client_js_1.db.select().from(services_js_1.amcPlans).where((0, drizzle_orm_1.eq)(services_js_1.amcPlans.id, sub.planId)).limit(1);
        if (!plan)
            throw errors_js_1.Errors.notFound('AMC plan');
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.validityMonths);
        await client_js_1.db.update(payments_js_1.amcSubscriptions)
            .set({
            status: 'active',
            paymentId,
            startDate: startDate.toISOString().slice(0, 10),
            endDate: endDate.toISOString().slice(0, 10),
        })
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
        logger_js_1.logger.info({ subscriptionId }, '[amc] Activated');
    }
    // ─── Use a visit (creates ₹0 booking) ────────────────────────────────────────
    async useVisit(customerId, subscriptionId, addressId) {
        const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.customerId, customerId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.status, 'active'))).limit(1);
        if (!sub)
            throw errors_js_1.Errors.notFound('Active AMC subscription');
        if (sub.visitsRemaining <= 0)
            throw errors_js_1.Errors.amcVisitsExhausted();
        // Get first applicable service from plan
        const [plan] = await client_js_1.db.select().from(services_js_1.amcPlans).where((0, drizzle_orm_1.eq)(services_js_1.amcPlans.id, sub.planId)).limit(1);
        const applicableServices = plan?.applicableServices;
        const serviceId = applicableServices?.[0];
        if (!serviceId)
            throw errors_js_1.Errors.notFound('AMC plan has no applicable services');
        // Create ₹0 booking
        const { bookingId } = await booking_service_js_1.bookingService.create({
            customerId,
            serviceId,
            addressId: addressId ?? sub.addressId ?? '',
            bookingType: 'amc_visit',
            amcSubscriptionId: subscriptionId,
        });
        // Deduct visit atomically
        await booking_service_js_1.bookingService.deductAmcVisit(subscriptionId);
        // Record the visit
        await client_js_1.db.insert(payments_js_1.amcVisits).values({
            contractId: subscriptionId,
            bookingId: bookingId,
            visitNumber: sub.visitsUsed + 1,
            status: 'scheduled'
        });
        logger_js_1.logger.info({ customerId, subscriptionId, bookingId }, '[amc] Visit used');
        return { bookingId };
    }
    // ─── Cancel subscription (Pro-rata Refund) ──────────────────────────────────
    async cancel(subscriptionId, customerId) {
        const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.customerId, customerId))).limit(1);
        if (!sub)
            throw errors_js_1.Errors.notFound('AMC subscription');
        if (sub.status === 'cancelled')
            throw errors_js_1.Errors.conflict('Subscription already cancelled');
        const [plan] = await client_js_1.db.select().from(services_js_1.amcPlans).where((0, drizzle_orm_1.eq)(services_js_1.amcPlans.id, sub.planId)).limit(1);
        // Pro-rata refund calculation
        const totalVisits = plan?.totalVisits ?? 1;
        const remainingVisits = sub.visitsRemaining;
        const planPrice = parseFloat(String(plan?.price ?? 0));
        const refundAmount = parseFloat(((planPrice / totalVisits) * remainingVisits).toFixed(2));
        await client_js_1.db.update(payments_js_1.amcSubscriptions)
            .set({ status: 'cancelled' })
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
        logger_js_1.logger.info({ subscriptionId, refundAmount }, '[amc] Cancelled with pro-rata refund');
        // In a real system, you would trigger Razorpay refund API here via PaymentService
        return { refundAmount };
    }
    // ─── Pause / Resume ─────────────────────────────────────────────────────────
    async pause(subscriptionId, customerId) {
        const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.customerId, customerId)))
            .limit(1);
        if (!sub)
            throw errors_js_1.Errors.notFound('Subscription');
        if (sub.status !== 'active')
            throw errors_js_1.Errors.validation({ status: 'Only active subscriptions can be paused' });
        await client_js_1.db.update(payments_js_1.amcSubscriptions).set({ status: 'paused' }).where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
        logger_js_1.logger.info({ subscriptionId }, '[amc] Paused');
    }
    async resume(subscriptionId, customerId) {
        const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId), (0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.customerId, customerId)))
            .limit(1);
        if (!sub)
            throw errors_js_1.Errors.notFound('Subscription');
        if (sub.status !== 'paused')
            throw errors_js_1.Errors.validation({ status: 'Only paused subscriptions can be resumed' });
        await client_js_1.db.update(payments_js_1.amcSubscriptions).set({ status: 'active' }).where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
        logger_js_1.logger.info({ subscriptionId }, '[amc] Resumed');
    }
    // ─── Check expiry (run daily by cron) ────────────────────────────────────────
    async checkExpiry() {
        const today = new Date().toISOString().slice(0, 10);
        const result = await client_js_1.db.update(payments_js_1.amcSubscriptions)
            .set({ status: 'expired' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.status, 'active'), (0, drizzle_orm_1.lte)(payments_js_1.amcSubscriptions.endDate, today)))
            .returning({ id: payments_js_1.amcSubscriptions.id });
        logger_js_1.logger.info({ expired: result.length }, '[amc] Expired subscriptions updated');
        return result.length;
    }
    // ─── Renew ──────────────────────────────────────────────────────────────────
    async renewSubscription(subscriptionId, paymentId) {
        const [sub] = await client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId)).limit(1);
        if (!sub)
            throw errors_js_1.Errors.notFound('AMC subscription');
        const [plan] = await client_js_1.db.select().from(services_js_1.amcPlans).where((0, drizzle_orm_1.eq)(services_js_1.amcPlans.id, sub.planId)).limit(1);
        if (!plan)
            throw errors_js_1.Errors.notFound('AMC plan');
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.validityMonths);
        await client_js_1.db.update(payments_js_1.amcSubscriptions)
            .set({
            status: 'active',
            paymentId,
            startDate: startDate.toISOString().slice(0, 10),
            endDate: endDate.toISOString().slice(0, 10),
            visitsUsed: 0,
            visitsRemaining: plan.totalVisits,
            renewedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId));
        logger_js_1.logger.info({ subscriptionId }, '[amc] Renewed');
    }
    // ─── Get subscriptions ───────────────────────────────────────────────────────
    async getByCustomer(customerId) {
        return client_js_1.db.select().from(payments_js_1.amcSubscriptions)
            .where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.customerId, customerId))
            .orderBy(payments_js_1.amcSubscriptions.createdAt);
    }
}
exports.AmcService = AmcService;
exports.amcService = new AmcService();
//# sourceMappingURL=amc.service.js.map