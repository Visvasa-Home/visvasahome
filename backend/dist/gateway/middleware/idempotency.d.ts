import type { FastifyRequest, FastifyReply } from 'fastify';
/**
 * Idempotency Middleware
 * Intercepts requests that provide an Idempotency-Key header.
 * Uses Redis to ensure the exact same payload is not processed twice.
 */
export declare function withIdempotency(request: FastifyRequest, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=idempotency.d.ts.map