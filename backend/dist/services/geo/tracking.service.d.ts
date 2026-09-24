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
import { redis } from '../../lib/redis.js';
export interface LocationUpdate {
    partnerId: string;
    bookingId: string;
    lat: number;
    lng: number;
    etaMinutes: number;
    updatedAt: string;
}
export declare function trackingChannel(bookingId: string): string;
export declare function partnerStatusChannel(partnerId: string): string;
export declare class TrackingService {
    /**
     * Called by the partner WebSocket handler when a new GPS coordinate arrives.
     * Updates Redis GEO + Pub/Sub.
     */
    publishLocation(partnerId: string, bookingId: string, lat: number, lng: number): Promise<void>;
    /**
     * Subscribe a customer WebSocket to a booking's tracking channel.
     * The caller must create a *dedicated* Redis subscriber connection (not the shared client)
     * because subscribe() puts the connection into subscriber mode.
     *
     * Returns an unsubscribe function.
     */
    subscribeToTracking(bookingId: string, onUpdate: (update: LocationUpdate) => void, subscriberRedis: typeof redis): Promise<() => Promise<void>>;
}
export declare const trackingService: TrackingService;
//# sourceMappingURL=tracking.service.d.ts.map