"use strict";
/**
 * Wallet Router — Customer & Partner Wallet APIs
 *
 * Endpoints:
 *
 *   GET  /api/v1/wallet/balance            — Get current wallet balance
 *   GET  /api/v1/wallet/transactions       — Transaction history (paginated)
 *   POST /api/v1/wallet/topup              — Initiate wallet top-up (creates Razorpay order)
 *   POST /api/v1/wallet/topup/verify       — Confirm top-up after Razorpay payment
 *   GET  /api/v1/wallet/referral/code      — Get/generate my referral code
 *   POST /api/v1/wallet/referral/apply     — Apply a referral code (during signup flow)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRouter = walletRouter;
const wallet_service_js_1 = require("../../services/payment/wallet.service.js");
const referral_service_js_1 = require("../../services/payment/referral.service.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const zod_1 = require("zod");
const rbac_js_1 = require("../middleware/rbac.js");
async function walletRouter(fastify) {
    const { authenticate } = fastify;
    const customerGuard = [authenticate, (0, rbac_js_1.requireRole)('customer')];
    const anyGuard = [authenticate]; // customers + partners
    // ─── Balance ────────────────────────────────────────────────────────────────
    fastify.get('/balance', { preHandler: anyGuard }, async (req, reply) => {
        const ownerType = req.user.role === 'partner' ? 'partner' : 'customer';
        const balance = await wallet_service_js_1.walletService.getBalance(req.user.sub, ownerType);
        return (0, response_js_1.sendOk)(reply, balance);
    });
    // ─── Transactions ───────────────────────────────────────────────────────────
    fastify.get('/transactions', { preHandler: anyGuard }, async (req, reply) => {
        const ownerType = req.user.role === 'partner' ? 'partner' : 'customer';
        const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);
        const offset = parseInt(req.query.offset ?? '0', 10);
        const txns = await wallet_service_js_1.walletService.getTransactions(req.user.sub, ownerType, limit, offset);
        return (0, response_js_1.sendOk)(reply, { transactions: txns, limit, offset });
    });
    // ─── Top-up: Initiate ───────────────────────────────────────────────────────
    // Creates a Razorpay order for wallet top-up amount.
    // Frontend completes payment with Razorpay SDK, then calls /topup/verify.
    const topupSchema = zod_1.z.object({
        amount: zod_1.z.number().min(10).max(50_000), // ₹10–₹50,000
    });
    fastify.post('/topup', { preHandler: customerGuard }, async (req, reply) => {
        const parsed = topupSchema.safeParse(req.body);
        if (!parsed.success)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation(parsed.error.flatten().fieldErrors));
        const { amount } = parsed.data;
        const userId = req.user.sub;
        // Import here to avoid circular dep issues at module load
        const { default: Razorpay } = await import('razorpay');
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const order = await rzp.orders.create({
            amount: Math.round(amount * 100), // paise
            currency: 'INR',
            receipt: `topup_${userId.slice(0, 8)}_${Date.now()}`,
            notes: { type: 'wallet_topup', userId },
        });
        logger_js_1.logger.info({ userId, amount, orderId: order.id }, '[wallet] Top-up order created');
        return (0, response_js_1.sendOk)(reply, {
            orderId: order.id,
            amount,
            currency: 'INR',
            message: 'Complete payment to credit your wallet',
        });
    });
    // ─── Top-up: Verify & Credit ────────────────────────────────────────────────
    const topupVerifySchema = zod_1.z.object({
        razorpayPaymentId: zod_1.z.string().min(1),
        razorpayOrderId: zod_1.z.string().min(1),
        razorpaySignature: zod_1.z.string().min(1),
        amount: zod_1.z.number().min(10),
    });
    fastify.post('/topup/verify', { preHandler: customerGuard }, async (req, reply) => {
        const parsed = topupVerifySchema.safeParse(req.body);
        if (!parsed.success)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation(parsed.error.flatten().fieldErrors));
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, amount } = parsed.data;
        // Verify Razorpay signature to prevent spoofing
        const crypto = await import('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');
        if (expectedSignature !== razorpaySignature) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Invalid payment signature'));
        }
        // Credit wallet
        const result = await wallet_service_js_1.walletService.processTopUp(req.user.sub, amount, razorpayPaymentId);
        return (0, response_js_1.sendOk)(reply, {
            transactionId: result.transactionId,
            newBalance: result.newBalance,
            message: `\u20b9${amount} credited to your wallet`,
        });
    });
    // ─── Referral: Get/Generate Code ────────────────────────────────────────────
    fastify.get('/referral/code', { preHandler: customerGuard }, async (req, reply) => {
        const referralInfo = await referral_service_js_1.referralService.generate(req.user.sub);
        return (0, response_js_1.sendOk)(reply, referralInfo);
    });
    // ─── Referral: Apply Code ────────────────────────────────────────────────────
    const applyReferralSchema = zod_1.z.object({
        referralCode: zod_1.z.string().min(1).max(20),
    });
    fastify.post('/referral/apply', { preHandler: anyGuard }, async (req, reply) => {
        const parsed = applyReferralSchema.safeParse(req.body);
        if (!parsed.success)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation(parsed.error.flatten().fieldErrors));
        await referral_service_js_1.referralService.applyOnSignup(parsed.data.referralCode, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: 'Referral code applied successfully' });
    });
}
//# sourceMappingURL=wallet.js.map