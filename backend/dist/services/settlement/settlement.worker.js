"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlementWorker = exports.SettlementWorker = void 0;
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const drizzle_orm_1 = require("drizzle-orm");
class SettlementWorker {
    worker;
    constructor() {
        this.worker = (0, queue_js_1.createWorker)(queue_js_1.QUEUES.SETTLEMENT, async (job) => {
            const { settlementId, partnerId, amount, method, bankAccount, bankIfsc, upiId } = job.data;
            logger_js_1.logger.info({ settlementId, partnerId, amount }, '[settlement] Processing payout');
            // In a real system, you'd call a payout API like RazorpayX or Cashfree Payouts here.
            // await razorpayX.payouts.create({ account_number, amount, ... });
            // Mark settlement as completed
            await client_js_1.db.transaction(async (tx) => {
                await tx.update(payments_js_1.settlements)
                    .set({ status: 'completed', processedAt: new Date(), utrNumber: 'MOCK_UTR_12345' })
                    .where((0, drizzle_orm_1.eq)(payments_js_1.settlements.id, settlementId));
            });
            logger_js_1.logger.info({ settlementId }, '[settlement] Payout successful');
        });
        this.worker.on('failed', (job, err) => {
            logger_js_1.logger.error({ err, jobId: job?.id }, '[settlement] Payout job failed');
        });
    }
}
exports.SettlementWorker = SettlementWorker;
exports.settlementWorker = new SettlementWorker();
//# sourceMappingURL=settlement.worker.js.map