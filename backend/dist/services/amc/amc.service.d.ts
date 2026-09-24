export declare class AmcService {
    subscribe(customerId: string, planId: string, addressId?: string): Promise<{
        subscriptionId: string;
        amount: number;
    }>;
    activate(subscriptionId: string, paymentId: string): Promise<void>;
    useVisit(customerId: string, subscriptionId: string, addressId?: string): Promise<{
        bookingId: string;
    }>;
    cancel(subscriptionId: string, customerId: string): Promise<{
        refundAmount: number;
    }>;
    pause(subscriptionId: string, customerId: string): Promise<void>;
    resume(subscriptionId: string, customerId: string): Promise<void>;
    checkExpiry(): Promise<number>;
    renewSubscription(subscriptionId: string, paymentId: string): Promise<void>;
    getByCustomer(customerId: string): Promise<{
        status: "expired" | "active" | "cancelled" | "pending_payment" | "paused";
        id: string;
        createdAt: Date;
        customerId: string;
        addressId: string | null;
        startDate: string | null;
        endDate: string | null;
        paymentId: string | null;
        planId: string;
        visitsTotal: number;
        visitsUsed: number;
        visitsRemaining: number;
        autoRenew: boolean;
        renewedAt: Date | null;
    }[]>;
}
export declare const amcService: AmcService;
//# sourceMappingURL=amc.service.d.ts.map