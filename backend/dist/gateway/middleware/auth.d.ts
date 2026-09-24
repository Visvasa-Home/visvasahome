/**
 * Auth Middleware — Layer 2: API Gateway
 *
 * Verifies JWT Bearer token and injects user context into request.
 * Downstream route handlers read from request.user.
 */
import type { FastifyPluginCallback } from 'fastify';
import { type TokenPayload } from '../../lib/jwt.js';
declare module 'fastify' {
    interface FastifyRequest {
        user?: TokenPayload;
    }
}
declare const _default: FastifyPluginCallback;
export default _default;
//# sourceMappingURL=auth.d.ts.map