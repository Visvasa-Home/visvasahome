"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogService = exports.CatalogService = void 0;
/**
 * CatalogService — Layer 3: Domain Services
 *
 * Manages categories, services, variants, add-ons, and basic peak pricing rules.
 */
const client_js_1 = require("../../db/client.js");
const services_js_1 = require("../../db/schema/services.js");
const drizzle_orm_1 = require("drizzle-orm");
const redis_js_1 = require("../../lib/redis.js");
const bloom_filters_1 = require("bloom-filters");
const logger_js_1 = require("../../lib/logger.js");
class CatalogService {
    serviceBloomFilter = null;
    /**
     * Initializes the Bloom Filter with all existing valid service IDs.
     * Call this on server startup.
     */
    async initBloomFilter() {
        const allServices = await client_js_1.catalogDb.select({ id: services_js_1.services.id }).from(services_js_1.services);
        // Create a Bloom filter optimized for the expected number of items (e.g. 10k items, 1% false positive rate)
        this.serviceBloomFilter = bloom_filters_1.BloomFilter.create(Math.max(allServices.length * 2, 1000), 0.01);
        for (const s of allServices) {
            this.serviceBloomFilter.add(s.id);
        }
        logger_js_1.logger.info(`[catalog] Bloom filter initialized with ${allServices.length} service IDs`);
    }
    async getCategories() {
        const cacheKey = 'catalog:categories';
        const cached = await redis_js_1.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const list = await client_js_1.catalogDb.select().from(services_js_1.categories).where((0, drizzle_orm_1.eq)(services_js_1.categories.isActive, true));
        await redis_js_1.redis.set(cacheKey, JSON.stringify(list), 'EX', 3600); // cache 1 hr
        return list;
    }
    async getServicesByCategory(categoryId) {
        const cacheKey = `catalog:services:${categoryId}`;
        const cached = await redis_js_1.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const list = await client_js_1.catalogDb.select().from(services_js_1.services)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(services_js_1.services.categoryId, categoryId), (0, drizzle_orm_1.eq)(services_js_1.services.isActive, true)));
        await redis_js_1.redis.set(cacheKey, JSON.stringify(list), 'EX', 3600);
        return list;
    }
    async getServiceDetails(serviceId) {
        // 1. Bloom Filter Check (Impossible ID Guard)
        if (this.serviceBloomFilter && !this.serviceBloomFilter.has(serviceId)) {
            // Impossible ID -> return immediately without hitting Redis or DB
            return undefined;
        }
        const cacheKey = `catalog:service:${serviceId}`;
        const cached = await redis_js_1.redis.get(cacheKey);
        if (cached) {
            if (cached === 'NULL')
                return undefined; // Negative cache hit
            return JSON.parse(cached);
        }
        const [service] = await client_js_1.catalogDb.select().from(services_js_1.services).where((0, drizzle_orm_1.eq)(services_js_1.services.id, serviceId)).limit(1);
        if (service) {
            await redis_js_1.redis.set(cacheKey, JSON.stringify(service), 'EX', 3600);
            // Optional: Add to bloom filter if dynamically added
            this.serviceBloomFilter?.add(serviceId);
        }
        else {
            // Negative caching (5 min TTL) to prevent DB cache penetration for invalid IDs
            await redis_js_1.redis.set(cacheKey, 'NULL', 'EX', 300);
        }
        return service;
    }
}
exports.CatalogService = CatalogService;
exports.catalogService = new CatalogService();
//# sourceMappingURL=catalog.service.js.map