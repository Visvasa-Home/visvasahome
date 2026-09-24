"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerService = exports.PartnerService = void 0;
/**
 * PartnerService — Layer 3: Domain Services
 *
 * Handles partner onboarding, KYC status, skills, training,
 * and toggling online/offline availability.
 */
const client_js_1 = require("../../db/client.js");
const partners_js_1 = require("../../db/schema/partners.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
const circuitBreaker_js_1 = require("../../lib/circuitBreaker.js");
const encryption_js_1 = require("../../lib/encryption.js");
class PartnerService {
    async getProfile(partnerId) {
        const [partner] = await client_js_1.providerDb.select().from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId)).limit(1);
        if (!partner)
            throw errors_js_1.Errors.notFound('Partner profile not found');
        return partner;
    }
    async toggleAvailability(partnerId, isAvailable, workStatus) {
        await client_js_1.providerDb.update(partners_js_1.partners).set({
            isAvailable,
            workStatus,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
    }
    async updateKycStatus(partnerId, status) {
        await client_js_1.providerDb.update(partners_js_1.partners).set({
            status,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
    }
    authBridgeBreaker = new circuitBreaker_js_1.CircuitBreaker('AuthBridge/Onfido (KYC)', 3, 10000, 5000);
    /**
     * VisvasaHome-Style KYC API Trigger
     * Simulates sending documents to AuthBridge/Onfido and updating the workflow state.
     */
    async submitKyc(partnerId, aadhaarPlain, panPlain) {
        const kycWorkflowId = `kyc_${Date.now()}`;
        // Encrypt sensitive PII using AES-256-GCM before passing to DB or external systems
        const encryptedAadhaar = await encryption_js_1.encryptionService.encrypt(aadhaarPlain);
        const encryptedPan = await encryption_js_1.encryptionService.encrypt(panPlain);
        // Simulate robust external call to AuthBridge/Onfido
        await this.authBridgeBreaker.fire(async () => {
            // Mock HTTP request to AuthBridge API
            // await axios.post('https://api.authbridge.com/v1/kyc', { aadhaar: encryptedAadhaar })
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulating network delay
        });
        await client_js_1.providerDb.update(partners_js_1.partners).set({
            kycStatus: 'pending',
            kycWorkflowId,
            encryptedAadhaar,
            encryptedPan,
            status: 'kyc_submitted', // Base status
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
        // In a real system, this would publish to Kafka to trigger external KYC
        return { kycWorkflowId, status: 'pending' };
    }
    /**
     * VisvasaHome-Style Skills Interview Scheduler
     */
    async scheduleInterview(partnerId, scheduledDate) {
        await client_js_1.providerDb.update(partners_js_1.partners).set({
            interviewScheduledAt: scheduledDate,
            interviewStatus: 'scheduled',
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
    }
    /**
     * Rule: Traceable review process for safety complaints.
     * Instantly suspends the partner pending manual admin review.
     */
    async reportSafetyIssue(bookingId, partnerId, filedByRole, description) {
        const { complaints } = await import('../../db/schema/bookings.js');
        await client_js_1.providerDb.transaction(async (tx) => {
            await tx.insert(complaints).values({
                bookingId,
                filedById: partnerId, // The person who filed it (e.g. customer). We assume customer ID is provided in a full implementation, but here we just trace it.
                filedByRole,
                complaintType: 'safety',
                subject: 'Safety Violation Reported',
                description,
                status: 'under_review',
            });
            await tx.update(partners_js_1.partners).set({
                status: 'suspended',
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
        });
        const { logger } = await import('../../lib/logger.js');
        logger.error({ partnerId, bookingId }, '[partner] Suspended due to safety complaint');
    }
}
exports.PartnerService = PartnerService;
exports.partnerService = new PartnerService();
//# sourceMappingURL=partner.service.js.map