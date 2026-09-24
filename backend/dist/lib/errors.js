"use strict";
/**
 * Typed Error Classes — Shared Lib
 * Provides a standard AppError that carries HTTP status + error code.
 * The gateway error-handler converts these to the uniform error envelope.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode, code, details) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
// ─── Convenience constructors ─────────────────────────────────────────────────
exports.Errors = {
    notFound: (resource) => new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
    conflict: (message) => new AppError(message, 409, 'CONFLICT'),
    validation: (details) => new AppError('Validation failed', 400, 'VALIDATION_ERROR', details),
    forbidden: (message = 'Forbidden') => new AppError(message, 403, 'AUTH_FORBIDDEN'),
    unauthorized: (message = 'Unauthorized') => new AppError(message, 401, 'AUTH_MISSING_TOKEN'),
    tokenExpired: () => new AppError('Token expired', 401, 'AUTH_TOKEN_EXPIRED'),
    invalidTransition: (from, to) => new AppError(`Cannot transition booking from '${from}' to '${to}'`, 400, 'BOOKING_INVALID_TRANSITION'),
    dispatchNoPartners: () => new AppError('No suitable partners found', 503, 'DISPATCH_NO_PARTNERS'),
    raceLost: () => new AppError('Another partner accepted this booking first', 409, 'DISPATCH_RACE_LOST'),
    offerExpired: () => new AppError('This offer has expired', 410, 'OFFER_EXPIRED'),
    amcVisitsExhausted: () => new AppError('No visits remaining on this AMC subscription', 400, 'AMC_VISITS_EXHAUSTED'),
    couponInvalid: (reason) => new AppError(`Coupon invalid: ${reason}`, 400, 'COUPON_INVALID'),
    insufficientBalance: (current, required) => new AppError(`Insufficient wallet balance: have ₹${current.toFixed(2)}, need ₹${required.toFixed(2)}`, 402, 'WALLET_INSUFFICIENT_BALANCE', { current, required }),
    internal: (message = 'Internal server error') => new AppError(message, 500, 'INTERNAL_ERROR'),
};
//# sourceMappingURL=errors.js.map