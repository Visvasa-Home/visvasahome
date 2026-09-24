export declare class PartnerService {
    getProfile(partnerId: string): Promise<{
        status: "pending" | "kyc_submitted" | "active" | "suspended" | "blocked" | "rejected";
        phone: string;
        name: string;
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        basePrice: string | null;
        encryptedAadhaar: string | null;
        encryptedPan: string | null;
        kycWorkflowId: string | null;
        kycStatus: "pending" | "rejected" | "verified";
        interviewScheduledAt: Date | null;
        interviewStatus: "failed" | "scheduled" | "passed" | null;
        interviewNotes: string | null;
        backgroundCheckPassed: boolean;
        isAvailable: boolean;
        workStatus: "available" | "on_job" | "offline";
        employmentType: "part_time" | "full_time" | null;
        skillTags: unknown;
        serviceAreas: unknown;
        workingHoursStart: string | null;
        workingHoursEnd: string | null;
        calendarBlocks: unknown;
        bio: string | null;
        jobsCompleted: number;
        careerLevel: "onboarding" | "sme" | "trainer";
        rating: number;
        totalRatings: number;
        completionRate: number;
        acceptanceRate: number;
        walletBalance: string;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
        upiId: string | null;
        contractorId: string | null;
    }>;
    toggleAvailability(partnerId: string, isAvailable: boolean, workStatus: 'available' | 'offline' | 'on_job'): Promise<void>;
    updateKycStatus(partnerId: string, status: 'pending' | 'kyc_submitted' | 'active' | 'suspended' | 'blocked' | 'rejected'): Promise<void>;
    private authBridgeBreaker;
    /**
     * VisvasaHome-Style KYC API Trigger
     * Simulates sending documents to AuthBridge/Onfido and updating the workflow state.
     */
    submitKyc(partnerId: string, aadhaarPlain: string, panPlain: string): Promise<{
        kycWorkflowId: string;
        status: string;
    }>;
    /**
     * VisvasaHome-Style Skills Interview Scheduler
     */
    scheduleInterview(partnerId: string, scheduledDate: Date): Promise<void>;
    /**
     * Rule: Traceable review process for safety complaints.
     * Instantly suspends the partner pending manual admin review.
     */
    reportSafetyIssue(bookingId: string, partnerId: string, filedByRole: string, description: string): Promise<void>;
}
export declare const partnerService: PartnerService;
//# sourceMappingURL=partner.service.d.ts.map