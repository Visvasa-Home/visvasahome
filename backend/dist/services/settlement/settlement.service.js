"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlementService = exports.SettlementService = void 0;
/**
 * SettlementService
 * Triggers weekly payouts for partners and contractors.
 */
const client_js_1 = require("../../db/client.js");
const partners_js_1 = require("../../db/schema/partners.js");
const payments_js_1 = require("../../db/schema/payments.js");
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
const node_crypto_1 = __importDefault(require("node:crypto"));
class SettlementService {
    async runWeeklySettlements() {
        logger_js_1.logger.info('[settlement] Starting weekly settlement run');
        // 1. Find all partners with a positive wallet balance
        const eligiblePartners = await client_js_1.db.select()
            .from(partners_js_1.partners)
            .where((0, drizzle_orm_1.gt)(partners_js_1.partners.walletBalance, '0'));
        for (const partner of eligiblePartners) {
            const amount = parseFloat(String(partner.walletBalance));
            await client_js_1.db.transaction(async (tx) => {
                // Zero out balance
                await tx.update(partners_js_1.partners)
                    .set({ walletBalance: '0' })
                    .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partner.id));
                const settlementId = node_crypto_1.default.randomUUID();
                // Create settlement record
                await tx.insert(payments_js_1.settlements).values({
                    id: settlementId,
                    partnerId: partner.id,
                    amount: String(amount),
                    status: 'pending',
                });
                // Debit wallet transactions
                await tx.insert(payments_js_1.walletTransactions).values({
                    partnerId: partner.id,
                    settlementId,
                    amount: String(-amount),
                    balanceAfter: '0',
                    txType: 'payout',
                    description: 'Weekly Settlement Payout',
                });
                // Add to Queue
                await queue_js_1.settlementQueue.add(`payout:${settlementId}`, {
                    settlementId,
                    partnerId: partner.id,
                    amount,
                    method: partner.bankAccountNumber ? 'bank_transfer' : 'upi',
                    bankAccount: partner.bankAccountNumber ?? undefined,
                    bankIfsc: partner.bankIfsc ?? undefined,
                });
            });
        }
        logger_js_1.logger.info('[settlement] Completed weekly settlement run');
    }
}
exports.SettlementService = SettlementService;
exports.settlementService = new SettlementService();
//# sourceMappingURL=settlement.service.js.map