import { type SurgeGoal } from './surge.service.js';
export interface PriceBreakdown {
    basePrice: number;
    addonsAmount: number;
    surgeAmount: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    finalAmount: number;
    couponId?: string;
}
export interface QuoteInput {
    basePrice: number;
    addonsTotal?: number;
    couponCode?: string;
    serviceId?: string;
    customerId?: string;
    zoneId?: string;
    surgeGoal?: SurgeGoal;
    isSurge?: boolean;
}
export declare class PricingService {
    /**
     * Calculate the complete price breakdown for a booking.
     * All prices in INR, precision handled at 2 decimal places.
     */
    quote(input: QuoteInput): Promise<PriceBreakdown>;
    /**
     * AMC visit price — always ₹0 (subscription covers the cost)
     */
    amcVisitPrice(): PriceBreakdown;
    /**
     * Calculate platform commission on a booking payment.
     * commission = grossAmount * commissionPct / 100
     * partnerEarning = grossAmount - commission - taxOnCommission
     */
    calculateCommission(grossAmount: number, commissionPct: number): {
        commissionAmount: number;
        taxOnCommission: number;
        partnerEarning: number;
    };
    private applyCoupon;
}
export declare const pricingService: PricingService;
//# sourceMappingURL=pricing.service.d.ts.map