"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportService = exports.SupportService = void 0;
/**
 * SupportService — Layer 3: Domain Services
 *
 * Manages customer support tickets, disputes, and messaging.
 */
const client_js_1 = require("../../db/client.js");
const support_js_1 = require("../../db/schema/support.js");
const drizzle_orm_1 = require("drizzle-orm");
const errors_js_1 = require("../../lib/errors.js");
class SupportService {
    async createTicket(userId, subject, description, bookingId) {
        const [ticket] = await client_js_1.db.insert(support_js_1.tickets).values({
            userId,
            subject,
            description,
            bookingId,
        }).returning();
        return ticket;
    }
    async replyToTicket(ticketId, senderId, message) {
        // 1. Verify ticket exists
        const [ticket] = await client_js_1.db.select().from(support_js_1.tickets).where((0, drizzle_orm_1.eq)(support_js_1.tickets.id, ticketId)).limit(1);
        if (!ticket)
            throw errors_js_1.Errors.notFound('Ticket not found');
        // 2. Add message
        const [msg] = await client_js_1.db.insert(support_js_1.ticketMessages).values({
            ticketId,
            senderId,
            message,
        }).returning();
        // 3. Auto-reopen ticket if closed
        if (ticket.status === 'closed' || ticket.status === 'resolved') {
            await client_js_1.db.update(support_js_1.tickets).set({ status: 'open', updatedAt: new Date() }).where((0, drizzle_orm_1.eq)(support_js_1.tickets.id, ticketId));
        }
        else {
            await client_js_1.db.update(support_js_1.tickets).set({ updatedAt: new Date() }).where((0, drizzle_orm_1.eq)(support_js_1.tickets.id, ticketId));
        }
        return msg;
    }
    async getTicketDetails(ticketId) {
        const [ticket] = await client_js_1.db.select().from(support_js_1.tickets).where((0, drizzle_orm_1.eq)(support_js_1.tickets.id, ticketId)).limit(1);
        if (!ticket)
            throw errors_js_1.Errors.notFound('Ticket not found');
        const messages = await client_js_1.db.select()
            .from(support_js_1.ticketMessages)
            .where((0, drizzle_orm_1.eq)(support_js_1.ticketMessages.ticketId, ticketId))
            .orderBy((0, drizzle_orm_1.desc)(support_js_1.ticketMessages.createdAt));
        return { ticket, messages };
    }
}
exports.SupportService = SupportService;
exports.supportService = new SupportService();
//# sourceMappingURL=support.service.js.map