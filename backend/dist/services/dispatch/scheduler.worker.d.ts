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
export declare class SchedulerWorker {
    private timer;
    start(): void;
    stop(): void;
    /** Main tick: find eligible scheduled bookings and kick them into dispatch. */
    private tick;
    /**
     * Dispatch a single scheduled booking.
     * Wraps in a transaction to use PostgreSQL advisory lock for idempotency.
     */
    private dispatchScheduled;
}
export declare const schedulerWorker: SchedulerWorker;
//# sourceMappingURL=scheduler.worker.d.ts.map