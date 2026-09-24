/**
 * Wallet Router — Customer & Partner Wallet APIs
 *
 * Endpoints:
 *
 *   GET  /api/v1/wallet/balance            — Get current wallet balance
 *   GET  /api/v1/wallet/transactions       — Transaction history (paginated)
 *   POST /api/v1/wallet/topup              — Initiate wallet top-up (creates Razorpay order)
 *   POST /api/v1/wallet/topup/verify       — Confirm top-up after Razorpay payment
 *   GET  /api/v1/wallet/referral/code      — Get/generate my referral code
 *   POST /api/v1/wallet/referral/apply     — Apply a referral code (during signup flow)
 */
import type { FastifyInstance } from 'fastify';
export declare function walletRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=wallet.d.ts.map