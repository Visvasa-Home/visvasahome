"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const client_js_1 = require("../../db/client.js");
const chat_js_1 = require("../../db/schema/chat.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const users_js_1 = require("../../db/schema/users.js");
const partners_js_1 = require("../../db/schema/partners.js");
const drizzle_orm_1 = require("drizzle-orm");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
class CallService {
    client = null;
    twilioNumber = process.env.TWILIO_PHONE_NUMBER ?? '';
    getClient() {
        if (!this.client) {
            this.client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
        return this.client;
    }
    /**
     * Initiates a masked call between customer and partner
     */
    async initiateCall(bookingId, callerId, role) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking || !booking.partnerId)
            throw errors_js_1.Errors.notFound('Booking or Partner');
        // Ensure booking is in a state where calls are allowed (e.g. assigned, en_route)
        if (!['assigned', 'en_route', 'in_progress'].includes(booking.status)) {
            throw errors_js_1.Errors.conflict('Calls are only allowed for active bookings');
        }
        const [customer] = await client_js_1.db.select({ phone: users_js_1.users.phone }).from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, booking.customerId)).limit(1);
        const [partner] = await client_js_1.db.select({ phone: partners_js_1.partners.phone }).from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, booking.partnerId)).limit(1);
        if (!customer?.phone || !partner?.phone)
            throw errors_js_1.Errors.internal('Phone numbers missing');
        const callerPhone = role === 'customer' ? customer.phone : partner.phone;
        const receiverPhone = role === 'customer' ? partner.phone : customer.phone;
        // Check if there is an active session
        let [session] = await client_js_1.db.select()
            .from(chat_js_1.callSessions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(chat_js_1.callSessions.bookingId, bookingId), (0, drizzle_orm_1.eq)(chat_js_1.callSessions.status, 'active'), (0, drizzle_orm_1.gt)(chat_js_1.callSessions.expiresAt, new Date()))).limit(1);
        if (!session) {
            [session] = await client_js_1.db.insert(chat_js_1.callSessions).values({
                bookingId,
                customerId: booking.customerId,
                partnerId: booking.partnerId,
                customerNumber: customer.phone,
                partnerNumber: partner.phone,
                proxyNumber: this.twilioNumber,
                expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
            }).returning();
        }
        // Call the caller first, and when they pick up, connect them to receiver
        // The webhook url will provide the TwiML instructions
        const webhookUrl = `${process.env.API_BASE_URL}/api/v1/webhooks/twilio/connect/${session.id}?receiver=${encodeURIComponent(receiverPhone)}`;
        try {
            await this.getClient().calls.create({
                to: callerPhone,
                from: this.twilioNumber,
                url: webhookUrl, // Twilio fetches TwiML from this URL when caller answers
            });
            logger_js_1.logger.info({ bookingId, callerId, role }, '[call_service] Initiated masked call');
        }
        catch (err) {
            logger_js_1.logger.error({ err, bookingId }, '[call_service] Failed to initiate call');
            throw errors_js_1.Errors.internal('Failed to initiate call');
        }
    }
    /**
     * Generates TwiML to connect the call to the receiver
     */
    generateConnectTwiML(receiverPhone) {
        const response = new twilio_1.default.twiml.VoiceResponse();
        response.dial({
            callerId: this.twilioNumber, // Receiver sees proxy number
        }, receiverPhone);
        return response.toString();
    }
}
exports.callService = new CallService();
//# sourceMappingURL=call.service.js.map