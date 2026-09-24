"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withIdempotency = withIdempotency;
const redis_js_1 = require("../../lib/redis.js");
const errors_js_1 = require("../../lib/errors.js");
const response_js_1 = require("../../lib/response.js");
/**
 * Idempotency Middleware
 * Intercepts requests that provide an Idempotency-Key header.
 * Uses Redis to ensure the exact same payload is not processed twice.
 */
async function withIdempotency(request, reply) {
    const idempotencyKey = request.headers['idempotency-key'] || request.headers['x-razorpay-event-id'];
    if (!idempotencyKey) {
        return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation({ idempotency: 'Idempotency key header is required' }));
    }
    const user = request.user;
    const key = `idempotency:${user?.sub ?? request.ip}:${idempotencyKey}`;
    // Attempt to acquire lock for this key
    const set = await redis_js_1.redis.set(key, 'processing', 'EX', 24 * 60 * 60, 'NX');
    if (!set) {
        // If the key already exists, return conflict immediately to prevent duplicate processing
        return (0, response_js_1.sendError)(reply, errors_js_1.Errors.conflict('Duplicate request detected. This idempotency key has already been used.'));
    }
}
//# sourceMappingURL=idempotency.js.map