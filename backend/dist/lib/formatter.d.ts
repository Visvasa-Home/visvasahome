/**
 * Localization Formatter
 * Used for formatting dates, currencies, and addresses according to user locale.
 */
export declare class Formatter {
    /**
     * Format currency (defaults to INR if locale is undefined or missing)
     */
    static formatCurrency(amount: number, locale?: string, currency?: string): string;
    /**
     * Format date/time
     */
    static formatDate(date: Date, locale?: string): string;
}
//# sourceMappingURL=formatter.d.ts.map