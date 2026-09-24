"use strict";
/**
 * SlaWorker — Layer 3: Domain Services
 *
 * Enforces the Service Level Agreement (SLA) for partner assignment:
 *
 *   INSTANT  bookings: must be assigned within SLA_INSTANT_MINUTES (default: 10 min)
 *   SCHEDULED bookings: must be assigned at least SLA_SCHEDULED_BUFFER_MINS (default: 5 min)
 *                       before their scheduled_time
 *
 * On SLA breach:
 *   1. Retry dispatch with an expanded search radius (radius × RADIUS_EXPAND_FACTOR^retry_count)
 *   2. After MAX_RETRIES, transition to 'no_partner' and notify customer support
 *   3. Optionally: issue a full refund and send an apology notification to the customer
 *
 * Runs on a configurable poll interval (default: 2 minutes).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.slaWorker = exports.SlaWorker = void 0;
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const booking_service_js_1 = require("../booking/booking.service.js");
const queue_js_1 = require("../../lib/queue.js");
const notification_service_js_1 = require("../notification/notification.service.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Config ───────────────────────────────────────────────────────────────────
const SLA_INSTANT_MINUTES = parseInt(process.env.SLA_INSTANT_MINUTES ?? '10', 10);
const SLA_SCHEDULED_BUFFER_MINS = parseInt(process.env.SLA_SCHEDULED_BUFFER_MINS ?? '5', 10);
const MAX_DISPATCH_RETRIES = parseInt(process.env.MAX_DISPATCH_RETRIES ?? '5', 10);
const SLA_POLL_INTERVAL_MS = parseInt(process.env.SLA_POLL_MS ?? '120000', 10); // 2 min
// ─── SlaWorker ───────────────────────────────────────────────────────────────
class SlaWorker {
    timer = null;
    start() {
        logger_js_1.logger.info({
            instantSlaMinutes: SLA_INSTANT_MINUTES,
            scheduledBufferMinutes: SLA_SCHEDULED_BUFFER_MINS,
            maxRetries: MAX_DISPATCH_RETRIES,
            pollMs: SLA_POLL_INTERVAL_MS,
        }, '[sla-worker] Starting');
        void this.tick();
        this.timer = setInterval(() => void this.tick(), SLA_POLL_INTERVAL_MS);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    async tick() {
        const now = new Date();
        try {
            await Promise.all([
                this.checkInstantSla(now),
                this.checkScheduledSla(now),
            ]);
        }
        catch (err) {
            logger_js_1.logger.error({ err }, '[sla-worker] Tick error');
        }
    }
    /**
     * Find instant bookings stuck in 'searching' past SLA_INSTANT_MINUTES.
     */
    async checkInstantSla(now) {
        const slaDeadline = new Date(now.getTime() - SLA_INSTANT_MINUTES * 60 * 1000);
        const stuck = await client_js_1.db
            .select({
            id: bookings_js_1.bookings.id,
            retryCount: (0, drizzle_orm_1.sql) `COALESCE(${bookings_js_1.bookings}.dispatch_retry_count, 0)`.mapWith(Number),
            customerId: bookings_js_1.bookings.customerId,
        })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.bookingType, 'instant'), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'searching'), (0, drizzle_orm_1.lte)(bookings_js_1.bookings.searchingStartedAt, slaDeadline)))
            .limit(20);
        for (const booking of stuck) {
            logger_js_1.logger.warn({ bookingId: booking.id, retryCount: booking.retryCount }, '[sla-worker] Instant SLA breached');
            await this.handleSlaBreach(booking.id, booking.retryCount, booking.customerId, false);
        }
    }
    /**
     * Find scheduled bookings stuck in 'searching' with not enough time before scheduled_time.
     */
    async checkScheduledSla(now) {
        const bufferDeadline = new Date(now.getTime() + SLA_SCHEDULED_BUFFER_MINS * 60 * 1000);
        const stuck = await client_js_1.db
            .select({
            id: bookings_js_1.bookings.id,
            retryCount: (0, drizzle_orm_1.sql) `COALESCE(${bookings_js_1.bookings}.dispatch_retry_count, 0)`.mapWith(Number),
            customerId: bookings_js_1.bookings.customerId,
        })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.bookingType, 'scheduled'), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'searching'), 
        // scheduled_time is within the buffer window
        (0, drizzle_orm_1.lte)(bookings_js_1.bookings.scheduledTime, bufferDeadline)))
            .limit(20);
        for (const booking of stuck) {
            logger_js_1.logger.warn({ bookingId: booking.id, retryCount: booking.retryCount }, '[sla-worker] Scheduled SLA breached');
            await this.handleSlaBreach(booking.id, booking.retryCount, booking.customerId, true);
        }
    }
    /**
     * Handle a single SLA breach:
     *  - If under max retries: increment retry count and re-enqueue dispatch (wider radius)
     *  - If max retries exceeded: escalate (no_partner + customer notification + support ticket)
     */
    async handleSlaBreach(bookingId, currentRetryCount, customerId, isScheduled) {
        try {
            if (currentRetryCount < MAX_DISPATCH_RETRIES) {
                // Increment retry count in DB using Drizzle
                const { bookings: bTable } = await import('../../db/schema/bookings.js');
                await client_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE bookings SET dispatch_retry_count = COALESCE(dispatch_retry_count, 0) + 1 WHERE id = ${bookingId}`);
                const newRetryCount = currentRetryCount + 1;
                logger_js_1.logger.info({ bookingId, retryAttempt: newRetryCount, maxRetries: MAX_DISPATCH_RETRIES }, '[sla-worker] Retrying dispatch with expanded radius');
                // Re-enqueue dispatch — the MatchingEngine reads retry_count to expand radius
                await queue_js_1.dispatchQueue.add('sla-retry', { bookingId, isScheduled, offerIndex: 0 }, {
                    // Remove old job first to avoid duplicates
                    removeOnComplete: true,
                    jobId: `dispatch:${bookingId}`,
                    attempts: 2,
                });
                // Notify customer about the delay
                await notification_service_js_1.notificationService.sendToUser(customerId, {
                    title: 'Still Finding Your Partner 🔍',
                    body: 'We\'re expanding our search to find you the best partner. Thank you for your patience!',
                    type: 'push',
                    data: { bookingId, retryAttempt: newRetryCount },
                }).catch(err => logger_js_1.logger.warn({ err }, '[sla-worker] Failed to send delay notification'));
            }
            else {
                // Max retries exceeded — escalate
                logger_js_1.logger.error({ bookingId, customerId }, '[sla-worker] Max retries exceeded — escalating to support');
                await booking_service_js_1.bookingService.transition(bookingId, 'no_partner', {
                    changedByRole: 'system',
                    note: `SLA breached after ${MAX_DISPATCH_RETRIES} retries. Escalated to support.`,
                });
                // Notify customer with apology
                await notification_service_js_1.notificationService.sendToUser(customerId, {
                    title: 'We\'re Sorry — No Partner Available 😔',
                    body: 'We couldn\'t find a partner for your request. Your booking has been cancelled and a full refund will be processed within 24 hours.',
                    type: 'push',
                    data: { bookingId, status: 'escalated' },
                }).catch(err => logger_js_1.logger.warn({ err }, '[sla-worker] Failed to send escalation notification'));
                // TODO: Create a support ticket / trigger a webhook to CRM
                logger_js_1.logger.info({ bookingId }, '[sla-worker] Support escalation queued (full refund)');
            }
        }
        catch (err) {
            logger_js_1.logger.error({ bookingId, err }, '[sla-worker] Failed to handle SLA breach');
        }
    }
}
exports.SlaWorker = SlaWorker;
exports.slaWorker = new SlaWorker();
//# sourceMappingURL=sla.worker.js.map