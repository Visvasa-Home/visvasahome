"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractorService = exports.ContractorService = void 0;
/**
 * ContractorService — Layer 3: Domain Services
 *
 * Contractor model:
 *   1. Company onboards → adds technicians (auto-approved under umbrella)
 *   2. Views open leads in their city
 *   3. Submits quotations on leads
 *   4. Customer accepts quotation → contract created, other bids auto-rejected
 *   5. Milestones tracked → payment per milestone
 *   6. Platform bills contractor commission; contractor pays its team internally
 */
const client_js_1 = require("../../db/client.js");
const contractor_js_1 = require("../../db/schema/contractor.js");
const users_js_1 = require("../../db/schema/users.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── ContractorService ────────────────────────────────────────────────────────
class ContractorService {
    // ─── Onboard Company ────────────────────────────────────────────────────────
    async onboard(userId, input) {
        const [existing] = await client_js_1.db.select({ id: contractor_js_1.contractorProfiles.id })
            .from(contractor_js_1.contractorProfiles).where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, userId)).limit(1);
        if (existing)
            throw errors_js_1.Errors.conflict('Contractor profile already exists');
        await client_js_1.db.insert(contractor_js_1.contractorProfiles).values({
            id: userId,
            companyName: input.companyName,
            gstNumber: input.gstNumber,
            specializations: input.specializations,
            city: input.city,
            state: input.state,
            minProjectValue: input.minProjectValue ? String(input.minProjectValue) : undefined,
            isVerified: false,
        });
        logger_js_1.logger.info({ userId }, '[contractor] Profile created');
        return userId;
    }
    // ─── Add Technician (auto-approved under contractor umbrella) ────────────────
    async addTechnician(contractorId, technicianUserId) {
        const [contractor] = await client_js_1.db.select({ id: contractor_js_1.contractorProfiles.id })
            .from(contractor_js_1.contractorProfiles).where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, contractorId)).limit(1);
        if (!contractor)
            throw errors_js_1.Errors.notFound('Contractor');
        const [user] = await client_js_1.db.select({ id: users_js_1.users.id })
            .from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, technicianUserId)).limit(1);
        if (!user)
            throw errors_js_1.Errors.notFound('User');
        const [existing] = await client_js_1.db.select().from(contractor_js_1.contractorTechnicians)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contractorTechnicians.contractorId, contractorId), (0, drizzle_orm_1.eq)(contractor_js_1.contractorTechnicians.userId, technicianUserId))).limit(1);
        if (existing)
            throw errors_js_1.Errors.conflict('Technician already in company');
        await client_js_1.db.insert(contractor_js_1.contractorTechnicians).values({
            contractorId,
            userId: technicianUserId,
            isActive: true,
        });
        // Update team size
        await client_js_1.db.update(contractor_js_1.contractorProfiles)
            .set({ teamSize: (0, drizzle_orm_1.sql) `${contractor_js_1.contractorProfiles.teamSize} + 1` })
            .where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, contractorId));
        logger_js_1.logger.info({ contractorId, technicianUserId }, '[contractor] Technician added');
    }
    // ─── Assign Technician to Booking ────────────────────────────────────────────
    async assignTechnicianToBooking(contractorId, bookingId, technicianUserId) {
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.partnerId !== contractorId)
            throw errors_js_1.Errors.forbidden('Contractor does not own this booking');
        const [tech] = await client_js_1.db.select().from(contractor_js_1.contractorTechnicians)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contractorTechnicians.contractorId, contractorId), (0, drizzle_orm_1.eq)(contractor_js_1.contractorTechnicians.userId, technicianUserId), (0, drizzle_orm_1.eq)(contractor_js_1.contractorTechnicians.isActive, true))).limit(1);
        if (!tech)
            throw errors_js_1.Errors.validation({ technicianUserId: 'Technician is not active or not in your company' });
        // Since the system relies on partnerId for assignments, 
        // we should ideally add a `technicianId` to the `bookings` table.
        // For now, let's assume `partnerId` is strictly the entity that holds the booking
        // and we can log it or use an event.
        // Given the DB schema, `bookings.partnerId` is the assignee. 
        // If we want a technician to go, we could re-assign partnerId to the technicianUserId.
        await client_js_1.db.update(bookings_js_1.bookings)
            .set({ partnerId: technicianUserId })
            .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId));
        logger_js_1.logger.info({ bookingId, contractorId, technicianUserId }, '[contractor] Assigned technician to booking');
    }
    // ─── Lead Management ─────────────────────────────────────────────────────────
    async createLead(customerId, input) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to attract bids
        const [lead] = await client_js_1.db.insert(contractor_js_1.contractorLeads).values({
            customerId,
            addressId: input.addressId,
            title: input.title,
            description: input.description,
            category: input.category,
            city: input.city,
            estimatedBudget: input.estimatedBudget ? String(input.estimatedBudget) : undefined,
            preferredStartDate: input.preferredStartDate,
            photos: input.photos ?? [],
            status: 'open',
            expiresAt,
        }).returning({ id: contractor_js_1.contractorLeads.id });
        logger_js_1.logger.info({ customerId, leadId: lead.id }, '[contractor] Lead created');
        return lead.id;
    }
    async getOpenLeads(city, category) {
        const base = client_js_1.db.select().from(contractor_js_1.contractorLeads);
        if (city) {
            return base.where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.status, 'open'), (0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.city, city)))
                .orderBy(contractor_js_1.contractorLeads.createdAt).limit(50);
        }
        return base.where((0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.status, 'open'))
            .orderBy(contractor_js_1.contractorLeads.createdAt).limit(50);
    }
    // ─── Quotation ───────────────────────────────────────────────────────────────
    async submitQuotation(contractorId, leadId, input) {
        // Verify lead is still open
        const [lead] = await client_js_1.db.select().from(contractor_js_1.contractorLeads)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.id, leadId), (0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.status, 'open'))).limit(1);
        if (!lead)
            throw errors_js_1.Errors.notFound('Open lead');
        // Check contractor profile exists
        const [contractor] = await client_js_1.db.select({ id: contractor_js_1.contractorProfiles.id })
            .from(contractor_js_1.contractorProfiles).where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, contractorId)).limit(1);
        if (!contractor)
            throw errors_js_1.Errors.notFound('Contractor profile');
        // Don't allow duplicate quotations from same contractor
        const [existing] = await client_js_1.db.select().from(contractor_js_1.quotations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.quotations.leadId, leadId), (0, drizzle_orm_1.eq)(contractor_js_1.quotations.contractorId, contractorId), (0, drizzle_orm_1.ne)(contractor_js_1.quotations.status, 'rejected'))).limit(1);
        if (existing)
            throw errors_js_1.Errors.conflict('Already submitted a quotation for this lead');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 3); // 3 days to respond
        const [quotation] = await client_js_1.db.insert(contractor_js_1.quotations).values({
            leadId,
            contractorId,
            quoteAmount: String(input.quoteAmount),
            timelineDays: input.timelineDays,
            description: input.description,
            attachments: input.attachments ?? [],
            status: 'pending',
            expiresAt,
        }).returning({ id: contractor_js_1.quotations.id });
        // Move lead to 'bidding' if still 'open'
        if (lead.status === 'open') {
            await client_js_1.db.update(contractor_js_1.contractorLeads)
                .set({ status: 'bidding' })
                .where((0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.id, leadId));
        }
        logger_js_1.logger.info({ contractorId, leadId, quotationId: quotation.id }, '[contractor] Quotation submitted');
        return quotation.id;
    }
    // ─── Accept Quotation → Create Contract ───────────────────────────────────────
    async acceptQuotation(customerId, quotationId) {
        const [quotation] = await client_js_1.db.select().from(contractor_js_1.quotations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.quotations.id, quotationId), (0, drizzle_orm_1.eq)(contractor_js_1.quotations.status, 'pending'))).limit(1);
        if (!quotation)
            throw errors_js_1.Errors.notFound('Pending quotation');
        // Verify customer owns the lead
        const [lead] = await client_js_1.db.select().from(contractor_js_1.contractorLeads)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.id, quotation.leadId), (0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.customerId, customerId)))
            .limit(1);
        if (!lead)
            throw errors_js_1.Errors.forbidden('Not your lead');
        await client_js_1.db.transaction(async (tx) => {
            // Accept this quotation
            await tx.update(contractor_js_1.quotations)
                .set({ status: 'accepted', respondedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(contractor_js_1.quotations.id, quotationId));
            // Reject all other pending quotations for this lead
            await tx.update(contractor_js_1.quotations)
                .set({ status: 'rejected', respondedAt: new Date() })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.quotations.leadId, quotation.leadId), (0, drizzle_orm_1.ne)(contractor_js_1.quotations.id, quotationId), (0, drizzle_orm_1.eq)(contractor_js_1.quotations.status, 'pending')));
            // Award lead
            await tx.update(contractor_js_1.contractorLeads)
                .set({ status: 'awarded' })
                .where((0, drizzle_orm_1.eq)(contractor_js_1.contractorLeads.id, quotation.leadId));
        });
        // Create contract
        const [contract] = await client_js_1.db.insert(contractor_js_1.contracts).values({
            quotationId,
            customerId,
            contractorId: quotation.contractorId,
            totalAmount: quotation.quoteAmount,
            status: 'active',
        }).returning({ id: contractor_js_1.contracts.id });
        logger_js_1.logger.info({ quotationId, contractId: contract.id }, '[contractor] Contract created');
        return contract.id;
    }
    // ─── Milestones ───────────────────────────────────────────────────────────────
    async addMilestone(contractId, contractorId, input) {
        const [contract] = await client_js_1.db.select().from(contractor_js_1.contracts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contracts.id, contractId), (0, drizzle_orm_1.eq)(contractor_js_1.contracts.contractorId, contractorId))).limit(1);
        if (!contract)
            throw errors_js_1.Errors.notFound('Contract');
        if (contract.status !== 'active')
            throw errors_js_1.Errors.conflict('Contract is not active');
        const [milestone] = await client_js_1.db.insert(contractor_js_1.contractMilestones).values({
            contractId,
            title: input.title,
            description: input.description,
            amount: String(input.amount),
            status: 'pending',
            dueDate: input.dueDate,
        }).returning({ id: contractor_js_1.contractMilestones.id });
        return milestone.id;
    }
    async completeMilestone(milestoneId, contractorId) {
        const [milestone] = await client_js_1.db.select().from(contractor_js_1.contractMilestones)
            .where((0, drizzle_orm_1.eq)(contractor_js_1.contractMilestones.id, milestoneId)).limit(1);
        if (!milestone)
            throw errors_js_1.Errors.notFound('Milestone');
        // Verify contractor owns this contract
        const [contract] = await client_js_1.db.select().from(contractor_js_1.contracts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(contractor_js_1.contracts.id, milestone.contractId), (0, drizzle_orm_1.eq)(contractor_js_1.contracts.contractorId, contractorId)))
            .limit(1);
        if (!contract)
            throw errors_js_1.Errors.forbidden('Not your contract');
        await client_js_1.db.update(contractor_js_1.contractMilestones)
            .set({ status: 'completed', completedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(contractor_js_1.contractMilestones.id, milestoneId));
    }
    // ─── Get Contract ────────────────────────────────────────────────────────────
    async getContractById(contractId) {
        const [contract] = await client_js_1.db.select().from(contractor_js_1.contracts).where((0, drizzle_orm_1.eq)(contractor_js_1.contracts.id, contractId)).limit(1);
        if (!contract)
            throw errors_js_1.Errors.notFound('Contract');
        const milestoneList = await client_js_1.db.select().from(contractor_js_1.contractMilestones)
            .where((0, drizzle_orm_1.eq)(contractor_js_1.contractMilestones.contractId, contractId))
            .orderBy(contractor_js_1.contractMilestones.dueDate);
        return { ...contract, milestones: milestoneList };
    }
}
exports.ContractorService = ContractorService;
exports.contractorService = new ContractorService();
//# sourceMappingURL=contractor.service.js.map