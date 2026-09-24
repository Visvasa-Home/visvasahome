"use strict";
/**
 * Monitoring Router — Admin Dashboard SSE + Surge Override
 *
 * Endpoints:
 *
 *   GET  /api/v1/admin/monitoring/stream
 *     Server-Sent Events stream — emits DashboardSnapshot every 5 seconds.
 *     Admin frontend connects once and receives live updates.
 *
 *   GET  /api/v1/admin/monitoring/snapshot
 *     One-shot HTTP snapshot for initial page load or non-SSE clients.
 *
 *   POST /api/v1/admin/monitoring/surge/:zoneId
 *     Set or remove a surge multiplier override for a zone.
 *     Body: { multiplier: number | null }
 *
 *   GET  /api/v1/admin/monitoring/surge/:zoneId
 *     Get current surge status for a zone.
 *
 *   POST /api/v1/admin/monitoring/matching-objective
 *     Update the active matching objective at runtime.
 *     Body: { objective: 'minimize_distance' | 'maximize_coverage' | 'balance_workload' }
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringRouter = monitoringRouter;
const monitoring_service_js_1 = require("../../services/analytics/monitoring.service.js");
const surge_service_js_1 = require("../../services/pricing/surge.service.js");
const redis_js_1 = require("../../lib/redis.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const rbac_js_1 = require("../middleware/rbac.js");
const zod_1 = require("zod");
const SSE_INTERVAL_MS = parseInt(process.env.MONITORING_SSE_INTERVAL_MS ?? '5000', 10);
// ─── Active SSE connections management ────────────────────────────────────────
const activeStreams = new Set();
async function monitoringRouter(fastify) {
    const { authenticate } = fastify;
    const adminGuard = [authenticate, (0, rbac_js_1.requireRole)('admin')];
    // ─── SSE Stream ─────────────────────────────────────────────────────────────
    fastify.get('/stream', {
        preHandler: adminGuard,
    }, async (req, reply) => {
        // Set SSE headers
        reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable Nginx buffering for SSE
        });
        activeStreams.add(reply);
        logger_js_1.logger.info({ adminId: req.user.sub }, '[monitoring] Admin connected to SSE stream');
        // Send initial snapshot immediately
        const initial = await monitoring_service_js_1.monitoringService.snapshot();
        reply.raw.write(`data: ${JSON.stringify(initial)}\n\n`);
        // Start heartbeat
        const interval = setInterval(async () => {
            try {
                const snapshot = await monitoring_service_js_1.monitoringService.snapshot();
                if (!reply.raw.destroyed) {
                    reply.raw.write(`data: ${JSON.stringify(snapshot)}\n\n`);
                }
                else {
                    clearInterval(interval);
                    activeStreams.delete(reply);
                }
            }
            catch (err) {
                logger_js_1.logger.error({ err }, '[monitoring] SSE snapshot error');
            }
        }, SSE_INTERVAL_MS);
        req.raw.on('close', () => {
            clearInterval(interval);
            activeStreams.delete(reply);
            logger_js_1.logger.info({ adminId: req.user.sub }, '[monitoring] Admin SSE disconnected');
        });
        // Keep connection open — SSE is a long-lived HTTP response
        await new Promise((resolve) => req.raw.on('close', resolve));
    });
    // ─── Snapshot (one-shot) ────────────────────────────────────────────────────
    fastify.get('/snapshot', {
        preHandler: adminGuard,
    }, async (req, reply) => {
        const snapshot = await monitoring_service_js_1.monitoringService.snapshot();
        return (0, response_js_1.sendOk)(reply, snapshot);
    });
    // ─── Surge Override ──────────────────────────────────────────────────────────
    const surgeOverrideSchema = zod_1.z.object({
        multiplier: zod_1.z.number().min(1.0).max(5.0).nullable(),
    });
    fastify.post('/surge/:zoneId', { preHandler: adminGuard }, async (req, reply) => {
        const parsed = surgeOverrideSchema.safeParse(req.body);
        if (!parsed.success)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation(parsed.error.flatten().fieldErrors));
        const { zoneId } = req.params;
        const { multiplier } = parsed.data;
        await surge_service_js_1.surgeService.setAdminOverride(zoneId, multiplier, req.user.sub);
        logger_js_1.logger.info({ zoneId, multiplier, adminId: req.user.sub }, '[monitoring] Surge override applied');
        return (0, response_js_1.sendOk)(reply, { zoneId, multiplier, message: multiplier === null ? 'Override removed' : 'Override applied' });
    });
    fastify.get('/surge/:zoneId', { preHandler: adminGuard }, async (req, reply) => {
        const status = await surge_service_js_1.surgeService.getZoneStatus(req.params.zoneId);
        return (0, response_js_1.sendOk)(reply, status);
    });
    // ─── Matching Objective Override ────────────────────────────────────────────
    const objectiveSchema = zod_1.z.object({
        objective: zod_1.z.enum(['minimize_distance', 'maximize_coverage', 'balance_workload']),
    });
    fastify.post('/matching-objective', {
        preHandler: adminGuard,
    }, async (req, reply) => {
        const parsed = objectiveSchema.safeParse(req.body);
        if (!parsed.success)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.validation(parsed.error.flatten().fieldErrors));
        const { objective } = parsed.data;
        // Store in Redis — the BatchDispatchWorker reads this before each batch
        await redis_js_1.redis.set('matching:objective', objective);
        logger_js_1.logger.info({ objective, adminId: req.user.sub }, '[monitoring] Matching objective updated');
        return (0, response_js_1.sendOk)(reply, { objective, message: `Matching objective set to ${objective}` });
    });
    fastify.get('/matching-objective', {
        preHandler: adminGuard,
    }, async (req, reply) => {
        const objective = await redis_js_1.redis.get('matching:objective') ?? 'minimize_distance';
        return (0, response_js_1.sendOk)(reply, { objective });
    });
}
//# sourceMappingURL=monitoring.js.map