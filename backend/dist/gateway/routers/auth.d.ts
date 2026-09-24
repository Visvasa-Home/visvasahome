/**
 * Auth Router — /api/v1/auth/*
 * Layer 2: API Gateway
 *
 * Public routes (no auth required):
 *   POST /api/v1/auth/send-otp
 *   POST /api/v1/auth/verify-otp
 *   POST /api/v1/auth/refresh
 *
 * Protected routes:
 *   POST /api/v1/auth/logout
 *   GET  /api/v1/auth/me
 */
import type { FastifyInstance } from 'fastify';
export declare function authRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=auth.d.ts.map