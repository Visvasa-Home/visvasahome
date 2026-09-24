"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outboxWorker = exports.OutboxWorker = void 0;
/**
 * Outbox Worker
 * Polls the outbox_events table and publishes to EventBus Queue.
 */
const client_js_1 = require("../../db/client.js");
const outbox_js_1 = require("../../db/schema/outbox.js");
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
class OutboxWorker {
    isRunning = false;
    intervalId;
    start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        // Poll every 5 seconds. In a real system, we might use logical decoding (Debezium/Kafka Connect)
        // or Postgres LISTEN/NOTIFY for real-time pushing.
        this.intervalId = setInterval(() => this.processOutbox(), 5000);
        logger_js_1.logger.info('[outbox] Outbox worker started');
    }
    stop() {
        this.isRunning = false;
        if (this.intervalId)
            clearInterval(this.intervalId);
        logger_js_1.logger.info('[outbox] Outbox worker stopped');
    }
    async processOutbox() {
        try {
            // 1. Fetch pending events (batch of 50)
            const pendingEvents = await client_js_1.db.select()
                .from(outbox_js_1.outboxEvents)
                .where((0, drizzle_orm_1.eq)(outbox_js_1.outboxEvents.status, 'pending'))
                .limit(50);
            if (pendingEvents.length === 0)
                return;
            // 2. Publish to EventBus
            for (const event of pendingEvents) {
                try {
                    await queue_js_1.eventBusQueue.add(`event:${event.id}`, {
                        eventId: event.id,
                        aggregateType: event.aggregateType,
                        aggregateId: event.aggregateId,
                        eventType: event.eventType,
                        payload: event.payload,
                    });
                    // 3. Mark as processed
                    await client_js_1.db.update(outbox_js_1.outboxEvents)
                        .set({ status: 'processed', processedAt: new Date() })
                        .where((0, drizzle_orm_1.eq)(outbox_js_1.outboxEvents.id, event.id));
                }
                catch (err) {
                    logger_js_1.logger.error({ err, eventId: event.id }, '[outbox] Failed to publish event');
                    await client_js_1.db.update(outbox_js_1.outboxEvents)
                        .set({ status: 'failed', error: err.message?.substring(0, 1024) })
                        .where((0, drizzle_orm_1.eq)(outbox_js_1.outboxEvents.id, event.id));
                }
            }
        }
        catch (err) {
            logger_js_1.logger.error({ err }, '[outbox] Worker encountered an error during polling');
        }
    }
}
exports.OutboxWorker = OutboxWorker;
exports.outboxWorker = new OutboxWorker();
//# sourceMappingURL=outbox.worker.js.map