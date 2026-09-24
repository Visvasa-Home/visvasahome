"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = exports.notificationTypeEnum = exports.notificationStatusEnum = void 0;
/**
 * Drizzle Schema — Notification Service
 * Database: visvasahome_outbox or visvasahome_notification
 */
const pg_core_1 = require("drizzle-orm/pg-core");
exports.notificationStatusEnum = (0, pg_core_1.pgEnum)('notification_status', ['pending', 'sent', 'failed']);
exports.notificationTypeEnum = (0, pg_core_1.pgEnum)('notification_type', ['push', 'sms', 'email', 'in_app']);
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(), // Target user/partner ID
    type: (0, exports.notificationTypeEnum)('type').notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    body: (0, pg_core_1.text)('body').notNull(),
    data: (0, pg_core_1.jsonb)('data'), // Any extra context (e.g., bookingId)
    status: (0, exports.notificationStatusEnum)('status').default('pending').notNull(),
    sentAt: (0, pg_core_1.timestamp)('sent_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    userStatusIdx: (0, pg_core_1.index)('notifications_user_status_idx').on(t.userId, t.status),
}));
//# sourceMappingURL=notifications.js.map