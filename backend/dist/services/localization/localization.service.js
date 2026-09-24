"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizationService = exports.LocalizationService = void 0;
const client_js_1 = require("../../db/client.js");
const localization_js_1 = require("../../db/schema/localization.js");
const drizzle_orm_1 = require("drizzle-orm");
const circuitBreaker_js_1 = require("../../lib/circuitBreaker.js");
const redis_js_1 = require("../../lib/redis.js");
/**
 * Localization Service (Internal "Groot" clone)
 * Fetches localization strings, backed by Redis cache and protected by a Circuit Breaker.
 * Simulates a highly-resilient remote service call with a strict 100ms timeout.
 */
class LocalizationService {
    breaker;
    constructor() {
        // 5 failures to trip, 10s reset window, 100ms strict timeout
        this.breaker = new circuitBreaker_js_1.CircuitBreaker('LocalizationService (Groot)', 5, 10000, 100);
    }
    /**
     * Translates a key to the target locale.
     * Protects the request with a timeout and fallback.
     */
    async getTranslation(locale, key, fallbackText) {
        return this.breaker.fire(async () => this.fetchTranslation(locale, key, fallbackText), async () => fallbackText // Graceful fallback if timeout/error or tripped
        );
    }
    async fetchTranslation(locale, key, fallbackText) {
        const cacheKey = `groot:translation:${locale}:${key}`;
        // 1. Try Redis Cache
        const cached = await redis_js_1.redis.get(cacheKey);
        if (cached) {
            if (cached === 'NULL')
                return fallbackText; // Negative cache hit
            return cached;
        }
        // 2. Fallback to DB
        const [record] = await client_js_1.db.select({ value: localization_js_1.translations.value })
            .from(localization_js_1.translations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(localization_js_1.translations.locale, locale), (0, drizzle_orm_1.eq)(localization_js_1.translations.key, key)))
            .limit(1);
        if (record) {
            // Set to Redis (1 hr TTL)
            await redis_js_1.redis.set(cacheKey, record.value, 'EX', 3600);
            return record.value;
        }
        // Apply negative caching for missing translations to prevent cache penetration
        await redis_js_1.redis.set(cacheKey, 'NULL', 'EX', 600); // 10 minutes negative cache TTL
        return fallbackText;
    }
}
exports.LocalizationService = LocalizationService;
exports.localizationService = new LocalizationService();
//# sourceMappingURL=localization.service.js.map