/**
 * BatchDispatchWorker — Layer 3: Domain Services
 *
 * Every BATCH_WINDOW_MS (default 10 seconds) this worker:
 *   1. Drains the Redis pending-batch set (bookingIds accumulated since last tick)
 *   2. Resolves booking candidates (geo-coordinates, skill requirements)
 *   3. Resolves available partner candidates within a bounding radius
 *   4. Runs the MatchingEngine (Hungarian linear assignment) for global optimality
 *   5. Enqueues dispatch jobs for matched pairs; unmatched fall through to
 *      individual greedy dispatch with sequential offer cascade
 *
 * This implements the "hybrid real-time/batched" approach described in the
 * VisvasaHome engineering blog — avoiding the greedy nearest-partner trap
 * that leads to excess travel and idle schedule gaps.
 */
export declare class BatchDispatchWorker {
    private timer;
    start(): void;
    stop(): void;
    private tick;
}
export declare const batchDispatchWorker: BatchDispatchWorker;
//# sourceMappingURL=batch-dispatch.worker.d.ts.map