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
export type SurgeGoal = 'minimize_cost' | 'balance_supply' | 'flat';
export declare class SurgeService {
    /**
     * Get the effective surge multiplier for a zone/city at the current moment.
     * Returns a value ≥ 1.0. Pass to PricingService to compute surgeAmount.
     *
     * @param zoneId   City or geographic zone identifier (e.g., "bangalore", "delhi-ncr")
     * @param serviceId   Optional — used if service-specific surge config exists
     * @param goal     Matching/pricing objective (default: 'balance_supply')
     */
    getMultiplier(zoneId: string, serviceId?: string, goal?: SurgeGoal): Promise<number>;
    /**
     * Compute the surge amount to add on top of base price.
     * surgeAmount = basePrice * (multiplier - 1.0)
     */
    getSurgeAmount(basePrice: number, zoneId: string, serviceId?: string): Promise<number>;
    /**
     * Admin: set a manual override for a zone multiplier.
     * Use multiplier=1.0 to set "no surge" for a promotional event.
     * Use multiplier=null to remove override (revert to computed).
     */
    setAdminOverride(zoneId: string, multiplier: number | null, adminId: string): Promise<void>;
    /**
     * Get the current status of a zone (for admin dashboard).
     */
    getZoneStatus(zoneId: string): Promise<{
        zoneId: string;
        multiplier: number;
        demandCount: number;
        supplyCount: number;
        demandRatio: number;
        isOverridden: boolean;
        overrideValue: number | null;
        cachedUntil: number | null;
    }>;
    /**
     * Invalidate the surge cache for a zone (call on supply/demand spikes).
     */
    invalidateCache(zoneId: string): Promise<void>;
    private computeMultiplier;
    private getDemandSupply;
}
export declare const surgeService: SurgeService;
//# sourceMappingURL=surge.service.d.ts.map