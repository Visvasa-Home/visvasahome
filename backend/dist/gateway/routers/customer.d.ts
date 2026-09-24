/**
 * Customer Router — /api/v1/customer/*
 * Layer 2: API Gateway
 *
 * All routes require: authenticate + requireRole('customer')
 *
 * Bookings:
 *   POST   /api/v1/customer/bookings                    Create instant/scheduled booking
 *   GET    /api/v1/customer/bookings                    List my bookings
 *   GET    /api/v1/customer/bookings/:id                Get booking detail
 *   POST   /api/v1/customer/bookings/:id/cancel         Cancel booking
 *   POST   /api/v1/customer/bookings/:id/rate           Submit review after completion
 *   GET    /api/v1/customer/bookings/:id/quote          Get price quote before creating
 *
 * AMC:
 *   GET    /api/v1/customer/amc/plans                   List available plans
 *   POST   /api/v1/customer/amc/subscribe               Subscribe to plan
 *   GET    /api/v1/customer/amc/subscriptions           My subscriptions
 *   POST   /api/v1/customer/amc/visit                   Use a visit
 *
 * Payments:
 *   POST   /api/v1/customer/payments/order/:bookingId   Create Razorpay order
 *
 * Profile:
 *   GET    /api/v1/customer/addresses                   List addresses
 *   POST   /api/v1/customer/addresses                   Add address
 *   DELETE /api/v1/customer/addresses/:id               Delete address
 */
import type { FastifyInstance } from 'fastify';
export declare function customerRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=customer.d.ts.map