"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = paymentsRouter;
const payment_service_js_1 = require("../../services/payment/payment.service.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const drizzle_orm_1 = require("drizzle-orm");
const idempotency_js_1 = require("../middleware/idempotency.js");
const amc_service_js_1 = require("../../services/amc/amc.service.js");
async function paymentsRouter(fastify) {
    // POST /api/v1/payments/webhook
    fastify.post('/webhook', {
        config: { rawBody: true }, // need raw body for HMAC
        preHandler: [idempotency_js_1.withIdempotency],
    }, async (request, reply) => {
        const signature = request.headers['x-razorpay-signature'];
        if (!signature) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Missing webhook signature'));
        }
        const rawBody = JSON.stringify(request.body);
        const isValid = await payment_service_js_1.paymentService.verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            logger_js_1.logger.warn('[payments] Invalid signature');
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Invalid webhook signature'));
        }
        const payload = request.body;
        const { event } = payload;
        logger_js_1.logger.info({ event }, '[payments] Webhook received');
        try {
            await payment_service_js_1.paymentService.handleWebhook(event, payload.payload);
            if (event === 'payment.captured') {
                const entity = payload.payload.payment.entity;
                const subscriptionId = entity.notes?.subscription_id;
                if (subscriptionId) {
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
            logger_js_1.logger.error({ event, err }, '[payments] Error processing webhook');
            return (0, response_js_1.sendError)(reply, err);
        }
    });
}
//# sourceMappingURL=payments.js.map