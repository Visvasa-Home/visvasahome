"use strict";
/**
 * Location Router — Real-time GPS Tracking
 *
 * Endpoints:
 *
 *   WebSocket GET /api/v1/location/tracking?token=JWT
 *     Partner: sends {type:"location", lat, lng, bookingId} to publish GPS
 *     Customer: sends {type:"subscribe", bookingId} to receive live GPS + ETA
 *
 *   GET /api/v1/location/tracking/:bookingId/latest
 *     Returns the last known GPS coordinate for a booking (from Redis)
 *
 *   GET /api/v1/location/eta?bookingId=...
 *     Returns current ETA for a specific booking (HTTP polling fallback)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRouter = locationRouter;
const jwt_js_1 = require("../../lib/jwt.js");
const geo_service_js_1 = require("../../services/geo/geo.service.js");
const tracking_service_js_1 = require("../../services/geo/tracking.service.js");
const logger_js_1 = require("../../lib/logger.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const users_js_1 = require("../../db/schema/users.js");
const drizzle_orm_1 = require("drizzle-orm");
// Dedicated Redis subscriber connections per WebSocket (avoid shared client)
const ioredis_1 = __importDefault(require("ioredis"));
const env_js_1 = require("../../env.js");
async function locationRouter(fastify) {
    const { authenticate } = fastify;
    const anyGuard = [authenticate];
    // ─── WebSocket: unified tracking endpoint ──────────────────────────────────
    fastify.get('/tracking', { websocket: true }, (connection, req) => {
        const tokenQuery = req.query?.token;
        const tokenHeader = req.headers.authorization;
        let token = '';
        if (tokenHeader)
            token = (0, jwt_js_1.extractBearer)(tokenHeader);
        else if (tokenQuery)
            token = tokenQuery;
        if (!token) {
            connection.send(JSON.stringify({ error: 'Unauthorized: No token provided' }));
            return connection.close(1008, 'Unauthorized');
        }
        let unsubscribe = null;
        // Each customer subscriber gets its own Redis connection to avoid shared-client issues
        const subscriberClient = new ioredis_1.default(env_js_1.env.REDIS_URL);
        (0, jwt_js_1.verifyToken)(token)
            .then((payload) => {
            logger_js_1.logger.info({ userId: payload.sub, role: payload.role }, '[location] WS connected');
            connection.on('message', async (rawData) => {
                try {
                    const msg = JSON.parse(rawData.toString());
                    // ── Partner: publish GPS location ────────────────────────────────
                    if (payload.role === 'partner' && msg.type === 'location') {
                        const { lat, lng, bookingId } = msg;
                        if (!lat || !lng || !bookingId)
                            return;
                        await tracking_service_js_1.trackingService.publishLocation(payload.sub, bookingId, lat, lng);
                        connection.send(JSON.stringify({ type: 'ack', bookingId }));
                    }
                    // ── Customer: subscribe to a booking's tracking ──────────────────
                    if (payload.role === 'customer' && msg.type === 'subscribe') {
                        const { bookingId } = msg;
                        if (!bookingId)
                            return;
                        // Clean up any previous subscription
                        if (unsubscribe)
                            await unsubscribe();
                        unsubscribe = await tracking_service_js_1.trackingService.subscribeToTracking(bookingId, (update) => {
                            if (connection.readyState === 1 /* OPEN */) {
                                connection.send(JSON.stringify({ type: 'location_update', data: update }));
                            }
                        }, subscriberClient);
                        connection.send(JSON.stringify({ type: 'subscribed', bookingId }));
                        logger_js_1.logger.info({ customerId: payload.sub, bookingId }, '[location] Customer subscribed');
                    }
                    // ── Customer: unsubscribe ────────────────────────────────────────
                    if (payload.role === 'customer' && msg.type === 'unsubscribe') {
                        if (unsubscribe) {
                            await unsubscribe();
                            unsubscribe = null;
                        }
                    }
                }
                catch (err) {
                    logger_js_1.logger.error({ err }, '[location] WS message error');
                }
            });
            connection.on('close', async () => {
                if (unsubscribe)
                    await unsubscribe().catch(() => { });
                await subscriberClient.quit().catch(() => { });
                logger_js_1.logger.info({ userId: payload.sub }, '[location] WS disconnected, cleaned up');
            });
            connection.on('error', (err) => {
                logger_js_1.logger.error({ err }, '[location] WS error');
            });
        })
            .catch(() => {
            connection.send(JSON.stringify({ error: 'Unauthorized: Invalid token' }));
            connection.close(1008, 'Unauthorized');
            subscriberClient.quit().catch(() => { });
        });
    });
    // ─── HTTP: latest location for a booking (polling fallback) ────────────────
    fastify.get('/tracking/:bookingId/latest', { preHandler: anyGuard }, async (req, reply) => {
        const { bookingId } = req.params;
        const { sub: userId, role } = req.user;
        // Verify access: must be the customer or assigned partner
        const [booking] = await client_js_1.db
            .select({ customerId: bookings_js_1.bookings.customerId, partnerId: bookings_js_1.bookings.partnerId, addressId: bookings_js_1.bookings.addressId })
            .from(bookings_js_1.bookings)
            .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId))
            .limit(1);
        if (!booking)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Booking'));
        if (role === 'customer' && booking.customerId !== userId)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden());
        if (role === 'partner' && booking.partnerId !== userId)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden());
        // Get partner's last known location from Redis GEO
        const partnerLoc = await redis_geopos(booking.partnerId);
        if (!partnerLoc)
            return (0, response_js_1.sendOk)(reply, { location: null, message: 'Partner location not yet available' });
        // Calculate ETA
        const [addr] = await client_js_1.db
            .select({ lat: users_js_1.addresses.latitude, lng: users_js_1.addresses.longitude })
            .from(users_js_1.addresses)
            .where((0, drizzle_orm_1.eq)(users_js_1.addresses.id, booking.addressId))
            .limit(1);
        const etaMinutes = addr?.lat && addr?.lng
            ? await geo_service_js_1.geoService.getETA(partnerLoc.lat, partnerLoc.lng, parseFloat(addr.lat), parseFloat(addr.lng))
            : null;
        return (0, response_js_1.sendOk)(reply, {
            location: partnerLoc,
            etaMinutes,
            bookingId,
        });
    });
    // ─── HTTP: ETA polling endpoint ─────────────────────────────────────────────
    fastify.get('/eta', { preHandler: anyGuard }, async (req, reply) => {
        const { partnerLat, partnerLng, destLat, destLng } = req.query;
        if (!partnerLat || !partnerLng || !destLat || !destLng) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation({ query: 'partnerLat, partnerLng, destLat, destLng required' }));
        }
        const eta = await geo_service_js_1.geoService.getETA(parseFloat(partnerLat), parseFloat(partnerLng), parseFloat(destLat), parseFloat(destLng));
        return (0, response_js_1.sendOk)(reply, { etaMinutes: eta });
    });
}
// Helper: get partner lat/lng from Redis GEO
async function redis_geopos(partnerId) {
    const { redis: redisClient } = await import('../../lib/redis.js');
    const result = await redisClient.geopos('partners:live_locations', partnerId);
    if (!result?.[0])
        return null;
    const [lng, lat] = result[0];
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
}
//# sourceMappingURL=location.js.map