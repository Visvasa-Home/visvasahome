/**
 * Zod Validation Middleware — Layer 2: API Gateway
 *
 * Usage:
 *   router.post('/path', { preHandler: validate(schema) }, handler)
 *
 * Or use validateBody/validateQuery in the handler directly.
 */
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, z } from 'zod';
export declare function validateBody<T>(schema: ZodSchema<T>): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare function validateQuery<T>(schema: ZodSchema<T>): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare function parseBody<T>(schema: ZodSchema<T>, request: FastifyRequest): T;
export declare function parseQuery<T>(schema: ZodSchema<T>, request: FastifyRequest): T;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    perPage: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    perPage: number;
}, {
    page?: number | undefined;
    perPage?: number | undefined;
}>;
export declare const uuidSchema: z.ZodString;
export declare const phoneSchema: z.ZodString;
//# sourceMappingURL=validate.d.ts.map