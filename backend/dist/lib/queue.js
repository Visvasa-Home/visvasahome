"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutQueue = exports.eventBusQueue = exports.amcRenewalQueue = exports.settlementQueue = exports.notificationQueue = exports.dispatchQueue = exports.QUEUES = void 0;
exports.createQueue = createQueue;
exports.createWorker = createWorker;
/**
 * BullMQ Queue Definitions — Shared Lib
 * All queue names and job types centralized here.
 */
const bullmq_1 = require("bullmq");
const redis_js_1 = require("./redis.js");
// ─── Queue Names ──────────────────────────────────────────────────────────────
exports.QUEUES = {
    DISPATCH: 'dispatch',
    OFFER_TIMEOUT: 'offer-timeout',
    NOTIFICATION: 'notification',
    SETTLEMENT: 'settlement',
    AMC_RENEWAL: 'amc-renewal',
    EVENT_BUS: 'event-bus',
    PAYOUT: 'payout',
};
// ─── Shared connection options ────────────────────────────────────────────────
const connection = redis_js_1.redis;
// ─── Queue factory ────────────────────────────────────────────────────────────
function createQueue(name) {
    return new bullmq_1.Queue(name, {
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2_000 },
            removeOnComplete: { count: 1000 },
            removeOnFail: { count: 5000 },
        },
    });
}
// ─── Worker factory ───────────────────────────────────────────────────────────
function createWorker(name, processor, concurrency = 5) {
    return new bullmq_1.Worker(name, processor, {
        connection,
        concurrency,
    });
}
// ─── Queue singletons ─────────────────────────────────────────────────────────
exports.dispatchQueue = createQueue(exports.QUEUES.DISPATCH);
exports.notificationQueue = createQueue(exports.QUEUES.NOTIFICATION);
exports.settlementQueue = createQueue(exports.QUEUES.SETTLEMENT);
exports.amcRenewalQueue = createQueue(exports.QUEUES.AMC_RENEWAL);
exports.eventBusQueue = createQueue(exports.QUEUES.EVENT_BUS);
exports.payoutQueue = createQueue(exports.QUEUES.PAYOUT);
//# sourceMappingURL=queue.js.map