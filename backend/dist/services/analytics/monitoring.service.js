"use strict";
/**
 * MonitoringService — Layer 3: Domain Services (Admin)
 *
 * Provides real-time operational metrics for the admin monitoring dashboard:
 *   - Live bookings heatmap (status + locations)
 *   - Active partner map (online partners + their GPS)
 *   - Completed jobs per city (today/rolling)
 *   - SLA breach alerts
 *   - Surge multiplier per zone
 *
 * Delivered via Server-Sent Events (SSE) to the admin dashboard WebSocket/SSE stream.
 * Also supports one-shot HTTP snapshots for initial page load.
 *
 * Data is assembled from:
 *   - PostgreSQL (booking counts, statuses)
 *   - Redis (online partners, GPS coordinates, surge multipliers)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringService = exports.MonitoringService = void 0;
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const redis_js_1 = require("../../lib/redis.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── MonitoringService ────────────────────────────────────────────────────────
class MonitoringService {
    /**
     * Produce a complete dashboard snapshot.
     * Called on SSE heartbeat (every 5s) and on initial HTTP load.
     */
    async snapshot() {
        const [bookingCounts, partnerLocs, onlineCount, todayCompleted] = await Promise.all([
            this.getBookingCounts(),
            this.getPartnerLocations(),
            this.getOnlinePartnerCount(),
            this.getTodayCompleted(),
        ]);
        const slaBreaches = await this.getSlaBreachCount();
        return {
            timestamp: new Date().toISOString(),
            bookingCounts,
            onlinePartners: onlineCount,
            activeBookings: bookingCounts.assigned + bookingCounts.en_route + bookingCounts.in_progress,
            todayCompleted,
            slaBreaches,
            avgEtaMinutes: null, // Populated from tracking data in a future iteration
            partnerLocations: partnerLocs,
            zoneMultipliers: await this.getZoneMultipliers(),
        };
    }
    /**
     * Count bookings by status (current state of the system).
     */
    async getBookingCounts() {
        const rows = await client_js_1.db
            .select({
            status: bookings_js_1.bookings.status,
            count: (0, drizzle_orm_1.sql) `COUNT(*)`.mapWith(Number),
        })
            .from(bookings_js_1.bookings)
            .groupBy(bookings_js_1.bookings.status);
        const result = {
            pending: 0, searching: 0, assigned: 0, en_route: 0,
            in_progress: 0, completed: 0, no_partner: 0, cancelled: 0,
        };
        rows.forEach(r => {
            if (r.status in result) {
                result[r.status] = r.count;
            }
        });
        return result;
    }
    /**
     * Get all online partners' GPS coordinates from Redis.
     * Uses GEOPOS for each member in the online set.
     */
    async getPartnerLocations() {
        const onlineIds = await redis_js_1.redis.smembers('partners:online');
        if (onlineIds.length === 0)
            return [];
        const locations = [];
        // Batch GEOPOS lookup
        const pipeline = redis_js_1.redis.pipeline();
        onlineIds.forEach(id => pipeline.geopos('partners:live_locations', id));
        const results = await pipeline.exec();
        onlineIds.forEach((id, i) => {
            const pos = results?.[i]?.[1];
            if (pos?.[0]) {
                const [lng, lat] = pos[0];
                locations.push({
                    partnerId: id,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                });
            }
        });
        return locations;
    }
    /**
     * Count of partners currently online (Redis set).
     */
    async getOnlinePartnerCount() {
        return redis_js_1.redis.scard('partners:online');
    }
    /**
     * Completed bookings since midnight today.
     */
    async getTodayCompleted() {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const [row] = await client_js_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)`.mapWith(Number) })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'completed'), (0, drizzle_orm_1.gte)(bookings_js_1.bookings.jobCompletedAt, todayMidnight)));
        return row?.count ?? 0;
    }
    /**
     * Number of bookings that breached SLA (stuck in 'searching' > SLA threshold).
     */
    async getSlaBreachCount() {
        const slaThreshold = new Date(Date.now() - 10 * 60 * 1000); // 10 min SLA
        const [row] = await client_js_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)`.mapWith(Number) })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.status, 'searching'), (0, drizzle_orm_1.sql) `${bookings_js_1.bookings.searchingStartedAt} < ${slaThreshold}`));
        return row?.count ?? 0;
    }
    /**
     * Read all zone surge multipliers from Redis.
     */
    async getZoneMultipliers() {
        const keys = await redis_js_1.redis.keys('surge:multiplier:*');
        if (keys.length === 0)
            return {};
        const pipeline = redis_js_1.redis.pipeline();
        keys.forEach(k => pipeline.get(k));
        const results = await pipeline.exec();
        const map = {};
        keys.forEach((key, i) => {
            const zone = key.replace('surge:multiplier:', '');
            const val = results?.[i]?.[1];
            if (val)
                map[zone] = parseFloat(String(val));
        });
        return map;
    }
}
exports.MonitoringService = MonitoringService;
exports.monitoringService = new MonitoringService();
//# sourceMappingURL=monitoring.service.js.map