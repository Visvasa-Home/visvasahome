/**
 * Typed Error Classes — Shared Lib
 * Provides a standard AppError that carries HTTP status + error code.
 * The gateway error-handler converts these to the uniform error envelope.
 */
export type ErrorCode = 'AUTH_INVALID_TOKEN' | 'AUTH_TOKEN_EXPIRED' | 'AUTH_MISSING_TOKEN' | 'AUTH_INVALID_OTP' | 'AUTH_OTP_EXPIRED' | 'AUTH_FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'BOOKING_INVALID_TRANSITION' | 'BOOKING_NOT_FOUND' | 'DISPATCH_NO_PARTNERS' | 'DISPATCH_RACE_LOST' | 'OFFER_EXPIRED' | 'OFFER_NOT_FOUND' | 'AMC_VISITS_EXHAUSTED' | 'AMC_NOT_ACTIVE' | 'PAYMENT_FAILED' | 'PAYMENT_ALREADY_CAPTURED' | 'COUPON_INVALID' | 'COUPON_EXPIRED' | 'COUPON_LIMIT_REACHED' | 'PARTNER_UNAVAILABLE' | 'PARTNER_NOT_FOUND' | 'CONTRACTOR_NOT_FOUND' | 'QUOTATION_NOT_FOUND' | 'CONTRACT_NOT_FOUND' | 'WALLET_INSUFFICIENT_BALANCE' | 'INTERNAL_ERROR' | 'SERVICE_UNAVAILABLE';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    readonly details?: unknown;
    constructor(message: string, statusCode: number, code: ErrorCode, details?: unknown);
}
export declare const Errors: {
    readonly notFound: (resource: string) => AppError;
    readonly conflict: (message: string) => AppError;
    readonly validation: (details: unknown) => AppError;
    readonly forbidden: (message?: string) => AppError;
    readonly unauthorized: (message?: string) => AppError;
    readonly tokenExpired: () => AppError;
    readonly invalidTransition: (from: string, to: string) => AppError;
    readonly dispatchNoPartners: () => AppError;
    readonly raceLost: () => AppError;
    readonly offerExpired: () => AppError;
    readonly amcVisitsExhausted: () => AppError;
    readonly couponInvalid: (reason: string) => AppError;
    readonly insufficientBalance: (current: number, required: number) => AppError;
    readonly internal: (message?: string) => AppError;
};
//# sourceMappingURL=errors.d.ts.map