"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithCache = fetchWithCache;
/**
 * Standardized Negative Caching Wrapper
 *
 * Wraps DB fetch functions with a Redis cache layer.
 * If the DB returns null/undefined, it caches 'NULL' for a short TTL
 * to prevent cache penetration (repeated queries for non-existent items).
 */
const redis_js_1 = require("./redis.js");
const logger_js_1 = require("./logger.js");
/**
 * Fetch with negative caching.
 * @param key Redis cache key
 * @param fetcher Async function that queries the DB
 * @param options Cache TTL options
 */
async function fetchWithCache(key, fetcher, options) {
    const ttlSecs = options?.ttlSecs ?? 300;
    const negativeTtlSecs = options?.negativeTtlSecs ?? 60;
    // 1. Try Cache
    const cached = await redis_js_1.redis.get(key);
    if (cached) {
        if (cached === 'NULL') {
            logger_js_1.logger.debug({ key }, '[cache] Negative cache hit');
            return null;
        }
        try {
            return JSON.parse(cached);
        }
        catch (e) {
            logger_js_1.logger.warn({ key, err: e }, '[cache] Failed to parse cached JSON');
        }
    }
    // 2. Fallback to fetcher
    const result = await fetcher();
    // 3. Cache result (positive or negative)
    if (result === null || result === undefined) {
        await redis_js_1.redis.setex(key, negativeTtlSecs, 'NULL');
        logger_js_1.logger.debug({ key }, '[cache] Negative cache set');
        return null;
    }
    await redis_js_1.redis.setex(key, ttlSecs, JSON.stringify(result));
    return result;
}
//# sourceMappingURL=cacheWrapper.js.map