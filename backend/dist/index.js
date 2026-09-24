"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * VisvasaHome TypeScript Backend — Entry Point
 * Layer 2: API Gateway
 */
require("./lib/tracing.js"); // Must be first!
const env_js_1 = require("./env.js");
const server_js_1 = require("./gateway/server.js");
const redis_js_1 = require("./lib/redis.js");
const logger_js_1 = require("./lib/logger.js");
const outbox_worker_js_1 = require("./services/outbox/outbox.worker.js");
require("./services/eventbus/eventbus.service.js"); // Ensure it registers the worker
require("./services/amc/amc.worker.js");
require("./services/notification/notification.worker.js");
require("./services/settlement/settlement.worker.js");
require("./services/payment/payout.worker.js");
const scheduler_worker_js_1 = require("./services/dispatch/scheduler.worker.js");
const sla_worker_js_1 = require("./services/dispatch/sla.worker.js");
const batch_dispatch_worker_js_1 = require("./services/dispatch/batch-dispatch.worker.js");
const PORT = parseInt(env_js_1.env.TS_PORT, 10);
const HOST = env_js_1.env.HOST;
let appInstance = null;
async function main() {
    // Connect Redis
    await redis_js_1.redis.connect().catch((err) => logger_js_1.logger.warn({ err }, '[startup] Redis not yet available — will retry on demand'));
    // Build and start Fastify
    const app = await (0, server_js_1.buildServer)();
    appInstance = app;
    try {
        const address = await app.listen({ port: PORT, host: HOST });
        logger_js_1.logger.info(`[startup] VisvasaHome TS Gateway listening at ${address}`);
        logger_js_1.logger.info(`[startup] API Docs: http://localhost:${PORT}/docs`);
        logger_js_1.logger.info('[startup] Routes:');
        logger_js_1.logger.info('  POST /api/v1/auth/send-otp');
        logger_js_1.logger.info('  POST /api/v1/auth/verify-otp');
        logger_js_1.logger.info('  GET  /api/v1/catalog/categories');
        logger_js_1.logger.info('  POST /api/v1/customer/bookings');
        logger_js_1.logger.info('  POST /api/v1/partner/location');
        logger_js_1.logger.info('  POST /api/v1/contractor/leads');
        logger_js_1.logger.info('  GET  /api/v1/admin/dashboard');
        logger_js_1.logger.info('  POST /api/v1/webhooks/razorpay');
        logger_js_1.logger.info('  GET  /health');
    }
    catch (err) {
        logger_js_1.logger.error({ err }, '[startup] Failed to start server');
        process.exit(1);
    }
    // Start the outbox worker for event-driven architecture
    outbox_worker_js_1.outboxWorker.start();
    // ─── Matching & Scheduling Workers ────────────────────────────────────────────
    // 1. Scheduler: polls DB every minute for scheduled bookings nearing their time
    scheduler_worker_js_1.schedulerWorker.start();
    // 2. SLA enforcer: retries stuck 'searching' bookings with expanded radius
    sla_worker_js_1.slaWorker.start();
    // 3. Batch dispatcher: runs Hungarian assignment every BATCH_WINDOW_MS for instant bookings
    batch_dispatch_worker_js_1.batchDispatchWorker.start();
    // Schedule automated M/W/F payouts at 18:00 (6 PM)
    const { payoutQueue } = await import('./lib/queue.js');
    await payoutQueue.add('mwf-payout', {}, {
        repeat: { pattern: '0 18 * * 1,3,5' },
        jobId: 'system-mwf-payout',
    }).catch(err => logger_js_1.logger.error({ err }, 'Failed to schedule payout job'));
    // Initialize Catalog Bloom Filter for cache penetration protection
    const { catalogService } = await import('./services/catalog/catalog.service.js');
    await catalogService.initBloomFilter().catch(err => logger_js_1.logger.error({ err }, 'Failed to init bloom filter'));
}
// ─── Graceful shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
    logger_js_1.logger.info(`[shutdown] ${signal} received — shutting down gracefully`);
    outbox_worker_js_1.outboxWorker.stop();
    scheduler_worker_js_1.schedulerWorker.stop();
    sla_worker_js_1.slaWorker.stop();
    batch_dispatch_worker_js_1.batchDispatchWorker.stop();
    if (appInstance)
        await appInstance.close();
    await redis_js_1.redis.disconnect();
    process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
// ─── Entry ────────────────────────────────────────────────────────────────────
void main();
//# sourceMappingURL=index.js.map