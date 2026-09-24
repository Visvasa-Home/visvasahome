/**
 * Webhooks Router — /api/v1/webhooks/*
 * Layer 2: API Gateway
 *
 * POST /api/v1/webhooks/razorpay  — Razorpay payment event webhook
 *
 * IMPORTANT: These routes skip JWT auth but verify Razorpay HMAC signature.
 */
import type { FastifyInstance } from 'fastify';
export declare function webhooksRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=webhooks.d.ts.map