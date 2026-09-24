"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRouter = callRouter;
exports.twilioWebhookRouter = twilioWebhookRouter;
const call_service_js_1 = require("../../services/communication/call.service.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const zod_1 = require("zod");
const client_js_1 = require("../../db/client.js");
const chat_js_1 = require("../../db/schema/chat.js");
const drizzle_orm_1 = require("drizzle-orm");
async function callRouter(fastify) {
    const { authenticate } = fastify;
    const anyGuard = [authenticate];
    // ─── Initiate Call ────────────────────────────────────────────────────────────
    const initiateSchema = zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
    });
    fastify.post('/initiate', { preHandler: anyGuard }, async (req, reply) => {
        const parsed = initiateSchema.safeParse(req.body);
        if (!parsed.success)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation(parsed.error.flatten().fieldErrors));
        const role = req.user.role === 'partner' ? 'partner' : 'customer';
        await call_service_js_1.callService.initiateCall(parsed.data.bookingId, req.user.sub, role);
        return (0, response_js_1.sendOk)(reply, { message: 'Call initiated' });
    });
}
// Separate router for Twilio webhooks (unauthenticated)
async function twilioWebhookRouter(fastify) {
    fastify.post('/connect/:sessionId', async (req, reply) => {
        const { sessionId } = req.params;
        const { receiver } = req.query;
        const [session] = await client_js_1.db.select().from(chat_js_1.callSessions).where((0, drizzle_orm_1.eq)(chat_js_1.callSessions.id, sessionId)).limit(1);
        if (!session || session.status !== 'active') {
            const response = '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Call session expired or invalid.</Say></Response>';
            return reply.type('text/xml').send(response);
        }
        const twiML = call_service_js_1.callService.generateConnectTwiML(receiver);
        return reply.type('text/xml').send(twiML);
    });
}
//# sourceMappingURL=call.js.map