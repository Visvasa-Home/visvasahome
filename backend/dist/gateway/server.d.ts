/**
 * Fastify Server — Layer 2: API Gateway
 *
 * Registers:
 *   - Plugins: CORS, Helmet, Rate Limit, Auth
 *   - Routers: auth, catalog, customer, partner, contractor, admin, webhooks
 *   - Global error handler (uniform envelope)
 *
 * All routes versioned under /api/v1/*
 */
import { type FastifyInstance } from 'fastify';
export declare function buildServer(): Promise<FastifyInstance>;
//# sourceMappingURL=server.d.ts.map