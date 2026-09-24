"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractorRouter = contractorRouter;
const zod_1 = require("zod");
const client_js_1 = require("../../db/client.js");
const contractor_js_1 = require("../../db/schema/contractor.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const contractor_service_js_1 = require("../../services/contractor/contractor.service.js");
const rbac_js_1 = require("../middleware/rbac.js");
const validate_js_1 = require("../middleware/validate.js");
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Schemas ──────────────────────────────────────────────────────────────────
const onboardSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2).max(255),
    gstNumber: zod_1.z.string().optional(),
    specializations: zod_1.z.array(zod_1.z.string()).min(1),
    city: zod_1.z.string().min(2),
    state: zod_1.z.string().min(2),
    minProjectValue: zod_1.z.number().positive().optional(),
});
const leadSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(255),
    description: zod_1.z.string().min(10),
    category: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    addressId: zod_1.z.string().uuid().optional(),
    estimatedBudget: zod_1.z.number().positive().optional(),
    preferredStartDate: zod_1.z.string().optional(),
    photos: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
const bidSchema = zod_1.z.object({
    quoteAmount: zod_1.z.number().positive(),
    timelineDays: zod_1.z.number().int().positive().optional(),
    description: zod_1.z.string().max(2000).optional(),
    attachments: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
const milestoneSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(255),
    description: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive(),
    dueDate: zod_1.z.string().optional(),
});
// ─── Router ───────────────────────────────────────────────────────────────────
async function contractorRouter(fastify) {
    const { authenticate } = fastify;
    // Contractor-specific guard
    const contractorGuard = [authenticate, (0, rbac_js_1.requireRole)('contractor')];
    // Customer OR admin can create leads
    const customerOrAdmin = [authenticate, (0, rbac_js_1.requireRole)('customer', 'admin')];
    // POST /api/v1/contractor/onboard
    fastify.post('/onboard', { preHandler: [authenticate] }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(onboardSchema, req);
        const id = await contractor_service_js_1.contractorService.onboard(req.user.sub, input);
        return (0, response_js_1.sendCreated)(reply, { id, message: 'Company profile created' });
    });
    // GET /api/v1/contractor/profile
    fastify.get('/profile', { preHandler: contractorGuard }, async (req, reply) => {
        const [profile] = await client_js_1.db.select().from(contractor_js_1.contractorProfiles)
            .where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, req.user.sub)).limit(1);
        if (!profile)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('Contractor profile'));
        return (0, response_js_1.sendOk)(reply, profile);
    });
    // POST /api/v1/contractor/technicians
    fastify.post('/technicians', { preHandler: contractorGuard }, async (req, reply) => {
        const { userId } = (0, validate_js_1.parseBody)(zod_1.z.object({ userId: zod_1.z.string().uuid() }), req);
        await contractor_service_js_1.contractorService.addTechnician(req.user.sub, userId);
        return (0, response_js_1.sendOk)(reply, { message: 'Technician added' });
    });
    // POST /api/v1/contractor/bookings/:id/assign
    fastify.post('/bookings/:id/assign', { preHandler: contractorGuard }, async (req, reply) => {
        const { id } = req.params;
        const { technicianUserId } = (0, validate_js_1.parseBody)(zod_1.z.object({ technicianUserId: zod_1.z.string().uuid() }), req);
        await contractor_service_js_1.contractorService.assignTechnicianToBooking(req.user.sub, id, technicianUserId);
        return (0, response_js_1.sendOk)(reply, { message: 'Technician assigned to booking' });
    });
    // GET /api/v1/contractor/leads  (contractors see open leads in their city)
    fastify.get('/leads', { preHandler: [authenticate] }, async (req, reply) => {
        const { city, category } = (0, validate_js_1.parseQuery)(zod_1.z.object({
            city: zod_1.z.string().optional(),
            category: zod_1.z.string().optional(),
        }), req);
        const leads = await contractor_service_js_1.contractorService.getOpenLeads(city, category);
        return (0, response_js_1.sendOk)(reply, leads);
    });
    // POST /api/v1/contractor/leads  (customers post a lead)
    fastify.post('/leads', { preHandler: customerOrAdmin }, async (req, reply) => {
        const input = (0, validate_js_1.parseBody)(leadSchema, req);
        const leadId = await contractor_service_js_1.contractorService.createLead(req.user.sub, input);
        return (0, response_js_1.sendCreated)(reply, { leadId });
    });
    // POST /api/v1/contractor/leads/:id/bid  (contractor submits quotation)
    fastify.post('/leads/:id/bid', { preHandler: contractorGuard }, async (req, reply) => {
        const { id } = req.params;
        const input = (0, validate_js_1.parseBody)(bidSchema, req);
        const quotationId = await contractor_service_js_1.contractorService.submitQuotation(req.user.sub, id, input);
        return (0, response_js_1.sendCreated)(reply, { quotationId });
    });
    // POST /api/v1/contractor/quotations/:id/accept  (customer accepts a bid)
    fastify.post('/quotations/:id/accept', {
        preHandler: [authenticate, (0, rbac_js_1.requireRole)('customer')],
    }, async (req, reply) => {
        const { id } = req.params;
        const contractId = await contractor_service_js_1.contractorService.acceptQuotation(req.user.sub, id);
        return (0, response_js_1.sendCreated)(reply, { contractId, message: 'Quotation accepted, contract created' });
    });
    // GET /api/v1/contractor/contracts
    fastify.get('/contracts', { preHandler: contractorGuard }, async (req, reply) => {
        const list = await client_js_1.db.select().from(contractor_js_1.contracts)
            .where((0, drizzle_orm_1.eq)(contractor_js_1.contracts.contractorId, req.user.sub))
            .orderBy((0, drizzle_orm_1.desc)(contractor_js_1.contracts.createdAt))
            .limit(50);
        return (0, response_js_1.sendOk)(reply, list);
    });
    // GET /api/v1/contractor/contracts/:id
    fastify.get('/contracts/:id', { preHandler: [authenticate] }, async (req, reply) => {
        const { id } = req.params;
        const result = await contractor_service_js_1.contractorService.getContractById(id);
        return (0, response_js_1.sendOk)(reply, result);
    });
    // POST /api/v1/contractor/contracts/:id/milestones
    fastify.post('/contracts/:id/milestones', { preHandler: contractorGuard }, async (req, reply) => {
        const { id } = req.params;
        const input = (0, validate_js_1.parseBody)(milestoneSchema, req);
        const milestoneId = await contractor_service_js_1.contractorService.addMilestone(req.user.sub, id, input);
        return (0, response_js_1.sendCreated)(reply, { milestoneId });
    });
    // POST /api/v1/contractor/bookings/:id/assign (Contractor assigns a partner)
    fastify.post('/bookings/:id/assign', { preHandler: contractorGuard }, async (req, reply) => {
        const { id } = req.params;
        const { partnerId } = (0, validate_js_1.parseBody)(zod_1.z.object({ partnerId: zod_1.z.string().uuid() }), req);
        // Validate that the booking is assigned to this contractor, and the partner is in their team
        await client_js_1.db.update(bookings_js_1.bookings)
            .set({ partnerId: partnerId, status: 'assigned' })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, id), (0, drizzle_orm_1.eq)(bookings_js_1.bookings.assignedContractorId, req.user.sub)));
        return (0, response_js_1.sendOk)(reply, { message: 'Partner assigned to booking' });
    });
    // POST /api/v1/contractor/milestones/:id/complete
    fastify.post('/milestones/:id/complete', { preHandler: contractorGuard }, async (req, reply) => {
        const { id } = req.params;
        await contractor_service_js_1.contractorService.completeMilestone(id, req.user.sub);
        return (0, response_js_1.sendOk)(reply, { message: 'Milestone completed' });
    });
}
//# sourceMappingURL=contractor.js.map