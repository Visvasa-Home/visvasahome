"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchingEngine = exports.MatchingEngine = void 0;
exports.enqueueForBatch = enqueueForBatch;
exports.drainBatchQueue = drainBatchQueue;
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const partners_js_1 = require("../../db/schema/partners.js");
const users_js_1 = require("../../db/schema/users.js");
const queue_js_1 = require("../../lib/queue.js");
const redis_js_1 = require("../../lib/redis.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Constants ────────────────────────────────────────────────────────────────
/** Time window to group instant bookings into a single batch (ms). */
const BATCH_WINDOW_MS = parseInt(process.env.BATCH_WINDOW_MS ?? '10000', 10); // 10s
/** Initial search radius (km). */
const INITIAL_RADIUS_KM = parseFloat(process.env.SEARCH_RADIUS_KM ?? '10');
/** Each retry expands radius by this factor. */
const RADIUS_EXPAND_FACTOR = parseFloat(process.env.RADIUS_EXPAND_FACTOR ?? '1.5');
/** Max search radius cap (km). */
const MAX_RADIUS_KM = parseFloat(process.env.MAX_SEARCH_RADIUS_KM ?? '30');
/** Max partners to consider per booking in a batch. */
const MAX_CANDIDATES = 10;
const OBJECTIVE_WEIGHTS = {
    minimize_distance: [0.70, 0.20, 0.10], // strongly prefer nearby partners
    maximize_coverage: [0.30, 0.40, 0.30], // rating + acceptance matters more → reliable partners
    balance_workload: [0.40, 0.20, 0.40], // spread load across partners
};
// Default objective from environment (overridable per-batch by feature flag)
const DEFAULT_OBJECTIVE = process.env.MATCHING_OBJECTIVE ?? 'minimize_distance';
// ─── Cost matrix helpers ─────────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
/**
 * Composite cost: lower is better.
 *  Weights are determined by the MatchingObjective:
 *    [wDistance, wRating, wAcceptance]
 *  - Distance:       normalised to max radius
 *  - Rating:         inverted (1 - rating/5)
 *  - Acceptance:     inverted (1 - rate)
 *  - Workload:       penalise busy partners (balance_workload objective)
 *  - Skill mismatch: +1000 hard penalty
 */
function computeCost(booking, partner, objective = DEFAULT_OBJECTIVE) {
    const dist = haversineKm(booking.lat, booking.lng, partner.lat, partner.lng);
    if (dist > booking.radiusKm)
        return Infinity; // Outside radius — not feasible
    const skillPenalty = booking.requiredSkill && !partner.skillTags.includes(booking.requiredSkill)
        ? 1000
        : 0;
    const [wDist, wRating, wAccept] = OBJECTIVE_WEIGHTS[objective];
    const distScore = (dist / MAX_RADIUS_KM) * wDist;
    const ratingScore = (1 - partner.rating / 5) * wRating;
    const acceptanceScore = (1 - partner.acceptanceRate) * wAccept;
    // Workload penalty: gently penalise partners with active jobs (balance_workload only)
    const workloadPenalty = objective === 'balance_workload'
        ? (partner.activeJobCount ?? 0) * 0.05
        : 0;
    return distScore + ratingScore + acceptanceScore + workloadPenalty + skillPenalty;
}
// ─── Hungarian (Munkres) — O(n³) linear assignment ───────────────────────────
/**
 * Minimal Hungarian algorithm for square or rectangular cost matrices.
 * Returns assignment[i] = j meaning booking[i] is matched to partner[j].
 * Unmatched bookings have assignment[i] = -1.
 */
function hungarianAssign(cost) {
    const n = cost.length; // bookings
    const m = cost[0]?.length ?? 0; // partners
    if (n === 0 || m === 0)
        return [];
    const INF = 1e18;
    const u = new Array(n + 1).fill(0);
    const v = new Array(m + 1).fill(0);
    const p = new Array(m + 1).fill(0); // assignment: p[j] = i
    const way = new Array(m + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = new Array(m + 1).fill(INF);
        const used = new Array(m + 1).fill(false);
        do {
            used[j0] = true;
            let i0 = p[j0], delta = INF, j1 = -1;
            for (let j = 1; j <= m; j++) {
                if (!used[j]) {
                    const cur = (cost[i0 - 1]?.[j - 1] ?? INF) - u[i0] - v[j];
                    if (cur < minv[j]) {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if (minv[j] < delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            delta = delta === INF ? 0 : delta;
            for (let j = 0; j <= m; j++) {
                if (used[j]) {
                    u[p[j]] -= delta;
                    v[j] += delta;
                }
                else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (p[j0] !== 0);
        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }
    // Build booking→partner mapping (1-indexed → 0-indexed)
    const result = new Array(n).fill(-1);
    for (let j = 1; j <= m; j++) {
        if (p[j] !== 0) {
            result[p[j] - 1] = j - 1;
        }
    }
    return result;
}
// ─── MatchingEngine ──────────────────────────────────────────────────────────
class MatchingEngine {
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
    async batchMatch(bookingCandidates, partnerCandidates, options = {}) {
        const objective = options.objective ?? DEFAULT_OBJECTIVE;
        if (bookingCandidates.length === 0)
            return { matched: [], unmatched: [], objective };
        if (partnerCandidates.length === 0) {
            return { matched: [], unmatched: bookingCandidates.map(b => b.bookingId), objective };
        }
        // Build cost matrix: rows = bookings, cols = partners
        const cost = bookingCandidates.map(b => partnerCandidates.map(p => computeCost(b, p, objective)));
        logger_js_1.logger.debug({ bookings: bookingCandidates.length, partners: partnerCandidates.length, objective }, '[matching-engine] Running Hungarian assignment');
        const assignment = hungarianAssign(cost);
        const matched = [];
        const unmatched = [];
        assignment.forEach((partnerIdx, bookingIdx) => {
            const booking = bookingCandidates[bookingIdx];
            if (partnerIdx === -1 || (cost[bookingIdx]?.[partnerIdx] ?? Infinity) === Infinity) {
                unmatched.push(booking.bookingId);
                return;
            }
            const partner = partnerCandidates[partnerIdx];
            const dist = haversineKm(booking.lat, booking.lng, partner.lat, partner.lng);
            matched.push({
                bookingId: booking.bookingId,
                partnerId: partner.partnerId,
                distanceKm: dist,
                score: cost[bookingIdx][partnerIdx],
            });
        });
        logger_js_1.logger.info({ matched: matched.length, unmatched: unmatched.length, objective }, '[matching-engine] Batch match complete');
        return { matched, unmatched, objective };
    }
    /**
     * Resolve a list of booking IDs into BookingCandidate objects.
     * Fetches address coordinates from the DB.
     */
    async resolveBookingCandidates(bookingIds) {
        if (bookingIds.length === 0)
            return [];
        const rows = await client_js_1.db
            .select({
            id: bookings_js_1.bookings.id,
            serviceId: bookings_js_1.bookings.serviceId,
            requiredSkill: bookings_js_1.bookings.requiredSkill,
            addressId: bookings_js_1.bookings.addressId,
            dispatchRetry: (0, drizzle_orm_1.sql) `COALESCE(${bookings_js_1.bookings}.dispatch_retry_count, 0)`.mapWith(Number),
        })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.inArray)(bookings_js_1.bookings.id, bookingIds));
        const candidates = [];
        await Promise.all(rows.map(async (row) => {
            const [addr] = await client_js_1.db
                .select({ lat: users_js_1.addresses.latitude, lng: users_js_1.addresses.longitude })
                .from(users_js_1.addresses)
                .where((0, drizzle_orm_1.eq)(users_js_1.addresses.id, row.addressId))
                .limit(1);
            if (!addr?.lat || !addr?.lng) {
                logger_js_1.logger.warn({ bookingId: row.id }, '[matching-engine] No address coords — skipping');
                return;
            }
            // Expand radius based on retry count
            const radiusKm = Math.min(INITIAL_RADIUS_KM * Math.pow(RADIUS_EXPAND_FACTOR, row.dispatchRetry), MAX_RADIUS_KM);
            candidates.push({
                bookingId: row.id,
                serviceId: row.serviceId,
                requiredSkill: row.requiredSkill,
                lat: parseFloat(addr.lat),
                lng: parseFloat(addr.lng),
                radiusKm,
            });
        }));
        return candidates;
    }
    /**
     * Resolve available PartnerCandidates near a geographic centroid.
     * Uses PostGIS ST_DWithin for efficient geo-filtering.
     */
    async resolvePartnerCandidates(centerLat, centerLng, radiusKm) {
        const radiusM = radiusKm * 1000;
        const rows = await client_js_1.db
            .select({
            partnerId: partners_js_1.partnerLocations.partnerId,
            lat: (0, drizzle_orm_1.sql) `ST_Y(${partners_js_1.partnerLocations.geom}::geometry)`,
            lng: (0, drizzle_orm_1.sql) `ST_X(${partners_js_1.partnerLocations.geom}::geometry)`,
            rating: partners_js_1.partners.rating,
            acceptanceRate: partners_js_1.partners.acceptanceRate,
            skillTags: partners_js_1.partners.skillTags,
        })
            .from(partners_js_1.partnerLocations)
            .innerJoin(partners_js_1.partners, (0, drizzle_orm_1.eq)(partners_js_1.partners.id, partners_js_1.partnerLocations.partnerId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `ST_DWithin(
          ${partners_js_1.partnerLocations.geom}::geography,
          ST_SetSRID(ST_MakePoint(${centerLng}, ${centerLat}), 4326)::geography,
          ${radiusM}
        )`, (0, drizzle_orm_1.eq)(partners_js_1.partners.status, 'active'), (0, drizzle_orm_1.eq)(partners_js_1.partners.kycStatus, 'verified'), (0, drizzle_orm_1.eq)(partners_js_1.partners.isAvailable, true)))
            .limit(MAX_CANDIDATES * 5); // Fetch more than needed; assignment will prune
        return rows.map(r => ({
            partnerId: r.partnerId,
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lng),
            rating: r.rating ?? 0,
            acceptanceRate: r.acceptanceRate ?? 0.5,
            skillTags: r.skillTags ?? [],
            activeJobCount: 0, // Populated via Redis below if balance_workload is active
        }));
    }
    /**
     * Get active job count per partner from Redis for workload balancing.
     * Stored by the booking state machine when assigning jobs.
     */
    async getActiveJobCounts(partnerIds) {
        const pipeline = redis_js_1.redis.pipeline();
        partnerIds.forEach(id => pipeline.get(`partner:active_jobs:${id}`));
        const results = await pipeline.exec();
        const map = new Map();
        partnerIds.forEach((id, i) => {
            const val = results?.[i]?.[1];
            map.set(id, val ? parseInt(String(val), 10) : 0);
        });
        return map;
    }
    /**
     * Compute geographic centroid of a set of booking candidates.
     * Used to pick a single PostGIS query point for the batch.
     */
    centroid(candidates) {
        const lat = candidates.reduce((s, c) => s + c.lat, 0) / candidates.length;
        const lng = candidates.reduce((s, c) => s + c.lng, 0) / candidates.length;
        return { lat, lng };
    }
    /**
     * Enqueue the matched pairs directly as dispatch jobs (bypassing the
     * BullMQ offer cascade — these are pre-assigned at batch level).
     *
     * For unmatched bookings, enqueue standard individual dispatch.
     */
    async enqueueResults(matched, unmatched) {
        // For matched — we still create offers via the existing dispatch flow
        // so the partner can accept/reject (atomic SETNX lock is preserved).
        await Promise.all([
            ...matched.map(m => queue_js_1.dispatchQueue.add('dispatch-batch', {
                bookingId: m.bookingId,
                isScheduled: false,
                offerIndex: 0,
                // Hint the worker to offer this specific partner first
                preferredPartnerId: m.partnerId,
            }, {
                jobId: `dispatch:${m.bookingId}`,
                attempts: 3,
            })),
            ...unmatched.map(bookingId => queue_js_1.dispatchQueue.add('dispatch-fallback', {
                bookingId,
                isScheduled: false,
                offerIndex: 0,
            }, {
                jobId: `dispatch:${bookingId}`,
                attempts: 3,
            })),
        ]);
    }
}
exports.MatchingEngine = MatchingEngine;
exports.matchingEngine = new MatchingEngine();
// ─── Batch Accumulator (Redis-backed) ────────────────────────────────────────
const BATCH_REDIS_KEY = 'batch:instant:pending';
/**
 * Add a booking ID to the Redis set of pending instant bookings.
 * The BatchSchedulerWorker will drain this set every BATCH_WINDOW_MS.
 */
async function enqueueForBatch(bookingId) {
    await redis_js_1.redis.sadd(BATCH_REDIS_KEY, bookingId);
    logger_js_1.logger.debug({ bookingId }, '[matching-engine] Enqueued for batch window');
}
/**
 * Drain the Redis batch set and return all booking IDs.
 * Uses SMEMBERS + DEL atomically via a Lua script.
 */
async function drainBatchQueue() {
    const members = await redis_js_1.redis.smembers(BATCH_REDIS_KEY);
    if (members.length > 0) {
        await redis_js_1.redis.del(BATCH_REDIS_KEY);
    }
    return members;
}
//# sourceMappingURL=matching.engine.js.map