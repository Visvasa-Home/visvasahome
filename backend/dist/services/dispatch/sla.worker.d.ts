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
export declare class SlaWorker {
    private timer;
    start(): void;
    stop(): void;
    private tick;
    /**
     * Find instant bookings stuck in 'searching' past SLA_INSTANT_MINUTES.
     */
    private checkInstantSla;
    /**
     * Find scheduled bookings stuck in 'searching' with not enough time before scheduled_time.
     */
    private checkScheduledSla;
    /**
     * Handle a single SLA breach:
     *  - If under max retries: increment retry count and re-enqueue dispatch (wider radius)
     *  - If max retries exceeded: escalate (no_partner + customer notification + support ticket)
     */
    private handleSlaBreach;
}
export declare const slaWorker: SlaWorker;
//# sourceMappingURL=sla.worker.d.ts.map