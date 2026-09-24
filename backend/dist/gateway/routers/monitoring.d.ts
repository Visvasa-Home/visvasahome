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
import type { FastifyInstance } from 'fastify';
export declare function monitoringRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=monitoring.d.ts.map