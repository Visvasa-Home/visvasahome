"use strict";
/**
 * TrackingService — Layer 3: Domain Services
 *
 * Manages real-time partner GPS tracking using a Redis Pub/Sub channel per booking.
 *
 * Flow:
 *   Partner app → WebSocket → GeoService.updateLocation() → Redis GEOADD
 *                                                          → Redis PUBLISH tracking:{bookingId}
 *   Customer app → WebSocket → subscribes to Redis channel tracking:{bookingId}
 *                           ← receives {lat, lng, etaMinutes} every GPS update
 *
 * This decouples the partner's write from the customer's read — any number of
 * customer WebSockets can subscribe to the same channel without the partner knowing.
 *
 * ETA Calculation:
 *   On each location update the service calls GeoService.getETA() for the customer's
 *   address and broadcasts it. The customer sees a live countdown on their map UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingService = exports.TrackingService = void 0;
exports.trackingChannel = trackingChannel;
exports.partnerStatusChannel = partnerStatusChannel;
const redis_js_1 = require("../../lib/redis.js");
const geo_service_js_1 = require("../geo/geo.service.js");
const logger_js_1 = require("../../lib/logger.js");
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const users_js_1 = require("../../db/schema/users.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Channel naming ───────────────────────────────────────────────────────────
function trackingChannel(bookingId) {
    return `tracking:${bookingId}`;
}
function partnerStatusChannel(partnerId) {
    return `partner:status:${partnerId}`;
}
// ─── TrackingService ──────────────────────────────────────────────────────────
class TrackingService {
    /**
     * Called by the partner WebSocket handler when a new GPS coordinate arrives.
     * Updates Redis GEO + Pub/Sub.
     */
    async publishLocation(partnerId, bookingId, lat, lng) {
        // 1. Update Redis GEO index (for nearby-partner queries)
        await geo_service_js_1.geoService.updateLocation(partnerId, lat, lng);
        // 2. Compute ETA to customer location
        let etaMinutes = 0;
        try {
            const [booking] = await client_js_1.db
                .select({ addressId: bookings_js_1.bookings.addressId })
                .from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId))
                .limit(1);
            if (booking) {
                const [addr] = await client_js_1.db
                    .select({ lat: users_js_1.addresses.latitude, lng: users_js_1.addresses.longitude })
                    .from(users_js_1.addresses)
                    .where((0, drizzle_orm_1.eq)(users_js_1.addresses.id, booking.addressId))
                    .limit(1);
                if (addr?.lat && addr?.lng) {
                    etaMinutes = await geo_service_js_1.geoService.getETA(lat, lng, parseFloat(addr.lat), parseFloat(addr.lng));
                }
            }
        }
        catch (err) {
            logger_js_1.logger.warn({ err, partnerId, bookingId }, '[tracking] ETA calculation failed');
        }
        // 3. Publish to Redis channel — all subscribers receive this atomically
        const payload = {
            partnerId,
            bookingId,
            lat,
            lng,
            etaMinutes,
            updatedAt: new Date().toISOString(),
        };
        await redis_js_1.redis.publish(trackingChannel(bookingId), JSON.stringify(payload));
        logger_js_1.logger.debug({ partnerId, bookingId, lat, lng, etaMinutes }, '[tracking] Location published');
    }
    /**
     * Subscribe a customer WebSocket to a booking's tracking channel.
     * The caller must create a *dedicated* Redis subscriber connection (not the shared client)
     * because subscribe() puts the connection into subscriber mode.
     *
     * Returns an unsubscribe function.
     */
    async subscribeToTracking(bookingId, onUpdate, subscriberRedis) {
        const channel = trackingChannel(bookingId);
        await subscriberRedis.subscribe(channel, (err, _count) => {
            if (err)
                logger_js_1.logger.error({ err, channel }, '[tracking] Subscribe error');
        });
        subscriberRedis.on('message', (chan, message) => {
            if (chan !== channel)
                return;
            try {
                const update = JSON.parse(message);
                onUpdate(update);
            }
            catch (parseErr) {
                logger_js_1.logger.warn({ parseErr, channel }, '[tracking] Failed to parse message');
            }
        });
        logger_js_1.logger.info({ bookingId, channel }, '[tracking] Customer subscribed to tracking');
        return async () => {
            await subscriberRedis.unsubscribe(channel);
        };
    }
}
exports.TrackingService = TrackingService;
exports.trackingService = new TrackingService();
//# sourceMappingURL=tracking.service.js.map