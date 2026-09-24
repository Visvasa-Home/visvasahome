/**
 * Catalog Router — /api/v1/catalog/*
 * Layer 2: API Gateway (public routes — no auth needed)
 *
 * GET /api/v1/catalog/categories
 * GET /api/v1/catalog/categories/:slug/services
 * GET /api/v1/catalog/services/:id
 * GET /api/v1/catalog/amc-plans
 * GET /api/v1/catalog/service-areas
 */
import type { FastifyInstance } from 'fastify';
export declare function catalogRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=catalog.d.ts.map