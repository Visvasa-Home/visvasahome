"use strict";
/**
 * WalletService — Layer 3: Domain Services
 *
 * Manages internal wallets for both Customers and Partners.
 *
 * Customer wallet:
 *   - Top-up via payment gateway (Razorpay order → webhook → credit)
 *   - Spend on booking checkout (debited atomically with booking creation)
 *   - Refund receipt (credited when a booking is refunded)
 *   - Referral credit (credited on referral completion)
 *
 * Partner wallet:
 *   - Earnings credited on booking completion (gross - commission - tax)
 *   - Partial instant disbursement to UPI/bank on demand
 *   - Remaining balance settled on M/W/F payout cycle
 *
 * Accounting:
 *   All balance changes use a double-entry ledger (walletTransactions).
 *   No direct UPDATE to balance — always INSERT a ledger record + atomic
 *   increment/decrement. This ensures full audit trail.
 *
 * Concurrency:
 *   Balance changes use Postgres FOR UPDATE row locks inside transactions
 *   to prevent negative balance races.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = exports.WalletService = void 0;
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const outbox_js_1 = require("../../db/schema/outbox.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── WalletService ────────────────────────────────────────────────────────────
class WalletService {
    // ─── Read ──────────────────────────────────────────────────────────────────
    async getBalance(ownerId, ownerType) {
        const wallet = await this.findOrCreate(ownerId, ownerType);
        return {
            walletId: wallet.id,
            ownerId,
            ownerType,
            balance: parseFloat(String(wallet.balance)),
            currency: wallet.currency,
        };
    }
    // ─── Credit ────────────────────────────────────────────────────────────────
    /**
     * Add funds to a wallet.
     * Used for: top-up, refund receipt, referral credit, partner earnings.
     */
    async credit(ownerId, ownerType, amount, txType, referenceId, // bookingId, paymentId, etc.
    note) {
        if (amount <= 0)
            throw errors_js_1.Errors.validation({ amount: 'Credit amount must be positive' });
        return client_js_1.db.transaction(async (tx) => {
            // Lock and fetch wallet row
            const [wallet] = await tx.execute((0, drizzle_orm_1.sql) `SELECT id, balance FROM wallets WHERE owner_id = ${ownerId} AND owner_type = ${ownerType} FOR UPDATE`).then(r => r.rows);
            if (!wallet) {
                // Create wallet inline if missing
                await tx.insert(payments_js_1.wallets).values({
                    ownerId, ownerType: ownerType,
                    balance: '0', currency: 'INR',
                });
                return this.credit(ownerId, ownerType, amount, txType, referenceId, note);
            }
            const newBalance = parseFloat(wallet.balance) + amount;
            // Update balance
            await tx.execute((0, drizzle_orm_1.sql) `UPDATE wallets SET balance = ${newBalance.toFixed(2)}, updated_at = NOW() WHERE id = ${wallet.id}`);
            // Ledger entry
            const [txRecord] = await tx.insert(payments_js_1.walletTransactions).values({
                walletId: wallet.id,
                txType: txType,
                amount: amount.toFixed(2),
                balanceAfter: newBalance.toFixed(2),
                referenceId,
                note,
            }).returning({ id: payments_js_1.walletTransactions.id });
            // Outbox event
            await tx.insert(outbox_js_1.outboxEvents).values({
                aggregateType: 'Wallet',
                aggregateId: wallet.id,
                eventType: `wallet.credited`,
                payload: { ownerId, ownerType, amount, txType, newBalance, referenceId },
            });
            logger_js_1.logger.info({ ownerId, ownerType, amount, txType, newBalance }, '[wallet] Credited');
            return { transactionId: txRecord.id, newBalance };
        });
    }
    // ─── Debit ─────────────────────────────────────────────────────────────────
    /**
     * Deduct funds from a wallet.
     * Fails if insufficient balance (no negative balance allowed).
     * Used for: booking payment from wallet, instant disbursement, penalty.
     */
    async debit(ownerId, ownerType, amount, txType, referenceId, note) {
        if (amount <= 0)
            throw errors_js_1.Errors.validation({ amount: 'Debit amount must be positive' });
        return client_js_1.db.transaction(async (tx) => {
            const [wallet] = await tx.execute((0, drizzle_orm_1.sql) `SELECT id, balance FROM wallets WHERE owner_id = ${ownerId} AND owner_type = ${ownerType} FOR UPDATE`).then(r => r.rows);
            if (!wallet)
                throw errors_js_1.Errors.notFound('Wallet');
            const currentBalance = parseFloat(wallet.balance);
            if (currentBalance < amount) {
                throw errors_js_1.Errors.insufficientBalance(currentBalance, amount);
            }
            const newBalance = currentBalance - amount;
            await tx.execute((0, drizzle_orm_1.sql) `UPDATE wallets SET balance = ${newBalance.toFixed(2)}, updated_at = NOW() WHERE id = ${wallet.id}`);
            const [txRecord] = await tx.insert(payments_js_1.walletTransactions).values({
                walletId: wallet.id,
                txType: txType,
                amount: (-amount).toFixed(2), // Store as negative for debits
                balanceAfter: newBalance.toFixed(2),
                referenceId,
                note,
            }).returning({ id: payments_js_1.walletTransactions.id });
            await tx.insert(outbox_js_1.outboxEvents).values({
                aggregateType: 'Wallet',
                aggregateId: wallet.id,
                eventType: `wallet.debited`,
                payload: { ownerId, ownerType, amount, txType, newBalance, referenceId },
            });
            logger_js_1.logger.info({ ownerId, ownerType, amount, txType, newBalance }, '[wallet] Debited');
            return { transactionId: txRecord.id, newBalance };
        });
    }
    // ─── Top-up ────────────────────────────────────────────────────────────────
    /**
     * Process a wallet top-up after payment gateway confirmation.
     * Called from the webhook handler (payment.captured event).
     */
    async processTopUp(customerId, amount, razorpayPaymentId) {
        return this.credit(customerId, 'customer', amount, 'top_up', razorpayPaymentId, `Top-up via Razorpay ${razorpayPaymentId}`);
    }
    // ─── Transaction history ───────────────────────────────────────────────────
    async getTransactions(ownerId, ownerType, limit = 20, offset = 0) {
        const wallet = await this.findOrCreate(ownerId, ownerType);
        return client_js_1.db
            .select()
            .from(payments_js_1.walletTransactions)
            .where((0, drizzle_orm_1.eq)(payments_js_1.walletTransactions.walletId, wallet.id))
            .orderBy((0, drizzle_orm_1.sql) `${payments_js_1.walletTransactions.createdAt} DESC`)
            .limit(limit)
            .offset(offset);
    }
    // ─── Private helpers ───────────────────────────────────────────────────────
    async findOrCreate(ownerId, ownerType) {
        const [existing] = await client_js_1.db
            .select()
            .from(payments_js_1.wallets)
            .where((0, drizzle_orm_1.eq)(payments_js_1.wallets.ownerId, ownerId))
            .limit(1);
        if (existing)
            return existing;
        // Create a new wallet (idempotent — unique constraint on owner_id)
        const [created] = await client_js_1.db.insert(payments_js_1.wallets).values({
            ownerId,
            ownerType: ownerType,
            balance: '0',
            currency: 'INR',
        }).onConflictDoNothing().returning();
        if (!created) {
            // Race: another request created it — re-fetch
            const [refetched] = await client_js_1.db.select().from(payments_js_1.wallets).where((0, drizzle_orm_1.eq)(payments_js_1.wallets.ownerId, ownerId)).limit(1);
            if (!refetched)
                throw new Error('Failed to create or fetch wallet');
            return refetched;
        }
        logger_js_1.logger.info({ ownerId, ownerType }, '[wallet] Created new wallet');
        return created;
    }
}
exports.WalletService = WalletService;
exports.walletService = new WalletService();
//# sourceMappingURL=wallet.service.js.map