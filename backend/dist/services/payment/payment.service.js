"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
/**
 * PaymentService — Layer 3: Domain Services
 *
 * Responsibilities:
 *   1. Create Razorpay orders for bookings/AMC subscriptions
 *   2. Verify Razorpay webhook signatures
 *   3. On payment captured → create Commission + WalletTransaction
 *   4. Initiate refunds via Razorpay
 *   5. Process partner settlements
 */
const razorpay_1 = __importDefault(require("razorpay"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const partners_js_1 = require("../../db/schema/partners.js");
const outbox_js_1 = require("../../db/schema/outbox.js");
const contractor_js_1 = require("../../db/schema/contractor.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const pricing_service_js_1 = require("../pricing/pricing.service.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
const vault_js_1 = require("../../lib/vault.js");
// Commission configuration
const DEFAULT_COMMISSION_PCT = parseFloat(process.env.DEFAULT_COMMISSION_PCT ?? '20');
// ─── PaymentService ───────────────────────────────────────────────────────────
class PaymentService {
    razorpayInstance = null;
    async getRazorpay() {
        if (this.razorpayInstance)
            return this.razorpayInstance;
        // Securely fetch API credentials from Vault
        const key_id = await vault_js_1.vault.getSecret('RAZORPAY_KEY_ID');
        const key_secret = await vault_js_1.vault.getSecret('RAZORPAY_KEY_SECRET');
        this.razorpayInstance = new razorpay_1.default({ key_id, key_secret });
        return this.razorpayInstance;
    }
    // ─── Create Razorpay order ───────────────────────────────────────────────────
    async createOrder(bookingId) {
        const [booking] = await client_js_1.paymentDb.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        const finalAmount = parseFloat(String(booking.finalAmount));
        // For ₹0 AMC visits — skip payment, auto-capture
        if (finalAmount === 0) {
            const [payment] = await client_js_1.paymentDb.insert(payments_js_1.payments).values({
                bookingId,
                amount: '0',
                status: 'captured',
                method: 'wallet',
                paidAt: new Date(),
            }).returning();
            await this.onPaymentCaptured(payment.id, bookingId);
            return { razorpayOrderId: '', amount: 0, currency: 'INR', paymentId: payment.id };
        }
        // Create Razorpay order (amount in paise)
        const amountPaise = Math.round(finalAmount * 100);
        const rzp = await this.getRazorpay();
        const order = await rzp.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt: `bk_${bookingId.slice(0, 8)}`,
        });
        // Save payment record
        const [payment] = await client_js_1.paymentDb.insert(payments_js_1.payments).values({
            bookingId,
            amount: String(finalAmount),
            status: 'pending',
            razorpayOrderId: String(order.id),
        }).returning();
        return {
            razorpayOrderId: String(order.id),
            amount: finalAmount,
            currency: 'INR',
            paymentId: payment.id,
        };
    }
    // ─── Verify Razorpay webhook signature ───────────────────────────────────────
    async verifyWebhookSignature(body, signature) {
        const secret = await vault_js_1.vault.getSecret('RAZORPAY_WEBHOOK_SECRET');
        const expected = node_crypto_1.default
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');
        return node_crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    }
    // ─── Handle Razorpay webhook events ─────────────────────────────────────────
    async handleWebhook(event, payload) {
        logger_js_1.logger.info({ event }, '[payment] Webhook received');
        if (event === 'payment.captured') {
            const entity = payload
                .payment.entity;
            const { order_id: razorpayOrderId, id: razorpayPaymentId } = entity;
            const [payment] = await client_js_1.paymentDb.select().from(payments_js_1.payments)
                .where((0, drizzle_orm_1.eq)(payments_js_1.payments.razorpayOrderId, razorpayOrderId)).limit(1);
            if (!payment) {
                logger_js_1.logger.warn({ razorpayOrderId }, '[payment] No matching payment found for order');
                return;
            }
            await client_js_1.paymentDb.transaction(async (tx) => {
                await tx.update(payments_js_1.payments)
                    .set({
                    status: 'captured',
                    razorpayPaymentId,
                    paidAt: new Date(),
                })
                    .where((0, drizzle_orm_1.eq)(payments_js_1.payments.id, payment.id));
                // Outbox Pattern: Emit payment.captured
                await tx.insert(outbox_js_1.outboxEvents).values({
                    aggregateType: 'Payment',
                    aggregateId: payment.id,
                    eventType: 'payment.captured',
                    payload: { bookingId: payment.bookingId },
                });
                // Also emit booking.paid for dispatch
                await tx.insert(outbox_js_1.outboxEvents).values({
                    aggregateType: 'Booking',
                    aggregateId: payment.bookingId,
                    eventType: 'booking.paid',
                    payload: { paymentId: payment.id },
                });
            });
            // Payouts are handled later when booking is completed, or synchronously if needed
            await this.onPaymentCaptured(payment.id, payment.bookingId);
        }
        if (event === 'refund.processed') {
            const entity = payload
                .refund.entity;
            await client_js_1.paymentDb.update(payments_js_1.refunds)
                .set({ status: 'completed', completedAt: new Date(), razorpayRefundId: entity.id })
                .where((0, drizzle_orm_1.eq)(payments_js_1.refunds.razorpayRefundId, entity.id));
        }
    }
    // ─── Post-payment processing ─────────────────────────────────────────────────
    async onPaymentCaptured(paymentId, bookingId) {
        const [booking] = await client_js_1.paymentDb.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking || !booking.partnerId)
            return;
        const grossAmount = parseFloat(String(booking.finalAmount));
        const { commissionAmount, taxOnCommission, partnerEarning } = pricing_service_js_1.pricingService.calculateCommission(grossAmount, DEFAULT_COMMISSION_PCT);
        // Delegate strict double-entry accounting to ledger service
        const { ledgerService } = await import('../ledger/ledger.service.js');
        await client_js_1.paymentDb.transaction(async (tx) => {
            // 1. Commission ledger record
            await tx.insert(payments_js_1.commissions).values({
                paymentId,
                bookingId,
                partnerId: booking.partnerId,
                grossAmount: String(grossAmount),
                commissionPct: DEFAULT_COMMISSION_PCT,
                commissionAmount: String(commissionAmount),
                taxOnCommission: String(taxOnCommission),
                partnerEarning: String(partnerEarning),
            });
            // 2. Credit partner or contractor wallet
            const [partner] = await tx.select({
                balance: partners_js_1.partners.walletBalance,
                contractorId: partners_js_1.partners.contractorId,
            }).from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, booking.partnerId)).limit(1);
            if (partner?.contractorId) {
                // Import contractorProfiles locally or globally. We need to add it to imports.
                // Credit the contractor's wallet instead of the technician.
                const [contractor] = await tx.select({ balance: contractor_js_1.contractorProfiles.walletBalance })
                    .from(contractor_js_1.contractorProfiles).where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, partner.contractorId)).limit(1);
                const newBalance = parseFloat(String(contractor?.balance ?? 0)) + partnerEarning;
                await tx.update(contractor_js_1.contractorProfiles)
                    .set({ walletBalance: String(newBalance) })
                    .where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, partner.contractorId));
                await tx.insert(payments_js_1.walletTransactions).values({
                    contractorId: partner.contractorId,
                    bookingId,
                    amount: String(partnerEarning),
                    balanceAfter: String(newBalance),
                    txType: 'earning',
                    description: `Earning for booking ${bookingId.slice(0, 8)} (Technician: ${booking.partnerId})`,
                });
            }
            else {
                // Individual partner
                const newBalance = parseFloat(String(partner?.balance ?? 0)) + partnerEarning;
                await tx.update(partners_js_1.partners)
                    .set({ walletBalance: String(newBalance) })
                    .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, booking.partnerId));
                await tx.insert(payments_js_1.walletTransactions).values({
                    partnerId: booking.partnerId,
                    bookingId,
                    amount: String(partnerEarning),
                    balanceAfter: String(newBalance),
                    txType: 'earning',
                    description: `Earning for booking ${bookingId.slice(0, 8)}`,
                });
            }
            // 4. Invoice generation is now handled asynchronously via 'payment.captured' event
            // See invoice.service.ts for PDF generation and DB record insertion
            // 5. Ledger Entries (Double-entry accounting)
            // Debit Platform (receiving money from payment gateway)
            await tx.insert(payments_js_1.ledgerEntries).values({
                bookingId,
                accountType: 'platform',
                debit: String(grossAmount),
                narration: `Payment received for booking ${bookingId.slice(0, 8)}`,
            });
            // Credit Partner/Contractor
            await tx.insert(payments_js_1.ledgerEntries).values({
                bookingId,
                accountType: partner?.contractorId ? 'contractor' : 'partner',
                accountId: partner?.contractorId ? partner.contractorId : booking.partnerId,
                credit: String(partnerEarning),
                narration: `Earning for booking ${bookingId.slice(0, 8)}`,
            });
            // Credit Platform (commission)
            await tx.insert(payments_js_1.ledgerEntries).values({
                bookingId,
                accountType: 'platform',
                credit: String(commissionAmount),
                narration: `Commission for booking ${bookingId.slice(0, 8)}`,
            });
        });
        // We no longer trigger startDispatch here directly. The event bus handles 'booking.paid'
        logger_js_1.logger.info({ paymentId, bookingId, partnerEarning }, '[payment] Partner payout generated for captured payment');
    }
    // ─── Refund ──────────────────────────────────────────────────────────────────
    async initiateRefund(paymentId, amount, reason, initiatedById) {
        const [payment] = await client_js_1.paymentDb.select().from(payments_js_1.payments).where((0, drizzle_orm_1.eq)(payments_js_1.payments.id, paymentId)).limit(1);
        if (!payment)
            throw errors_js_1.Errors.notFound('Payment');
        if (payment.status !== 'captured') {
            throw new errors_js_2.AppError('Only captured payments can be refunded', 400, 'PAYMENT_ALREADY_CAPTURED');
        }
        const amountPaise = Math.round(amount * 100);
        const rzp = await this.getRazorpay();
        const rzpRefund = await rzp.payments.refund(payment.razorpayPaymentId, {
            amount: amountPaise,
            notes: { reason },
        });
        const [refund] = await client_js_1.paymentDb.insert(payments_js_1.refunds).values({
            paymentId,
            amount: String(amount),
            reason,
            status: 'initiated',
            razorpayRefundId: String(rzpRefund.id),
            initiatedById,
        }).returning({ id: payments_js_1.refunds.id });
        return refund.id;
    }
    // ─── Settlement ───────────────────────────────────────────────────────────────
    async requestSettlement(partnerId, amount) {
        const [partner] = await client_js_1.paymentDb.select({ balance: partners_js_1.partners.walletBalance })
            .from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId)).limit(1);
        if (!partner)
            throw errors_js_1.Errors.notFound('Partner');
        if (parseFloat(String(partner.balance)) < amount) {
            throw errors_js_1.Errors.conflict('Insufficient wallet balance');
        }
        const MIN_PAYOUT = parseFloat(process.env.MIN_PAYOUT_AMOUNT ?? '100');
        if (amount < MIN_PAYOUT)
            throw errors_js_1.Errors.conflict(`Minimum payout is ₹${MIN_PAYOUT}`);
        const [settlement] = await client_js_1.paymentDb.insert(payments_js_1.settlements).values({
            partnerId,
            amount: String(amount),
            status: 'pending',
        }).returning({ id: payments_js_1.settlements.id });
        return settlement.id;
    }
    async processSettlement(settlementId, adminId, utrNumber) {
        const [settlement] = await client_js_1.paymentDb.select().from(payments_js_1.settlements)
            .where((0, drizzle_orm_1.eq)(payments_js_1.settlements.id, settlementId)).limit(1);
        if (!settlement)
            throw errors_js_1.Errors.notFound('Settlement');
        if (settlement.status !== 'pending')
            throw errors_js_1.Errors.conflict('Settlement already processed');
        await client_js_1.paymentDb.transaction(async (tx) => {
            const amount = parseFloat(String(settlement.amount));
            // Debit partner wallet
            const [partner] = await tx.select({
                balance: partners_js_1.partners.walletBalance,
                contractorId: partners_js_1.partners.contractorId
            })
                .from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, settlement.partnerId)).limit(1);
            const newBalance = parseFloat(String(partner?.balance ?? 0)) - amount;
            await tx.update(partners_js_1.partners)
                .set({ walletBalance: String(Math.max(0, newBalance)) })
                .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, settlement.partnerId));
            // WalletTransaction (payout)
            await tx.insert(payments_js_1.walletTransactions).values({
                partnerId: settlement.partnerId,
                settlementId,
                amount: String(-amount),
                balanceAfter: String(Math.max(0, newBalance)),
                txType: 'payout',
                description: `Payout settlement ${settlementId.slice(0, 8)}, UTR: ${utrNumber}`,
            });
            // Mark settlement completed
            await tx.update(payments_js_1.settlements)
                .set({
                status: 'completed',
                utrNumber,
                processedAt: new Date(),
                initiatedById: adminId,
            })
                .where((0, drizzle_orm_1.eq)(payments_js_1.settlements.id, settlementId));
            // Record in payouts table
            await tx.insert(payments_js_1.payouts).values({
                beneficiaryId: settlement.partnerId,
                beneficiaryType: partner?.contractorId ? 'CONTRACTOR' : 'PARTNER',
                periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // example past week
                periodEnd: new Date(),
                gross: String(amount),
                commission: '0',
                tds: '0',
                net: String(amount),
                status: 'completed',
            });
            // Emit event
            await tx.insert(outbox_js_1.outboxEvents).values({
                aggregateType: 'Payout',
                aggregateId: settlementId,
                eventType: 'payout.initiated',
                payload: { beneficiaryId: settlement.partnerId, amount },
            });
        });
        logger_js_1.logger.info({ settlementId, adminId }, '[payment] Settlement processed');
    }
}
exports.PaymentService = PaymentService;
// Need to import AppError for the refund method
const errors_js_2 = require("../../lib/errors.js");
exports.paymentService = new PaymentService();
//# sourceMappingURL=payment.service.js.map