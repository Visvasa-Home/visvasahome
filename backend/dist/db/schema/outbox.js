"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outboxEvents = exports.outboxStatusEnum = void 0;
/**
 * Drizzle Schema — Outbox Events
 * Layer 4: Data
 *
 * Implements the Transactional Outbox Pattern to guarantee at-least-once
 * delivery of domain events to the Event Bus (Kafka/BullMQ).
 */
const pg_core_1 = require("drizzle-orm/pg-core");
exports.outboxStatusEnum = (0, pg_core_1.pgEnum)('outbox_status', ['pending', 'processed', 'failed']);
exports.outboxEvents = (0, pg_core_1.pgTable)('outbox_events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    aggregateType: (0, pg_core_1.varchar)('aggregate_type', { length: 50 }).notNull(), // e.g., 'Booking', 'Payment'
    aggregateId: (0, pg_core_1.varchar)('aggregate_id', { length: 50 }).notNull(),
    eventType: (0, pg_core_1.varchar)('event_type', { length: 100 }).notNull(), // e.g., 'booking.created'
    payload: (0, pg_core_1.jsonb)('payload').notNull(),
    status: (0, exports.outboxStatusEnum)('status').default('pending').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
    error: (0, pg_core_1.varchar)('error', { length: 1024 }),
}, (t) => ({
    statusIdx: (0, pg_core_1.index)('outbox_status_idx').on(t.status),
}));
//# sourceMappingURL=outbox.js.map