"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooksRouter = webhooksRouter;
const payment_service_js_1 = require("../../services/payment/payment.service.js");
const amc_service_js_1 = require("../../services/amc/amc.service.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const drizzle_orm_1 = require("drizzle-orm");
const idempotency_js_1 = require("../middleware/idempotency.js");
async function webhooksRouter(fastify) {
    // POST /api/v1/webhooks/razorpay
    fastify.post('/razorpay', {
        config: { rawBody: true }, // need raw body for HMAC
        preHandler: [idempotency_js_1.withIdempotency],
    }, async (request, reply) => {
        const signature = request.headers['x-razorpay-signature'];
        if (!signature) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Missing webhook signature'));
        }
        // Get raw body string for HMAC verification
        const rawBody = JSON.stringify(request.body);
        const isValid = payment_service_js_1.paymentService.verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            logger_js_1.logger.warn('[webhooks] Invalid Razorpay signature');
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Invalid webhook signature'));
        }
        const payload = request.body;
        const { event } = payload;
        logger_js_1.logger.info({ event }, '[webhooks] Razorpay event received');
        try {
            await payment_service_js_1.paymentService.handleWebhook(event, payload.payload);
            // Handle AMC subscription activation
            if (event === 'payment.captured') {
                const entity = payload.payload.payment.entity;
                const subscriptionId = entity.notes?.subscription_id;
                if (subscriptionId) {
                    // Check if this is an AMC payment
                    const [sub] = await client_js_1.db.select({ id: payments_js_1.amcSubscriptions.id, status: payments_js_1.amcSubscriptions.status })
                        .from(payments_js_1.amcSubscriptions).where((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.id, subscriptionId)).limit(1);
                    if (sub && sub.status === 'pending_payment') {
                        await amc_service_js_1.amcService.activate(subscriptionId, entity.id);
                    }
                }
            }
            return (0, response_js_1.sendOk)(reply, { received: true });
        }
        catch (err) {
            logger_js_1.logger.error({ event, err }, '[webhooks] Error processing event');
            return (0, response_js_1.sendError)(reply, err);
        }
    });
    // GET /api/v1/webhooks/health  (for webhook endpoint verification)
    fastify.get('/health', async (_req, reply) => {
        return (0, response_js_1.sendOk)(reply, { status: 'ok', service: 'webhook-receiver' });
    });
}
//# sourceMappingURL=webhooks.js.map