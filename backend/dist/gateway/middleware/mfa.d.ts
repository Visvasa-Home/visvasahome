import type { FastifyRequest, FastifyReply } from 'fastify';
/**
 * MFA Middleware for Admin Panel Elevated Actions
 * Enforces Multi-Factor Authentication (e.g. TOTP) for sensitive admin endpoints.
 */
export declare function requireMfa(request: FastifyRequest, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=mfa.d.ts.map