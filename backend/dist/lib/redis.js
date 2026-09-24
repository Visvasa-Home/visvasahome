"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.setOtp = setOtp;
exports.getOtp = getOtp;
exports.deleteOtp = deleteOtp;
exports.setPartnerLocation = setPartnerLocation;
exports.getPartnerLocation = getPartnerLocation;
exports.removePartnerFromGeo = removePartnerFromGeo;
exports.getNearbyPartners = getNearbyPartners;
exports.setPartnerOnline = setPartnerOnline;
exports.setPartnerOffline = setPartnerOffline;
exports.isPartnerOnline = isPartnerOnline;
exports.acquireDispatchLock = acquireDispatchLock;
exports.releaseDispatchLock = releaseDispatchLock;
exports.setCache = setCache;
exports.getCache = getCache;
exports.delCache = delCache;
exports.checkRateLimit = checkRateLimit;
exports.checkRedisHealth = checkRedisHealth;
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
const ioredis_1 = __importDefault(require("ioredis"));
const logger_js_1 = require("./logger.js");
const env_js_1 = require("../env.js");
const REDIS_URL = env_js_1.env.REDIS_URL;
// ─── Singleton client ─────────────────────────────────────────────────────────
exports.redis = new ioredis_1.default(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
});
exports.redis.on('connect', () => logger_js_1.logger.info('[redis] Connected'));
exports.redis.on('ready', () => logger_js_1.logger.info('[redis] Ready'));
exports.redis.on('error', (e) => logger_js_1.logger.error({ err: e }, '[redis] Error'));
exports.redis.on('close', () => logger_js_1.logger.warn('[redis] Connection closed'));
// ─── OTP Helpers ─────────────────────────────────────────────────────────────
const OTP_TTL = parseInt(env_js_1.env.OTP_TTL_SECS, 10); // 5 minutes
async function setOtp(phone, otp) {
    await exports.redis.setex(`otp:${phone}`, OTP_TTL, otp);
}
async function getOtp(phone) {
    return exports.redis.get(`otp:${phone}`);
}
async function deleteOtp(phone) {
    await exports.redis.del(`otp:${phone}`);
}
// ─── Partner Location Helpers (Redis GEO) ────────────────────────────────────
const PARTNER_GEO_KEY = 'partners:geo';
async function setPartnerLocation(partnerId, lat, lng) {
    // GEOADD key longitude latitude member
    await exports.redis.geoadd(PARTNER_GEO_KEY, lng, lat, partnerId);
    // Also cache the full location object with TTL
    await exports.redis.setex(`partner:location:${partnerId}`, 60, // 60s TTL — stale after 1 min
    JSON.stringify({ lat, lng, updatedAt: Date.now() }));
}
async function getPartnerLocation(partnerId) {
    const raw = await exports.redis.get(`partner:location:${partnerId}`);
    return raw ? JSON.parse(raw) : null;
}
async function removePartnerFromGeo(partnerId) {
    await exports.redis.zrem(PARTNER_GEO_KEY, partnerId);
    await exports.redis.del(`partner:location:${partnerId}`);
}
async function getNearbyPartners(lat, lng, radiusKm) {
    // GEORADIUS returns [member, distance, ...] when WITHCOORD WITHDIST
    const results = await exports.redis.georadius(PARTNER_GEO_KEY, lng, lat, radiusKm, 'km', 'WITHDIST', 'ASC', 'COUNT', '20');
    return results.map(([partnerId, dist]) => ({
        partnerId,
        distanceKm: parseFloat(dist),
    }));
}
// ─── Partner Online Status ────────────────────────────────────────────────────
async function setPartnerOnline(partnerId) {
    await exports.redis.sadd('partners:online', partnerId);
    await exports.redis.setex(`partner:online:${partnerId}`, 120, '1'); // heartbeat TTL
}
async function setPartnerOffline(partnerId) {
    await exports.redis.srem('partners:online', partnerId);
    await exports.redis.del(`partner:online:${partnerId}`);
    await removePartnerFromGeo(partnerId);
}
async function isPartnerOnline(partnerId) {
    const val = await exports.redis.get(`partner:online:${partnerId}`);
    return val !== null;
}
// ─── Dispatch Lock (race-safe offer acceptance) ───────────────────────────────
/**
 * Atomic SETNX lock for booking acceptance.
 * Returns true if lock acquired (first to accept), false if already accepted.
 */
async function acquireDispatchLock(bookingId, partnerId) {
    const key = `dispatch:lock:${bookingId}`;
    const result = await exports.redis.set(key, partnerId, 'EX', 300, 'NX'); // 5 min TTL
    return result === 'OK';
}
async function releaseDispatchLock(bookingId) {
    await exports.redis.del(`dispatch:lock:${bookingId}`);
}
// ─── General Cache ────────────────────────────────────────────────────────────
async function setCache(key, value, ttlSecs = 300) {
    await exports.redis.setex(key, ttlSecs, JSON.stringify(value));
}
async function getCache(key) {
    const raw = await exports.redis.get(key);
    return raw ? JSON.parse(raw) : null;
}
async function delCache(key) {
    await exports.redis.del(key);
}
// ─── Rate Limiting (sliding window) ──────────────────────────────────────────
const RATE_LIMIT_PER_MIN = parseInt(env_js_1.env.RATE_LIMIT_PER_MINUTE, 10);
async function checkRateLimit(identifier, limit = RATE_LIMIT_PER_MIN) {
    const now = Date.now();
    const windowStart = now - 60_000;
    const key = `ratelimit:${identifier}`;
    const pipeline = exports.redis.pipeline();
    pipeline.zremrangebyscore(key, '-inf', windowStart);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.zcard(key);
    pipeline.expire(key, 60);
    const results = await pipeline.exec();
    const count = results?.[2]?.[1] ?? 0;
    return count <= limit;
}
// ─── Health ───────────────────────────────────────────────────────────────────
async function checkRedisHealth() {
    try {
        await exports.redis.ping();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=redis.js.map