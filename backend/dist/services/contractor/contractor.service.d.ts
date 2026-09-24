export declare class ContractorService {
    onboard(userId: string, input: {
        companyName: string;
        gstNumber?: string;
        specializations: string[];
        city: string;
        state: string;
        minProjectValue?: number;
    }): Promise<string>;
    addTechnician(contractorId: string, technicianUserId: string): Promise<void>;
    assignTechnicianToBooking(contractorId: string, bookingId: string, technicianUserId: string): Promise<void>;
    createLead(customerId: string, input: {
        title: string;
        description: string;
        category?: string;
        city?: string;
        addressId?: string;
        estimatedBudget?: number;
        preferredStartDate?: string;
        photos?: string[];
    }): Promise<string>;
    getOpenLeads(city?: string, category?: string): Promise<{
        status: "expired" | "open" | "closed" | "bidding" | "awarded";
        title: string;
        description: string;
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        city: string | null;
        category: string | null;
        customerId: string;
        addressId: string | null;
        photos: unknown;
        estimatedBudget: string | null;
        preferredStartDate: string | null;
    }[]>;
    submitQuotation(contractorId: string, leadId: string, input: {
        quoteAmount: number;
        timelineDays?: number;
        description?: string;
        attachments?: string[];
    }): Promise<string>;
    acceptQuotation(customerId: string, quotationId: string): Promise<string>;
    addMilestone(contractId: string, contractorId: string, input: {
        title: string;
        description?: string;
        amount: number;
        dueDate?: string;
    }): Promise<string>;
    completeMilestone(milestoneId: string, contractorId: string): Promise<void>;
    getContractById(contractId: string): Promise<{
        milestones: {
            status: "pending" | "in_progress" | "completed" | "paid";
            title: string;
            description: string | null;
            id: string;
            contractId: string;
            amount: string;
            dueDate: string | null;
            completedAt: Date | null;
            paymentId: string | null;
        }[];
        status: "active" | "completed" | "cancelled" | "disputed";
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contractorId: string;
        customerId: string;
        quotationId: string;
        totalAmount: string;
        startDate: string | null;
        endDate: string | null;
        contractDocUrl: string | null;
    }>;
}
export declare const contractorService: ContractorService;
//# sourceMappingURL=contractor.service.d.ts.map