"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoService = exports.GeoService = void 0;
/**
 * GeoService — Layer 3: Domain Services
 *
 * Tracks live partner locations using Redis GEO commands and handles
 * serviceability checks based on polygon zones.
 */
const redis_js_1 = require("../../lib/redis.js");
const logger_js_1 = require("../../lib/logger.js");
const circuitBreaker_js_1 = require("../../lib/circuitBreaker.js");
class GeoService {
    GEO_KEY = 'partners:live_locations';
    mapsBreaker = new circuitBreaker_js_1.CircuitBreaker('GoogleMapsAPI', 3, 10000, 500);
    async updateLocation(partnerId, lat, lng) {
        await redis_js_1.redis.geoadd(this.GEO_KEY, lng, lat, partnerId);
        // Also set an expiration for the partner's location so stale data drops out
        await redis_js_1.redis.set(`partner:last_seen:${partnerId}`, Date.now().toString(), 'EX', 3600);
    }
    async findNearbyPartners(lat, lng, radiusKm) {
        return (await redis_js_1.redis.geosearch(this.GEO_KEY, 'FROMLONLAT', lng, lat, 'BYRADIUS', radiusKm, 'km', 'ASC'));
    }
    async getETA(originLat, originLng, destLat, destLng) {
        return this.mapsBreaker.fire(async () => {
            // Mock Google Maps API call
            // In a real scenario, this would be: await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json...')
            await new Promise(resolve => setTimeout(resolve, 50));
            // Throw an error randomly 10% of the time to simulate network instability
            if (Math.random() < 0.1) {
                throw new Error('Google Maps API timeout');
            }
            // Haversine rough distance -> ETA
            const distanceKm = Math.sqrt(Math.pow(destLat - originLat, 2) + Math.pow(destLng - originLng, 2)) * 111;
            const speedKmph = 30; // avg city speed
            const timeMinutes = Math.round((distanceKm / speedKmph) * 60);
            return Math.max(5, timeMinutes); // Minimum 5 mins
        }, async () => {
            // Fallback calculation if Google Maps is down
            logger_js_1.logger.warn('[geo] Maps API down, using fallback straight-line calculation');
            const distanceKm = Math.sqrt(Math.pow(destLat - originLat, 2) + Math.pow(destLng - originLng, 2)) * 111;
            return Math.round((distanceKm / 20) * 60); // Slower fallback speed assumption
        });
    }
}
exports.GeoService = GeoService;
exports.geoService = new GeoService();
//# sourceMappingURL=geo.service.js.map