/**
 * MatchingEngine — Layer 3: Domain Services
 *
 * Implements VisvasaHome's hybrid real-time / batched matching approach.
 *
 * Algorithm phases:
 *   1. BATCH WINDOW: Group instant booking requests arriving within a short
 *      time window (e.g. 10 seconds) to avoid suboptimal greedy assignment.
 *   2. CANDIDATE RETRIEVAL: For each booking, query PostGIS for nearby
 *      available partners within the current search radius.
 *   3. COST MATRIX: Build an N×M matrix (bookings × partners) where cost(i,j)
 *      is a composite score: distance + (1-rating) + (1-acceptanceRate) + skillMismatch.
 *   4. LINEAR ASSIGNMENT (Hungarian-style): Solve the minimization problem so
 *      each booking gets at most one partner and each partner serves at most
 *      one booking in the batch — maximizing global coverage efficiency.
 *   5. FALLBACK: Unmatched bookings (no feasible partner) fall back to the
 *      sequential offer cascade in DispatchService.
 *
 * Reference: VisvasaHome Engineering Blog — "Hybrid Batched Dispatch" section.
 */
/**
 * Configurable objectives for the linear assignment solver.
 *
 *  minimize_distance  → Weight heavily toward closest partner (travel cost minimization)
 *  maximize_coverage  → Weight toward accepting the most bookings even at longer distances
 *  balance_workload   → Distribute evenly, penalizing already-busy partners
 *
 * Weights: [wDistance, wRating, wAcceptance]
 */
export type MatchingObjective = 'minimize_distance' | 'maximize_coverage' | 'balance_workload';
export interface BookingCandidate {
    bookingId: string;
    serviceId: string;
    requiredSkill: string | null;
    lat: number;
    lng: number;
    radiusKm: number;
}
export interface PartnerCandidate {
    partnerId: string;
    lat: number;
    lng: number;
    rating: number;
    acceptanceRate: number;
    skillTags: string[];
    activeJobCount: number;
}
export interface BatchMatchOptions {
    objective?: MatchingObjective;
}
export interface MatchResult {
    bookingId: string;
    partnerId: string;
    distanceKm: number;
    score: number;
}
export declare class MatchingEngine {
    /**
     * Run a batch match for a set of booking candidates against available partners.
     *
     * Steps:
     *   1. Gather geo-locations of all candidates from Redis/PostGIS
     *   2. Build cost matrix
     *   3. Run Hungarian assignment
     *   4. Return matches; caller dispatches offers for matched pairs.
     *      Unmatched bookings are returned separately for individual retry.
     */
    batchMatch(bookingCandidates: BookingCandidate[], partnerCandidates: PartnerCandidate[], options?: BatchMatchOptions): Promise<{
        matched: MatchResult[];
        unmatched: string[];
        objective: MatchingObjective;
    }>;
    /**
     * Resolve a list of booking IDs into BookingCandidate objects.
     * Fetches address coordinates from the DB.
     */
    resolveBookingCandidates(bookingIds: string[]): Promise<BookingCandidate[]>;
    /**
     * Resolve available PartnerCandidates near a geographic centroid.
     * Uses PostGIS ST_DWithin for efficient geo-filtering.
     */
    resolvePartnerCandidates(centerLat: number, centerLng: number, radiusKm: number): Promise<PartnerCandidate[]>;
    /**
     * Get active job count per partner from Redis for workload balancing.
     * Stored by the booking state machine when assigning jobs.
     */
    getActiveJobCounts(partnerIds: string[]): Promise<Map<string, number>>;
    /**
     * Compute geographic centroid of a set of booking candidates.
     * Used to pick a single PostGIS query point for the batch.
     */
    centroid(candidates: BookingCandidate[]): {
        lat: number;
        lng: number;
    };
    /**
     * Enqueue the matched pairs directly as dispatch jobs (bypassing the
     * BullMQ offer cascade — these are pre-assigned at batch level).
     *
     * For unmatched bookings, enqueue standard individual dispatch.
     */
    enqueueResults(matched: MatchResult[], unmatched: string[]): Promise<void>;
}
export declare const matchingEngine: MatchingEngine;
/**
 * Add a booking ID to the Redis set of pending instant bookings.
 * The BatchSchedulerWorker will drain this set every BATCH_WINDOW_MS.
 */
export declare function enqueueForBatch(bookingId: string): Promise<void>;
/**
 * Drain the Redis batch set and return all booking IDs.
 * Uses SMEMBERS + DEL atomically via a Lua script.
 */
export declare function drainBatchQueue(): Promise<string[]>;
//# sourceMappingURL=matching.engine.d.ts.map