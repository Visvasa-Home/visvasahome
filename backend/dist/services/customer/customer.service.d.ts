export declare class CustomerService {
    getProfile(userId: string): Promise<{
        role: "customer" | "partner" | "contractor" | "admin";
        adminRole: "super_admin" | "operations_admin" | "partner_admin" | "customer_support" | "finance_admin" | "service_admin" | "analytics_admin" | null;
        phone: string;
        name: string;
        tenantId: string;
        gender: "male" | "female" | "other" | null;
        id: string;
        email: string | null;
        passwordHash: string | null;
        profilePictureUrl: string | null;
        fcmToken: string | null;
        preferredLocale: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addAddress(userId: string, input: {
        label: string;
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
        lat?: string;
        lng?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string | null;
        addressLine: string;
        landmark: string | null;
        city: string;
        state: string;
        pincode: string;
        latitude: string | null;
        longitude: string | null;
        isDefault: boolean;
    }>;
    listAddresses(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string | null;
        addressLine: string;
        landmark: string | null;
        city: string;
        state: string;
        pincode: string;
        latitude: string | null;
        longitude: string | null;
        isDefault: boolean;
    }[]>;
}
export declare const customerService: CustomerService;
//# sourceMappingURL=customer.service.d.ts.map