"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotService = exports.SlotService = void 0;
/**
 * SlotService — Layer 3: Domain Services
 *
 * Handles slot inventory, scheduling, and Redis Redlocks to prevent double-booking
 * of the same slot in the same zone while a customer is paying.
 */
const redis_js_1 = require("../../lib/redis.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
// ─── SlotService ──────────────────────────────────────────────────────────────
class SlotService {
    /**
     * Acquire a 10-minute hold (soft-lock) on a specific slot in a specific zone.
     * If the slot is already held or fully booked, this will throw an error.
     *
     * A "slot key" looks like: `slot:{zoneId}:{serviceId}:{YYYY-MM-DD}:{HH:MM}`
     */
    async holdSlot(zoneId, serviceId, dateStr, timeStr, customerId) {
        const slotKey = `slot:${zoneId}:${serviceId}:${dateStr}:${timeStr}`;
        const holdKey = `slot_hold:${slotKey}`;
        // Normally we would check real-time availability in the DB vs total capacity in the zone.
        // For this MVP, we use Redis to simply prevent two people from grabbing the same slot
        // within the payment window.
        // Try to acquire the lock (SETNX). TTL = 600 seconds (10 minutes)
        const acquired = await redis_js_1.redis.set(holdKey, customerId, 'EX', 600, 'NX');
        if (!acquired) {
            // Check who holds it
            const holder = await redis_js_1.redis.get(holdKey);
            if (holder === customerId) {
                // You already hold this slot
                return holdKey;
            }
            throw errors_js_1.Errors.conflict('This slot is currently being booked by someone else. Please try another slot or wait 10 minutes.');
        }
        logger_js_1.logger.info({ zoneId, serviceId, dateStr, timeStr, customerId }, '[slot] Acquired soft-lock on slot');
        return holdKey;
    }
    /**
     * Release the hold. Called if payment fails or expires.
     */
    async releaseHold(zoneId, serviceId, dateStr, timeStr, customerId) {
        const slotKey = `slot:${zoneId}:${serviceId}:${dateStr}:${timeStr}`;
        const holdKey = `slot_hold:${slotKey}`;
        const holder = await redis_js_1.redis.get(holdKey);
        if (holder === customerId) {
            await redis_js_1.redis.del(holdKey);
            logger_js_1.logger.info({ zoneId, serviceId, dateStr, timeStr, customerId }, '[slot] Released soft-lock on slot');
        }
    }
    /**
     * Finalize the slot (convert hold to permanent booking).
     * Called when payment is successfully captured.
     */
    async finalizeSlot(zoneId, serviceId, dateStr, timeStr, customerId) {
        // In a full implementation, we'd write to a `slot_inventory` DB table here to decrement capacity.
        // Since we are confirming it, we can release the Redis hold so it doesn't block future checks
        // on DB capacity (once the DB reflects the new booking, capacity checks will fail naturally).
        await this.releaseHold(zoneId, serviceId, dateStr, timeStr, customerId);
    }
}
exports.SlotService = SlotService;
exports.slotService = new SlotService();
//# sourceMappingURL=slot.service.js.map