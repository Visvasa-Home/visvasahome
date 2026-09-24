/**
 * Contractor Router — /api/v1/contractor/*
 * Layer 2: API Gateway
 *
 * POST /api/v1/contractor/onboard              Onboard company profile
 * GET  /api/v1/contractor/profile              Get profile
 * POST /api/v1/contractor/technicians          Add technician to team
 * GET  /api/v1/contractor/leads                List open leads in city
 * POST /api/v1/contractor/leads                Create a lead (customer side)
 * GET  /api/v1/contractor/leads/:id            Lead detail
 * POST /api/v1/contractor/leads/:id/bid        Submit quotation
 * POST /api/v1/contractor/quotations/:id/accept  Accept quotation (customer)
 * GET  /api/v1/contractor/contracts            My contracts
 * GET  /api/v1/contractor/contracts/:id        Contract detail with milestones
 * POST /api/v1/contractor/contracts/:id/milestones  Add milestone
 * POST /api/v1/contractor/milestones/:id/complete  Mark milestone completed
 */
import type { FastifyInstance } from 'fastify';
export declare function contractorRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=contractor.d.ts.map