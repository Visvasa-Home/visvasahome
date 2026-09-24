"use strict";
/**
 * SurgeService — Layer 3: Domain Services
 *
 * Monitors demand/supply in real-time and dynamically computes surge multipliers.
 *
 * Algorithm:
 *   1. Demand proxy  = number of bookings in 'searching' state in the zone (last 15 min)
 *   2. Supply proxy  = number of online, available partners in the zone
 *   3. demand_ratio  = demand / max(supply, 1)
 *   4. multiplier    = 1.0 + (demand_ratio - SURGE_THRESHOLD) * SURGE_SENSITIVITY
 *                      clamped to [1.0, MAX_SURGE_MULTIPLIER]
 *   5. Admin can override a zone multiplier for promotions or emergencies via Redis.
 *
 * Multipliers are cached in Redis with a 5-minute TTL so the formula isn't re-run
 * on every booking creation — only when the cache expires or admin forces a refresh.
 *
 * Configurable goals (mirrors batch matching objectives):
 *   - 'minimize_cost'  → lower surge to maximize demand (promotions)
 *   - 'balance_supply' → surge high to attract partners (standard)
 *   - 'flat'           → always return 1.0 (admin override for events)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.surgeService = exports.SurgeService = void 0;
const redis_js_1 = require("../../lib/redis.js");
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Config ───────────────────────────────────────────────────────────────────
const SURGE_THRESHOLD = parseFloat(process.env.SURGE_THRESHOLD ?? '1.5'); // demand/supply ratio above which surge kicks in
const SURGE_SENSITIVITY = parseFloat(process.env.SURGE_SENSITIVITY ?? '0.3'); // how aggressively multiplier grows
const MAX_SURGE_MULTIPLIER = parseFloat(process.env.MAX_SURGE_MULTIPLIER ?? '2.5'); // cap (2.5× max surge)
const BASE_SURGE_PCT = parseFloat(process.env.SURGE_PCT ?? '0.10'); // legacy flat surge % (fallback)
const SURGE_ENABLED = process.env.SURGE_ENABLED !== 'false';
const SURGE_CACHE_TTL_SECS = parseInt(process.env.SURGE_CACHE_TTL ?? '300', 10); // 5-minute cache
const DEMAND_WINDOW_MINS = parseInt(process.env.SURGE_DEMAND_WINDOW_MINS ?? '15', 10);
// ─── SurgeService ─────────────────────────────────────────────────────────────
class SurgeService {
    /**
     * Get the effective surge multiplier for a zone/city at the current moment.
     * Returns a value ≥ 1.0. Pass to PricingService to compute surgeAmount.
     *
     * @param zoneId   City or geographic zone identifier (e.g., "bangalore", "delhi-ncr")
     * @param serviceId   Optional — used if service-specific surge config exists
     * @param goal     Matching/pricing objective (default: 'balance_supply')
     */
    async getMultiplier(zoneId, serviceId, goal = 'balance_supply') {
        if (!SURGE_ENABLED)
            return 1.0;
        if (goal === 'flat')
            return 1.0;
        if (goal === 'minimize_cost')
            return 1.0; // Promotional mode — no surge
        // 1. Check admin override
        const adminOverride = await redis_js_1.redis.get(`surge:override:${zoneId}`);
        if (adminOverride !== null) {
            const val = parseFloat(adminOverride);
            logger_js_1.logger.debug({ zoneId, override: val }, '[surge] Using admin override');
            return isNaN(val) ? 1.0 : Math.max(1.0, Math.min(val, MAX_SURGE_MULTIPLIER));
        }
        // 2. Check Redis cache
        const cacheKey = `surge:multiplier:${zoneId}`;
        const cached = await redis_js_1.redis.get(cacheKey);
        if (cached !== null) {
            return parseFloat(cached);
        }
        // 3. Compute demand/supply ratio
        const multiplier = await this.computeMultiplier(zoneId);
        // 4. Cache it
        await redis_js_1.redis.set(cacheKey, multiplier.toFixed(3), 'EX', SURGE_CACHE_TTL_SECS);
        logger_js_1.logger.info({ zoneId, multiplier }, '[surge] Computed new multiplier');
        return multiplier;
    }
    /**
     * Compute the surge amount to add on top of base price.
     * surgeAmount = basePrice * (multiplier - 1.0)
     */
    async getSurgeAmount(basePrice, zoneId, serviceId) {
        const multiplier = await this.getMultiplier(zoneId, serviceId);
        return parseFloat(((multiplier - 1.0) * basePrice).toFixed(2));
    }
    /**
     * Admin: set a manual override for a zone multiplier.
     * Use multiplier=1.0 to set "no surge" for a promotional event.
     * Use multiplier=null to remove override (revert to computed).
     */
    async setAdminOverride(zoneId, multiplier, adminId) {
        const overrideKey = `surge:override:${zoneId}`;
        const cacheKey = `surge:multiplier:${zoneId}`;
        if (multiplier === null) {
            await redis_js_1.redis.del(overrideKey);
            logger_js_1.logger.info({ zoneId, adminId }, '[surge] Admin override removed');
        }
        else {
            const clamped = Math.max(1.0, Math.min(multiplier, MAX_SURGE_MULTIPLIER));
            await redis_js_1.redis.set(overrideKey, clamped.toFixed(3));
            logger_js_1.logger.info({ zoneId, clamped, adminId }, '[surge] Admin override set');
        }
        // Bust cache
        await redis_js_1.redis.del(cacheKey);
    }
    /**
     * Get the current status of a zone (for admin dashboard).
     */
    async getZoneStatus(zoneId) {
        const override = await redis_js_1.redis.get(`surge:override:${zoneId}`);
        const cached = await redis_js_1.redis.get(`surge:multiplier:${zoneId}`);
        const cachedTtl = await redis_js_1.redis.ttl(`surge:multiplier:${zoneId}`);
        const { demand, supply, ratio } = await this.getDemandSupply(zoneId);
        const multiplier = override !== null ? parseFloat(override) : (cached !== null ? parseFloat(cached) : await this.computeMultiplier(zoneId));
        return {
            zoneId,
            multiplier: parseFloat(multiplier.toFixed(3)),
            demandCount: demand,
            supplyCount: supply,
            demandRatio: parseFloat(ratio.toFixed(2)),
            isOverridden: override !== null,
            overrideValue: override !== null ? parseFloat(override) : null,
            cachedUntil: cachedTtl > 0 ? Date.now() + cachedTtl * 1000 : null,
        };
    }
    /**
     * Invalidate the surge cache for a zone (call on supply/demand spikes).
     */
    async invalidateCache(zoneId) {
        await redis_js_1.redis.del(`surge:multiplier:${zoneId}`);
    }
    // ─── Private ──────────────────────────────────────────────────────────────────
    async computeMultiplier(zoneId) {
        const { demand, supply, ratio } = await this.getDemandSupply(zoneId);
        if (ratio <= SURGE_THRESHOLD || supply === 0) {
            return 1.0; // No surge needed
        }
        const raw = 1.0 + (ratio - SURGE_THRESHOLD) * SURGE_SENSITIVITY;
        return parseFloat(Math.min(raw, MAX_SURGE_MULTIPLIER).toFixed(3));
    }
    async getDemandSupply(zoneId) {
        const windowStart = new Date(Date.now() - DEMAND_WINDOW_MINS * 60 * 1000);
        // Demand = bookings in 'searching' state within this zone's timeframe
        // Note: zoneId is matched against bookings.zoneId if populated; else fallback to count all
        const [demandRow] = await client_js_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)`.mapWith(Number) })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'searching'), (0, drizzle_orm_1.gte)(bookings_js_1.bookings.createdAt, windowStart)));
        // Supply = online & available partners (via Redis heartbeat set)
        const supplyCount = await redis_js_1.redis.scard(`partners:online`);
        const demand = demandRow?.count ?? 0;
        const supply = Math.max(supplyCount ?? 0, 1); // avoid div-by-zero
        const ratio = demand / supply;
        return { demand, supply, ratio };
    }
}
exports.SurgeService = SurgeService;
exports.surgeService = new SurgeService();
//# sourceMappingURL=surge.service.js.map