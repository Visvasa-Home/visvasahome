"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSessions = exports.chatMessagesRelations = exports.chatRoomsRelations = exports.chatMessages = exports.chatRooms = exports.senderRoleEnum = exports.roomStatusEnum = void 0;
/**
 * Drizzle Schema — Chat Service
 * Database: visvasahome_chat
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.roomStatusEnum = (0, pg_core_1.pgEnum)('room_status', ['active', 'closed']);
exports.senderRoleEnum = (0, pg_core_1.pgEnum)('sender_role', ['customer', 'partner', 'admin', 'system']);
exports.chatRooms = (0, pg_core_1.pgTable)('chat_rooms', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').notNull(), // Soft ref to BookingDB
    customerId: (0, pg_core_1.uuid)('customer_id').notNull(), // Soft ref to UserDB
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull(), // Soft ref to ProviderDB
    status: (0, exports.roomStatusEnum)('status').default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    bookingIdx: (0, pg_core_1.index)('chat_rooms_booking_idx').on(t.bookingId),
}));
exports.chatMessages = (0, pg_core_1.pgTable)('chat_messages', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    roomId: (0, pg_core_1.uuid)('room_id').notNull().references(() => exports.chatRooms.id, { onDelete: 'cascade' }),
    senderId: (0, pg_core_1.uuid)('sender_id').notNull(), // Soft ref to the user/partner ID
    senderRole: (0, exports.senderRoleEnum)('sender_role').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    roomIdx: (0, pg_core_1.index)('chat_messages_room_idx').on(t.roomId),
}));
exports.chatRoomsRelations = (0, drizzle_orm_1.relations)(exports.chatRooms, ({ many }) => ({
    messages: many(exports.chatMessages),
}));
exports.chatMessagesRelations = (0, drizzle_orm_1.relations)(exports.chatMessages, ({ one }) => ({
    room: one(exports.chatRooms, { fields: [exports.chatMessages.roomId], references: [exports.chatRooms.id] }),
}));
exports.callSessions = (0, pg_core_1.pgTable)('call_sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').notNull(), // Soft ref to BookingDB
    customerId: (0, pg_core_1.uuid)('customer_id').notNull(),
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull(),
    customerNumber: (0, pg_core_1.varchar)('customer_number', { length: 20 }).notNull(),
    partnerNumber: (0, pg_core_1.varchar)('partner_number', { length: 20 }).notNull(),
    proxyNumber: (0, pg_core_1.varchar)('proxy_number', { length: 20 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    endedAt: (0, pg_core_1.timestamp)('ended_at'),
}, (t) => ({
    bookingIdx: (0, pg_core_1.index)('call_sessions_booking_idx').on(t.bookingId),
}));
//# sourceMappingURL=chat.js.map