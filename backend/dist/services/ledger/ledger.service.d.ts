export declare class LedgerService {
    /**
     * Rule: Partner job accept karne se pehle payout estimate dekh sake.
     * Returns the exact earning amount after commission.
     */
    getPayoutEstimate(bookingId: string): Promise<{
        estimatedEarning: number;
    }>;
    /**
     * Rule: Job completion ke baad financial ledger mein auditable entry bane.
     * Executes strict double-entry records.
     */
    recordJobCompletion(tx: any, paymentId: string, bookingId: string, partnerId: string, grossAmount: number): Promise<void>;
    /**
     * Deducts penalty from partner wallet for cancellation.
     */
    recordPartnerCancellationPenalty(tx: any, bookingId: string, partnerId: string, penaltyAmount: number): Promise<void>;
}
export declare const ledgerService: LedgerService;
//# sourceMappingURL=ledger.service.d.ts.map