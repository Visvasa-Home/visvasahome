/**
 * Partner Router — /api/v1/partner/*
 * Layer 2: API Gateway
 *
 * POST /api/v1/partner/register          Onboard profile
 * GET  /api/v1/partner/profile           Get own profile
 * PUT  /api/v1/partner/profile           Update profile
 * POST /api/v1/partner/location          Update GPS location (Redis primary)
 * POST /api/v1/partner/status            Toggle online/offline + availability
 * GET  /api/v1/partner/offers            List pending offers
 * POST /api/v1/partner/offers/:id/accept Accept a dispatch offer (atomic)
 * POST /api/v1/partner/offers/:id/reject Reject a dispatch offer
 * GET  /api/v1/partner/bookings          My assigned bookings
 * POST /api/v1/partner/bookings/:id/en-route     Mark en_route
 * GET  /api/v1/partner/bookings/:id/otp          Get arrival OTP
 * POST /api/v1/partner/bookings/:id/complete     Mark completed
 * GET  /api/v1/partner/wallet            Wallet balance + transactions
 * POST /api/v1/partner/settlement/request Request payout
 */
import type { FastifyInstance } from 'fastify';
export declare function partnerRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=partner.d.ts.map