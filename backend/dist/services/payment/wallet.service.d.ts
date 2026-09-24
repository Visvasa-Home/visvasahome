/**
 * WalletService — Layer 3: Domain Services
 *
 * Manages internal wallets for both Customers and Partners.
 *
 * Customer wallet:
 *   - Top-up via payment gateway (Razorpay order → webhook → credit)
 *   - Spend on booking checkout (debited atomically with booking creation)
 *   - Refund receipt (credited when a booking is refunded)
 *   - Referral credit (credited on referral completion)
 *
 * Partner wallet:
 *   - Earnings credited on booking completion (gross - commission - tax)
 *   - Partial instant disbursement to UPI/bank on demand
 *   - Remaining balance settled on M/W/F payout cycle
 *
 * Accounting:
 *   All balance changes use a double-entry ledger (walletTransactions).
 *   No direct UPDATE to balance — always INSERT a ledger record + atomic
 *   increment/decrement. This ensures full audit trail.
 *
 * Concurrency:
 *   Balance changes use Postgres FOR UPDATE row locks inside transactions
 *   to prevent negative balance races.
 */
export type WalletOwnerType = 'customer' | 'partner';
export interface WalletBalance {
    walletId: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    balance: number;
    currency: string;
}
export interface TransactionResult {
    transactionId: string;
    newBalance: number;
}
export declare class WalletService {
    getBalance(ownerId: string, ownerType: WalletOwnerType): Promise<WalletBalance>;
    /**
     * Add funds to a wallet.
     * Used for: top-up, refund receipt, referral credit, partner earnings.
     */
    credit(ownerId: string, ownerType: WalletOwnerType, amount: number, txType: 'top_up' | 'refund' | 'referral_bonus' | 'earning' | 'bonus', referenceId?: string, // bookingId, paymentId, etc.
    note?: string): Promise<TransactionResult>;
    /**
     * Deduct funds from a wallet.
     * Fails if insufficient balance (no negative balance allowed).
     * Used for: booking payment from wallet, instant disbursement, penalty.
     */
    debit(ownerId: string, ownerType: WalletOwnerType, amount: number, txType: 'payment' | 'payout' | 'penalty' | 'lead_fee', referenceId?: string, note?: string): Promise<TransactionResult>;
    /**
     * Process a wallet top-up after payment gateway confirmation.
     * Called from the webhook handler (payment.captured event).
     */
    processTopUp(customerId: string, amount: number, razorpayPaymentId: string): Promise<TransactionResult>;
    getTransactions(ownerId: string, ownerType: WalletOwnerType, limit?: number, offset?: number): Promise<{
        partnerId: string | null;
        description: string | null;
        id: string;
        createdAt: Date;
        contractorId: string | null;
        bookingId: string | null;
        note: string | null;
        amount: string;
        walletId: string | null;
        settlementId: string | null;
        referenceId: string | null;
        balanceAfter: string;
        txType: "payment" | "earning" | "payout" | "lead_fee" | "penalty" | "bonus" | "refund" | "top_up" | "referral_bonus" | null;
    }[]>;
    private findOrCreate;
}
export declare const walletService: WalletService;
//# sourceMappingURL=wallet.service.d.ts.map