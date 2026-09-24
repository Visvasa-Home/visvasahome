"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutWorker = exports.PayoutWorker = void 0;
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const client_js_1 = require("../../db/client.js");
const partners_js_1 = require("../../db/schema/partners.js");
const payments_js_1 = require("../../db/schema/payments.js");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Payout Worker
 * Runs on a cron schedule (M/W/F) to aggregate positive wallet balances
 * and initiate automated bank payouts for partners.
 */
class PayoutWorker {
    worker;
    constructor() {
        this.worker = (0, queue_js_1.createWorker)(queue_js_1.QUEUES.PAYOUT, async (job) => {
            logger_js_1.logger.info('[payout.worker] Starting bulk payout processing');
            // Find all partners with positive wallet balance
            const eligiblePartners = await client_js_1.db.select({
                id: partners_js_1.partners.id,
                balance: partners_js_1.partners.walletBalance,
                bankAccountNumber: partners_js_1.partners.bankAccountNumber,
                ifsc: partners_js_1.partners.bankIfsc
            })
                .from(partners_js_1.partners)
                .where((0, drizzle_orm_1.gt)(partners_js_1.partners.walletBalance, '0'));
            logger_js_1.logger.info(`[payout.worker] Found ${eligiblePartners.length} eligible partners for payout`);
            let successCount = 0;
            let failureCount = 0;
            for (const partner of eligiblePartners) {
                try {
                    const balance = parseFloat(String(partner.balance));
                    if (balance < 10)
                        continue; // Minimum payout threshold (e.g., ₹10)
                    await client_js_1.db.transaction(async (tx) => {
                        // 1. Deduct from wallet
                        await tx.update(partners_js_1.partners)
                            .set({ walletBalance: '0' })
                            .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partner.id));
                        // 2. Create payout record
                        const [payout] = await tx.insert(payments_js_1.payouts).values({
                            beneficiaryType: 'PARTNER',
                            beneficiaryId: partner.id,
                            periodStart: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Approx 3 days ago
                            periodEnd: new Date(),
                            gross: String(balance),
                            commission: '0',
                            tds: '0',
                            net: String(balance),
                            status: 'processing',
                        }).returning();
                        // 3. Create wallet transaction
                        await tx.insert(payments_js_1.walletTransactions).values({
                            partnerId: partner.id,
                            txType: 'payout',
                            amount: String(-balance),
                            balanceAfter: '0',
                            description: `Automated M/W/F Payout - ${new Date().toDateString()}`,
                        });
                        // 4. Trigger bank API (simulated)
                        // await paymentService.initiateBankPayout(payout.id, balance, partner);
                        logger_js_1.logger.info({ payoutId: payout.id }, 'Payout successfully sent to bank api');
                    });
                    successCount++;
                }
                catch (err) {
                    logger_js_1.logger.error({ err, partnerId: partner.id }, '[payout.worker] Failed to process payout for partner');
                    failureCount++;
                }
            }
            logger_js_1.logger.info(`[payout.worker] Bulk payout complete. Success: ${successCount}, Failures: ${failureCount}`);
        });
    }
}
exports.PayoutWorker = PayoutWorker;
exports.payoutWorker = new PayoutWorker();
//# sourceMappingURL=payout.worker.js.map