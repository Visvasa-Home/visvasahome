"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amcWorker = exports.AmcWorker = void 0;
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const client_js_1 = require("../../db/client.js");
const payments_js_1 = require("../../db/schema/payments.js");
const drizzle_orm_1 = require("drizzle-orm");
const amc_service_js_1 = require("./amc.service.js");
class AmcWorker {
    worker;
    constructor() {
        this.worker = (0, queue_js_1.createWorker)(queue_js_1.QUEUES.AMC_RENEWAL, async (job) => {
            logger_js_1.logger.info('[amc_worker] Running monthly visit scheduler');
            // Find all active subscriptions with remaining visits
            const activeSubs = await client_js_1.db.select()
                .from(payments_js_1.amcSubscriptions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payments_js_1.amcSubscriptions.status, 'active'), (0, drizzle_orm_1.gt)(payments_js_1.amcSubscriptions.visitsRemaining, 0)));
            logger_js_1.logger.info({ count: activeSubs.length }, '[amc_worker] Found active subscriptions');
            for (const sub of activeSubs) {
                try {
                    // If the subscription is active, we just auto-generate a visit.
                    // In a real system, you'd check the interval based on start/end dates.
                    await amc_service_js_1.amcService.useVisit(sub.customerId, sub.id);
                    logger_js_1.logger.info({ subId: sub.id }, '[amc_worker] Auto-generated AMC visit');
                }
                catch (err) {
                    logger_js_1.logger.error({ err, subId: sub.id }, '[amc_worker] Failed to generate AMC visit');
                }
            }
            logger_js_1.logger.info('[amc_worker] Monthly visit scheduler complete');
        });
        this.worker.on('failed', (job, err) => {
            logger_js_1.logger.error({ err, jobId: job?.id }, '[amc_worker] Job failed');
        });
    }
}
exports.AmcWorker = AmcWorker;
exports.amcWorker = new AmcWorker();
//# sourceMappingURL=amc.worker.js.map