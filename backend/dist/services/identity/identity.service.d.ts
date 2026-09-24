export declare class IdentityService {
    sendLoginOtp(phone: string): Promise<void>;
    verifyLoginOtp(phone: string, otp: string, name?: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    loginWithPassword(email: string, passwordPlain: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    registerWithPassword(email: string, passwordPlain: string, name: string, phone: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    private createSession;
    /**
     * GDPR / PDPA Right to be Forgotten
     * Anonymizes PII data (phone, email, name) for a user to maintain referential integrity
     * for bookings/payments, but removes all identifiable info.
     */
    deleteAccount(userId: string): Promise<void>;
}
export declare const identityService: IdentityService;
//# sourceMappingURL=identity.service.d.ts.map