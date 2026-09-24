"use strict";
/**
 * Localization Formatter
 * Used for formatting dates, currencies, and addresses according to user locale.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
class Formatter {
    /**
     * Format currency (defaults to INR if locale is undefined or missing)
     */
    static formatCurrency(amount, locale = 'en-IN', currency = 'INR') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(amount);
    }
    /**
     * Format date/time
     */
    static formatDate(date, locale = 'en-IN') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }
}
exports.Formatter = Formatter;
//# sourceMappingURL=formatter.js.map