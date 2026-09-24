export type BookingStatus = 'pending' | 'searching' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'no_partner' | 'cancelled';
export interface CreateBookingInput {
    customerId: string;
    serviceId: string;
    addressId: string;
    couponCode?: string;
    bookingType: 'instant' | 'scheduled' | 'amc_visit';
    scheduledTime?: Date;
    amcSubscriptionId?: string;
    addonIds?: string[];
    notes?: string;
    idempotencyKey?: string;
    preferredGender?: string;
}
export interface BookingTransitionMeta {
    changedById?: string;
    changedByRole?: string;
    note?: string;
    updates?: Record<string, any>;
}
export declare class BookingService {
    create(input: CreateBookingInput): Promise<{
        bookingId: string;
        finalAmount: number;
    }>;
    reschedule(bookingId: string, customerId: string, newScheduledTime: Date): Promise<void>;
    transition(bookingId: string, newStatus: BookingStatus, meta?: BookingTransitionMeta): Promise<void>;
    startDispatch(bookingId: string): Promise<void>;
    verifyArrivalOtp(bookingId: string, otp: string): Promise<void>;
    /**
     * VisvasaHome-style Identity Verification (Azure Cognitive Services simulation).
     * Validates partner selfie matches their KYC profile before allowing job start.
     */
    verifyPartnerIdentity(bookingId: string, partnerId: string, selfieUrl: string): Promise<void>;
    assignPartner(bookingId: string, partnerId: string, meta?: BookingTransitionMeta): Promise<void>;
    completeJob(bookingId: string, partnerId: string, photos: string[]): Promise<void>;
    deductAmcVisit(subscriptionId: string): Promise<void>;
    refundAmcVisit(subscriptionId: string): Promise<void>;
    get(bookingId: string): Promise<{
        status: "pending" | "searching" | "assigned" | "en_route" | "in_progress" | "completed" | "no_partner" | "cancelled";
        partnerId: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        basePrice: string;
        serviceId: string;
        slotStart: Date | null;
        slotEnd: Date | null;
        bookingNumber: string;
        customerId: string;
        assignedContractorId: string | null;
        addressId: string;
        zoneId: string | null;
        couponId: string | null;
        amcSubscriptionId: string | null;
        idempotencyKey: string | null;
        bookingType: "scheduled" | "instant" | "amc_visit";
        scheduledTime: Date | null;
        requiredSkill: string | null;
        preferredGender: "male" | "female" | "other" | null;
        surgeAmount: string;
        addonsAmount: string;
        discountAmount: string;
        taxAmount: string;
        finalAmount: string;
        arrivalOtp: string | null;
        otpVerifiedAt: Date | null;
        partnerIdentityVerifiedAt: Date | null;
        partnerIdentityConfidence: number | null;
        completionPhotos: unknown;
        notes: string | null;
        cancellationReason: string | null;
        cancelledBy: "customer" | "partner" | "admin" | "system" | null;
        cancellationFee: string;
        dispatchRetryCount: number;
        slaEscalatedAt: Date | null;
        confirmedAt: Date | null;
        searchingStartedAt: Date | null;
        partnerAssignedAt: Date | null;
        partnerEnRouteAt: Date | null;
        jobStartedAt: Date | null;
        jobCompletedAt: Date | null;
        cancelledAt: Date | null;
    }>;
    getArrivalOtp(bookingId: string, requestingPartnerId: string): Promise<string>;
}
export declare const bookingService: BookingService;
//# sourceMappingURL=booking.service.d.ts.map