"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingService = exports.PricingService = void 0;
/**
 * PricingService — Layer 3: Domain Services
 *
 * Single source of truth for all price calculations.
 * No frontend or router should compute prices independently.
 *
 * Rules:
 *   final = (base + addons - discount + surge) * (1 + gstRate)
 *   surge = 10% of base if SURGE_ENABLED and demand > threshold
 */
const client_js_1 = require("../../db/client.js");
const services_js_1 = require("../../db/schema/services.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
const surge_service_js_1 = require("./surge.service.js");
// ─── Constants ────────────────────────────────────────────────────────────────
const GST_RATE = parseFloat(process.env.GST_RATE ?? '0.18'); // 18%
const SURGE_ENABLED = process.env.SURGE_ENABLED !== 'false';
// ─── PricingService ───────────────────────────────────────────────────────────
class PricingService {
    /**
     * Calculate the complete price breakdown for a booking.
     * All prices in INR, precision handled at 2 decimal places.
     */
    async quote(input) {
        const base = parseFloat(input.basePrice.toFixed(2));
        const addons = parseFloat((input.addonsTotal ?? 0).toFixed(2));
        // ─── Dynamic surge pricing ────────────────────────────────────────────────
        let surge = 0;
        if (SURGE_ENABLED) {
            if (input.zoneId) {
                // Real demand/supply-based surge via SurgeService
                surge = await surge_service_js_1.surgeService.getSurgeAmount(base, input.zoneId, input.serviceId);
            }
            else if (input.isSurge) {
                // Legacy fallback: flat 10% surge (when no zone info available)
                const multiplier = await surge_service_js_1.surgeService.getMultiplier('default');
                surge = parseFloat(((multiplier - 1.0) * base).toFixed(2));
            }
        }
        let discount = 0;
        let couponId;
        if (input.couponCode) {
            const couponResult = await this.applyCoupon(input.couponCode, base + addons, input.serviceId, input.customerId);
            discount = couponResult.discountAmount;
            couponId = couponResult.couponId;
        }
        const taxableAmount = parseFloat(Math.max(0, base + addons + surge - discount).toFixed(2));
        const taxAmount = parseFloat((taxableAmount * GST_RATE).toFixed(2));
        const finalAmount = parseFloat((taxableAmount + taxAmount).toFixed(2));
        return {
            basePrice: base,
            addonsAmount: addons,
            surgeAmount: surge,
            discountAmount: discount,
            taxableAmount,
            taxAmount,
            finalAmount,
            couponId,
        };
    }
    /**
     * AMC visit price — always ₹0 (subscription covers the cost)
     */
    amcVisitPrice() {
        return {
            basePrice: 0, addonsAmount: 0, surgeAmount: 0,
            discountAmount: 0, taxableAmount: 0, taxAmount: 0, finalAmount: 0,
        };
    }
    /**
     * Calculate platform commission on a booking payment.
     * commission = grossAmount * commissionPct / 100
     * partnerEarning = grossAmount - commission - taxOnCommission
     */
    calculateCommission(grossAmount, commissionPct) {
        const commissionAmount = parseFloat((grossAmount * commissionPct / 100).toFixed(2));
        const taxOnCommission = parseFloat((commissionAmount * GST_RATE).toFixed(2));
        const partnerEarning = parseFloat((grossAmount - commissionAmount - taxOnCommission).toFixed(2));
        return { commissionAmount, taxOnCommission, partnerEarning };
    }
    // ─── Private: Coupon Application ────────────────────────────────────────────
    async applyCoupon(code, orderTotal, serviceId, customerId) {
        const now = new Date();
        const [coupon] = await client_js_1.db
            .select()
            .from(services_js_1.coupons)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(services_js_1.coupons.code, code.toUpperCase()), (0, drizzle_orm_1.eq)(services_js_1.coupons.isActive, true), (0, drizzle_orm_1.lte)(services_js_1.coupons.validFrom, now), (0, drizzle_orm_1.gte)(services_js_1.coupons.validUntil, now)))
            .limit(1);
        if (!coupon)
            throw errors_js_1.Errors.couponInvalid('Coupon not found or inactive');
        if (coupon.maxUses !== null && coupon.totalUsed >= coupon.maxUses) {
            throw errors_js_1.Errors.couponInvalid('Coupon usage limit reached');
        }
        if (orderTotal < parseFloat(String(coupon.minOrderValue))) {
            throw errors_js_1.Errors.couponInvalid(`Minimum order value ₹${coupon.minOrderValue} required`);
        }
        const applicableServices = coupon.applicableServices;
        if (serviceId && applicableServices.length > 0 && !applicableServices.includes(serviceId)) {
            throw errors_js_1.Errors.couponInvalid('Coupon not applicable for this service');
        }
        let discountAmount = 0;
        if (coupon.couponType === 'flat') {
            discountAmount = parseFloat(String(coupon.discountValue));
        }
        else if (coupon.couponType === 'percent') {
            discountAmount = (orderTotal * parseFloat(String(coupon.discountValue))) / 100;
            if (coupon.maxDiscountCap) {
                discountAmount = Math.min(discountAmount, parseFloat(String(coupon.maxDiscountCap)));
            }
        }
        else if (coupon.couponType === 'free_service') {
            discountAmount = orderTotal;
        }
        discountAmount = parseFloat(Math.min(discountAmount, orderTotal).toFixed(2));
        // Increment usage count atomically
        await client_js_1.db
            .update(services_js_1.coupons)
            .set({ totalUsed: (0, drizzle_orm_2.sql) `${services_js_1.coupons.totalUsed} + 1` })
            .where((0, drizzle_orm_1.eq)(services_js_1.coupons.id, coupon.id));
        return { discountAmount, couponId: coupon.id };
    }
}
exports.PricingService = PricingService;
exports.pricingService = new PricingService();
//# sourceMappingURL=pricing.service.js.map