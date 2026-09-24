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
import type { FastifyInstance } from 'fastify';
export declare function locationRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=location.d.ts.map