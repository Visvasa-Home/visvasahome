"use strict";
/**
 * SchedulerWorker — Layer 3: Domain Services
 *
 * Polls the database every minute for scheduled bookings whose
 * `scheduled_time` falls within the next 30 minutes (configurable via
 * DISPATCH_LEAD_MINUTES env var). When found, it transitions the booking to
 * 'searching' and enqueues it into the dispatch pipeline — exactly the same
 * matching logic used for instant bookings, but triggered with a time delay.
 *
 * Design notes:
 *   - Uses a Postgres advisory lock (pg_try_advisory_xact_lock) per booking to
 *     guarantee exactly-once dispatch across multiple instances (horizontal scale).
 *   - Marks dispatched bookings with schedulerDispatchedAt to prevent re-dispatch.
 *   - Works via setInterval rather than BullMQ cron to avoid double-fire issues
 *     on multi-instance deployments (the DB lock is the true guard).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerWorker = exports.SchedulerWorker = void 0;
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Config ───────────────────────────────────────────────────────────────────
/** How many minutes ahead to look for scheduled bookings. */
const DISPATCH_LEAD_MINUTES = parseInt(process.env.DISPATCH_LEAD_MINUTES ?? '30', 10);
/** How often this worker polls (ms). */
const POLL_INTERVAL_MS = parseInt(process.env.SCHEDULER_POLL_MS ?? '60000', 10); // 1 min
// ─── SchedulerWorker ─────────────────────────────────────────────────────────
class SchedulerWorker {
    timer = null;
    start() {
        logger_js_1.logger.info({ leadMinutes: DISPATCH_LEAD_MINUTES, pollMs: POLL_INTERVAL_MS }, '[scheduler-worker] Starting');
        // Run once immediately, then on interval
        void this.tick();
        this.timer = setInterval(() => void this.tick(), POLL_INTERVAL_MS);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            logger_js_1.logger.info('[scheduler-worker] Stopped');
        }
    }
    /** Main tick: find eligible scheduled bookings and kick them into dispatch. */
    async tick() {
        const now = new Date();
        const horizon = new Date(now.getTime() + DISPATCH_LEAD_MINUTES * 60 * 1000);
        try {
            // Find all scheduled bookings in the 'pending' state whose scheduled_time
            // is within (now, now + DISPATCH_LEAD_MINUTES] and haven't been dispatched yet.
            const candidates = await client_js_1.db
                .select({ id: bookings_js_1.bookings.id, scheduledTime: bookings_js_1.bookings.scheduledTime })
                .from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.bookingType, 'scheduled'), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'pending'), (0, drizzle_orm_1.gte)(bookings_js_1.bookings.scheduledTime, now), (0, drizzle_orm_1.lte)(bookings_js_1.bookings.scheduledTime, horizon), 
            // Guard: only pick up bookings not yet dispatched
            (0, drizzle_orm_1.isNull)(bookings_js_1.bookings.searchingStartedAt)))
                .limit(50); // Process at most 50 per tick to avoid overwhelming the queue
            if (candidates.length === 0)
                return;
            logger_js_1.logger.info({ count: candidates.length, horizon }, '[scheduler-worker] Found scheduled bookings to dispatch');
            // Process each candidate with a DB-level advisory lock (per booking UUID)
            // to ensure only one instance dispatches each booking in multi-pod deployments.
            for (const booking of candidates) {
                try {
                    await this.dispatchScheduled(booking.id);
                }
                catch (err) {
                    // Log per-booking error — don't abort the whole tick
                    logger_js_1.logger.error({ bookingId: booking.id, err }, '[scheduler-worker] Failed to dispatch booking');
                }
            }
        }
        catch (err) {
            logger_js_1.logger.error({ err }, '[scheduler-worker] Tick error');
        }
    }
    /**
     * Dispatch a single scheduled booking.
     * Wraps in a transaction to use PostgreSQL advisory lock for idempotency.
     */
    async dispatchScheduled(bookingId) {
        await client_js_1.db.transaction(async (tx) => {
            // pg_try_advisory_xact_lock: non-blocking. Returns false if already locked.
            // Lock key: hash of booking ID (use bigint from first 16 hex chars)
            const lockKey = BigInt('0x' + bookingId.replace(/-/g, '').slice(0, 16));
            const lockResult = await tx.execute((0, drizzle_orm_1.sql) `SELECT pg_try_advisory_xact_lock(${lockKey}) AS acquired`);
            const rows = lockResult.rows;
            const acquired = rows[0]?.acquired;
            if (!acquired) {
                logger_js_1.logger.debug({ bookingId }, '[scheduler-worker] Another instance acquired lock — skipping');
                return;
            }
            // Re-check status inside lock to prevent TOCTOU race
            const [current] = await tx
                .select({ status: bookings_js_1.bookings.status, searchingStartedAt: bookings_js_1.bookings.searchingStartedAt })
                .from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId))
                .limit(1);
            if (!current || current.status !== 'pending' || current.searchingStartedAt !== null) {
                return; // Already dispatched by another process
            }
            // Stamp the booking so concurrent instances skip it next tick
            await tx.update(bookings_js_1.bookings)
                .set({ searchingStartedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId));
        });
        // Outside the transaction: enqueue dispatch (idempotent via jobId)
        await queue_js_1.dispatchQueue.add('scheduled-dispatch', { bookingId, isScheduled: true, offerIndex: 0 }, {
            jobId: `dispatch:${bookingId}`,
            attempts: 3,
        });
        logger_js_1.logger.info({ bookingId }, '[scheduler-worker] Scheduled booking enqueued for dispatch');
    }
}
exports.SchedulerWorker = SchedulerWorker;
exports.schedulerWorker = new SchedulerWorker();
//# sourceMappingURL=scheduler.worker.js.map