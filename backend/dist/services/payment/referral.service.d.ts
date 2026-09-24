/**
 * ReferralService — Layer 3: Domain Services
 *
 * Manages the referral program:
 *
 *   1. generate(referrerId) → creates a unique referral code, stores in DB
 *   2. applyReferral(referralCode, refereeId) → links referee to referrer on signup
 *   3. completeReferral(refereeId, bookingId) → called after referee's first booking
 *      completes → credits referrer's wallet + refereeDiscount was applied at booking
 *   4. expire() → cron job: mark stale referrals as expired
 *
 * Reward structure (configurable via env):
 *   REFERRER_REWARD_INR = ₹150 (referrer's wallet credit)
 *   REFEREE_DISCOUNT_INR = ₹100 (applied as flat coupon at checkout)
 *
 * Fraud prevention:
 *   - One active referral per referrer at a time
 *   - Referee must not already have an account when they click the link
 *   - Completion only triggers on first successful booking (status = 'completed')
 *   - 30-day expiry window
 */
export declare class ReferralService {
    /**
     * Generate a unique referral code for a user.
     * Idempotent — returns existing pending code if one exists.
     */
    generate(referrerId: string): Promise<{
        referralCode: string;
        referrerReward: number;
        refereeDiscount: number;
        expiresAt: Date;
    }>;
    /**
     * Apply a referral code during signup.
     * Associates the new user (referee) with the referrer's referral record.
     */
    applyOnSignup(referralCode: string, refereeId: string): Promise<void>;
    /**
     * Complete a referral after the referee finishes their first booking.
     * Credits the referrer's wallet. Called from the booking completion event handler.
     */
    completeReferral(refereeId: string, bookingId: string): Promise<void>;
    /**
     * Get the discount amount a referee is entitled to on their first booking.
     * Returns 0 if the referee wasn't referred or already used their discount.
     */
    getRefereeDiscount(refereeId: string): Promise<number>;
    /**
     * Expire stale referrals (run as a daily cron).
     * Returns the number of referrals expired.
     */
    expireStale(): Promise<number>;
}
export declare const referralService: ReferralService;
//# sourceMappingURL=referral.service.d.ts.map