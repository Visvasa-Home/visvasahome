"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralService = exports.ReferralService = void 0;
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const wallet_service_js_1 = require("./wallet.service.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
const nanoid_1 = require("nanoid");
// ─── Config ───────────────────────────────────────────────────────────────────
const REFERRER_REWARD_INR = parseFloat(process.env.REFERRER_REWARD_INR ?? '150');
const REFEREE_DISCOUNT_INR = parseFloat(process.env.REFEREE_DISCOUNT_INR ?? '100');
const REFERRAL_TTL_DAYS = parseInt(process.env.REFERRAL_TTL_DAYS ?? '30', 10);
// ─── ReferralService ──────────────────────────────────────────────────────────
class ReferralService {
    /**
     * Generate a unique referral code for a user.
     * Idempotent — returns existing pending code if one exists.
     */
    async generate(referrerId) {
        // Check for existing active referral
        const [existing] = await client_js_1.db
            .select({ referralCode: payments_js_1.referrals.referralCode, expiresAt: payments_js_1.referrals.expiresAt })
            .from(payments_js_1.referrals)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.referrals.referrerId, referrerId), (0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'pending')))
            .limit(1);
        if (existing) {
            return {
                referralCode: existing.referralCode,
                referrerReward: REFERRER_REWARD_INR,
                refereeDiscount: REFEREE_DISCOUNT_INR,
                expiresAt: existing.expiresAt,
            };
        }
        // Generate new code: 8-char alphanumeric (collision-safe via DB unique constraint)
        const code = `VH${(0, nanoid_1.nanoid)(6).toUpperCase()}`;
        const expiresAt = new Date(Date.now() + REFERRAL_TTL_DAYS * 24 * 60 * 60 * 1000);
        await client_js_1.db.insert(payments_js_1.referrals).values({
            referrerId,
            referralCode: code,
            referrerCredit: REFERRER_REWARD_INR.toFixed(2),
            refereeCredit: REFEREE_DISCOUNT_INR.toFixed(2),
            expiresAt,
        });
        logger_js_1.logger.info({ referrerId, code }, '[referral] Generated referral code');
        return {
            referralCode: code,
            referrerReward: REFERRER_REWARD_INR,
            refereeDiscount: REFEREE_DISCOUNT_INR,
            expiresAt,
        };
    }
    /**
     * Apply a referral code during signup.
     * Associates the new user (referee) with the referrer's referral record.
     */
    async applyOnSignup(referralCode, refereeId) {
        const [referral] = await client_js_1.db
            .select()
            .from(payments_js_1.referrals)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.referrals.referralCode, referralCode.toUpperCase()), (0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'pending')))
            .limit(1);
        if (!referral) {
            logger_js_1.logger.warn({ referralCode, refereeId }, '[referral] Invalid or expired code');
            return; // Silently ignore — don't block signup
        }
        if (referral.referrerId === refereeId) {
            logger_js_1.logger.warn({ refereeId }, '[referral] Self-referral attempt blocked');
            return;
        }
        if (new Date() > referral.expiresAt) {
            await client_js_1.db.update(payments_js_1.referrals).set({ status: 'expired' }).where((0, drizzle_orm_1.eq)(payments_js_1.referrals.id, referral.id));
            return;
        }
        await client_js_1.db.update(payments_js_1.referrals).set({
            refereeId,
            status: 'signed_up',
        }).where((0, drizzle_orm_1.eq)(payments_js_1.referrals.id, referral.id));
        logger_js_1.logger.info({ referralCode, refereeId, referrerId: referral.referrerId }, '[referral] Referee linked');
    }
    /**
     * Complete a referral after the referee finishes their first booking.
     * Credits the referrer's wallet. Called from the booking completion event handler.
     */
    async completeReferral(refereeId, bookingId) {
        const [referral] = await client_js_1.db
            .select()
            .from(payments_js_1.referrals)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.referrals.refereeId, refereeId), (0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'signed_up')))
            .limit(1);
        if (!referral)
            return; // Referee has no pending referral
        if (new Date() > referral.expiresAt) {
            await client_js_1.db.update(payments_js_1.referrals).set({ status: 'expired' }).where((0, drizzle_orm_1.eq)(payments_js_1.referrals.id, referral.id));
            return;
        }
        // Credit referrer's wallet
        await wallet_service_js_1.walletService.credit(referral.referrerId, 'customer', REFERRER_REWARD_INR, 'referral_bonus', referral.id, `Referral reward — ${referral.referralCode}`);
        // Mark referral as completed + rewarded
        await client_js_1.db.update(payments_js_1.referrals).set({
            status: 'rewarded',
            firstBookingId: bookingId,
            completedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(payments_js_1.referrals.id, referral.id));
        logger_js_1.logger.info({ referralId: referral.id, referrerId: referral.referrerId, refereeId, reward: REFERRER_REWARD_INR }, '[referral] Referral completed — reward credited');
    }
    /**
     * Get the discount amount a referee is entitled to on their first booking.
     * Returns 0 if the referee wasn't referred or already used their discount.
     */
    async getRefereeDiscount(refereeId) {
        const [referral] = await client_js_1.db
            .select({ refereeCredit: payments_js_1.referrals.refereeCredit, status: payments_js_1.referrals.status })
            .from(payments_js_1.referrals)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.referrals.refereeId, refereeId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'signed_up'), (0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'completed'))))
            .limit(1);
        return referral ? parseFloat(String(referral.refereeCredit)) : 0;
    }
    /**
     * Expire stale referrals (run as a daily cron).
     * Returns the number of referrals expired.
     */
    async expireStale() {
        const now = new Date();
        const result = await client_js_1.db
            .update(payments_js_1.referrals)
            .set({ status: 'expired' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.lt)(payments_js_1.referrals.expiresAt, now), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'pending'), (0, drizzle_orm_1.eq)(payments_js_1.referrals.status, 'signed_up'))));
        const count = result.rowCount ?? 0;
        if (count > 0)
            logger_js_1.logger.info({ count }, '[referral] Expired stale referrals');
        return count;
    }
}
exports.ReferralService = ReferralService;
exports.referralService = new ReferralService();
//# sourceMappingURL=referral.service.js.map