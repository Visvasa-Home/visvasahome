"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDispatchWorker = exports.BatchDispatchWorker = void 0;
const matching_engine_js_1 = require("./matching.engine.js");
const logger_js_1 = require("../../lib/logger.js");
// ─── Config ───────────────────────────────────────────────────────────────────
const BATCH_WINDOW_MS = parseInt(process.env.BATCH_WINDOW_MS ?? '10000', 10);
// Bounding radius used to fetch partner candidates for the whole batch.
// Set conservatively larger than per-booking radius so all feasible partners are included.
const BATCH_PARTNER_RADIUS_KM = parseFloat(process.env.BATCH_PARTNER_RADIUS_KM ?? '20');
// ─── BatchDispatchWorker ─────────────────────────────────────────────────────
class BatchDispatchWorker {
    timer = null;
    start() {
        logger_js_1.logger.info({ batchWindowMs: BATCH_WINDOW_MS }, '[batch-dispatch-worker] Starting');
        this.timer = setInterval(() => void this.tick(), BATCH_WINDOW_MS);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            logger_js_1.logger.info('[batch-dispatch-worker] Stopped');
        }
    }
    async tick() {
        // 1. Drain batch queue
        const bookingIds = await (0, matching_engine_js_1.drainBatchQueue)();
        if (bookingIds.length === 0)
            return;
        logger_js_1.logger.info({ count: bookingIds.length }, '[batch-dispatch-worker] Processing batch');
        try {
            // 2. Resolve booking candidates
            const bookingCandidates = await matching_engine_js_1.matchingEngine.resolveBookingCandidates(bookingIds);
            if (bookingCandidates.length === 0) {
                logger_js_1.logger.warn({ bookingIds }, '[batch-dispatch-worker] No resolvable booking candidates');
                return;
            }
            // 3. Compute centroid of all booking locations to limit partner query
            const center = matching_engine_js_1.matchingEngine.centroid(bookingCandidates);
            // 4. Resolve partner candidates around centroid
            const partnerCandidates = await matching_engine_js_1.matchingEngine.resolvePartnerCandidates(center.lat, center.lng, BATCH_PARTNER_RADIUS_KM);
            logger_js_1.logger.debug({ bookings: bookingCandidates.length, partners: partnerCandidates.length, center }, '[batch-dispatch-worker] Candidates resolved');
            // 5. Run Hungarian assignment
            const { matched, unmatched } = await matching_engine_js_1.matchingEngine.batchMatch(bookingCandidates, partnerCandidates);
            // 6. Enqueue results
            await matching_engine_js_1.matchingEngine.enqueueResults(matched, unmatched);
            logger_js_1.logger.info({ matched: matched.length, unmatched: unmatched.length }, '[batch-dispatch-worker] Batch complete');
        }
        catch (err) {
            logger_js_1.logger.error({ err, bookingIds }, '[batch-dispatch-worker] Batch failed — falling back to individual dispatch');
            // Fallback: individual dispatch for all bookings in this batch
            const { dispatchQueue } = await import('../../lib/queue.js');
            await Promise.all(bookingIds.map(bookingId => dispatchQueue.add('dispatch-fallback', {
                bookingId,
                isScheduled: false,
                offerIndex: 0,
            }, {
                jobId: `dispatch:${bookingId}`,
                attempts: 3,
            }).catch(e => logger_js_1.logger.error({ bookingId, e }, '[batch-dispatch-worker] Fallback enqueue failed'))));
        }
    }
}
exports.BatchDispatchWorker = BatchDispatchWorker;
exports.batchDispatchWorker = new BatchDispatchWorker();
//# sourceMappingURL=batch-dispatch.worker.js.map