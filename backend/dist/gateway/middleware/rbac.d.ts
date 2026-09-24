/**
 * RBAC Middleware — Layer 2: API Gateway
 *
 * Provides role-based access control guards.
 * Usage in routers:
 *   router.get('/admin/...', { preHandler: [authenticate, requireRole('admin')] }, handler)
 */
import type { FastifyRequest, FastifyReply } from 'fastify';
export type Role = 'customer' | 'partner' | 'contractor' | 'admin';
export type AdminRole = 'super_admin' | 'operations_admin' | 'partner_admin' | 'customer_support' | 'finance_admin' | 'service_admin' | 'analytics_admin';
export declare function requireRole(...roles: Role[]): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare function requireAdminRole(...adminRoles: AdminRole[]): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare function requireOwnership(getResourceUserId: (request: FastifyRequest) => string | undefined): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//# sourceMappingURL=rbac.d.ts.map