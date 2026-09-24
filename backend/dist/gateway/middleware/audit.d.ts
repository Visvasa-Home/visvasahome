import type { FastifyRequest, FastifyReply } from 'fastify';
/**
 * Audit log hook
 * Intended to be used via onResponse or preHandler to log admin actions
 */
export declare function auditAdminAction(request: FastifyRequest, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=audit.d.ts.map