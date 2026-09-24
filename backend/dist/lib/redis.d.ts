/**
 * Redis Client + Geo Helpers — Shared Lib
 *
 * Uses ioredis for:
 * - OTP caching
 * - Partner location (GEO)
 * - Rate limiting (sorted sets)
 * - Session cache
 * - API response cache
 * - Dispatch locks (SETNX)
 */
import Redis from 'ioredis';
export declare const redis: Redis;
export declare function setOtp(phone: string, otp: string): Promise<void>;
export declare function getOtp(phone: string): Promise<string | null>;
export declare function deleteOtp(phone: string): Promise<void>;
export declare function setPartnerLocation(partnerId: string, lat: number, lng: number): Promise<void>;
export declare function getPartnerLocation(partnerId: string): Promise<{
    lat: number;
    lng: number;
    updatedAt: number;
} | null>;
export declare function removePartnerFromGeo(partnerId: string): Promise<void>;
export interface NearbyPartner {
    partnerId: string;
    distanceKm: number;
}
export declare function getNearbyPartners(lat: number, lng: number, radiusKm: number): Promise<NearbyPartner[]>;
export declare function setPartnerOnline(partnerId: string): Promise<void>;
export declare function setPartnerOffline(partnerId: string): Promise<void>;
export declare function isPartnerOnline(partnerId: string): Promise<boolean>;
/**
 * Atomic SETNX lock for booking acceptance.
 * Returns true if lock acquired (first to accept), false if already accepted.
 */
export declare function acquireDispatchLock(bookingId: string, partnerId: string): Promise<boolean>;
export declare function releaseDispatchLock(bookingId: string): Promise<void>;
export declare function setCache(key: string, value: unknown, ttlSecs?: number): Promise<void>;
export declare function getCache<T>(key: string): Promise<T | null>;
export declare function delCache(key: string): Promise<void>;
export declare function checkRateLimit(identifier: string, limit?: number): Promise<boolean>;
export declare function checkRedisHealth(): Promise<boolean>;
//# sourceMappingURL=redis.d.ts.map