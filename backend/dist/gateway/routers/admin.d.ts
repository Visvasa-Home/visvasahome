/**
 * Admin Router — /api/v1/admin/*
 * Layer 2: API Gateway
 *
 * All routes require: authenticate + requireRole('admin')
 * Sub-routes further restricted by adminRole.
 *
 * Dashboard:
 *   GET /api/v1/admin/dashboard
 *
 * Bookings:
 *   GET  /api/v1/admin/bookings
 *   GET  /api/v1/admin/bookings/:id
 *   POST /api/v1/admin/bookings/:id/force-assign
 *   POST /api/v1/admin/bookings/:id/cancel
 *
 * Partners:
 *   GET  /api/v1/admin/partners
 *   POST /api/v1/admin/partners/:id/approve
 *   POST /api/v1/admin/partners/:id/suspend
 *
 * Finance:
 *   GET  /api/v1/admin/settlements
 *   POST /api/v1/admin/settlements/:id/process
 *   GET  /api/v1/admin/payments
 *   POST /api/v1/admin/payments/:id/refund
 *
 * Catalog:
 *   GET  /api/v1/admin/catalog/categories    (manage categories)
 *   POST /api/v1/admin/catalog/services      (add services)
 *   POST /api/v1/admin/catalog/amc-plans     (add AMC plans)
 *   POST /api/v1/admin/catalog/coupons       (add coupons)
 *   POST /api/v1/admin/catalog/service-areas (add service areas)
 */
import type { FastifyInstance } from 'fastify';
export declare function adminRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=admin.d.ts.map