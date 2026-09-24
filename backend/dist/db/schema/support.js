"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketMessages = exports.tickets = exports.ticketPriorityEnum = exports.ticketStatusEnum = void 0;
/**
 * Drizzle Schema — Support & Disputes
 * Layer 4: Data
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users_js_1 = require("./users.js");
const bookings_js_1 = require("./bookings.js");
exports.ticketStatusEnum = (0, pg_core_1.pgEnum)('ticket_status', ['open', 'in_progress', 'resolved', 'closed']);
exports.ticketPriorityEnum = (0, pg_core_1.pgEnum)('ticket_priority', ['low', 'medium', 'high', 'urgent']);
exports.tickets = (0, pg_core_1.pgTable)('tickets', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_js_1.users.id),
    bookingId: (0, pg_core_1.uuid)('booking_id').references(() => bookings_js_1.bookings.id),
    subject: (0, pg_core_1.varchar)('subject', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    status: (0, exports.ticketStatusEnum)('status').default('open').notNull(),
    priority: (0, exports.ticketPriorityEnum)('priority').default('medium').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    userIdx: (0, pg_core_1.index)('ticket_user_idx').on(t.userId),
    statusIdx: (0, pg_core_1.index)('ticket_status_idx').on(t.status),
}));
exports.ticketMessages = (0, pg_core_1.pgTable)('ticket_messages', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    ticketId: (0, pg_core_1.uuid)('ticket_id').notNull().references(() => exports.tickets.id, { onDelete: 'cascade' }),
    senderId: (0, pg_core_1.uuid)('sender_id').notNull().references(() => users_js_1.users.id), // Can be user or support agent
    message: (0, pg_core_1.text)('message').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    ticketIdx: (0, pg_core_1.index)('ticket_msg_idx').on(t.ticketId),
}));
//# sourceMappingURL=support.js.map