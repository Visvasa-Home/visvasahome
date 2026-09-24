"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerService = exports.LedgerService = void 0;
/**
 * LedgerService — Layer 3: Domain Services
 *
 * Enforces strict double-entry accounting for all financial movements.
 * Also handles earnings calculations and payout estimates.
 */
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const partners_js_1 = require("../../db/schema/partners.js");
const contractor_js_1 = require("../../db/schema/contractor.js");
const payments_js_1 = require("../../db/schema/payments.js");
const pricing_service_js_1 = require("../pricing/pricing.service.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
const logger_js_1 = require("../../lib/logger.js");
const DEFAULT_COMMISSION_PCT = parseFloat(process.env.DEFAULT_COMMISSION_PCT ?? '20');
class LedgerService {
    /**
     * Rule: Partner job accept karne se pehle payout estimate dekh sake.
     * Returns the exact earning amount after commission.
     */
    async getPayoutEstimate(bookingId) {
        const [booking] = await client_js_1.paymentDb.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        const grossAmount = parseFloat(String(booking.finalAmount));
        const { partnerEarning } = pricing_service_js_1.pricingService.calculateCommission(grossAmount, DEFAULT_COMMISSION_PCT);
        return { estimatedEarning: partnerEarning };
    }
    /**
     * Rule: Job completion ke baad financial ledger mein auditable entry bane.
     * Executes strict double-entry records.
     */
    async recordJobCompletion(tx, paymentId, bookingId, partnerId, grossAmount) {
        const { commissionAmount, taxOnCommission, partnerEarning } = pricing_service_js_1.pricingService.calculateCommission(grossAmount, DEFAULT_COMMISSION_PCT);
        // Compliance: TDS deduction (1% under section 194O of IT Act for e-commerce operators)
        const tdsRate = 0.01;
        const tdsAmount = partnerEarning * tdsRate;
        const finalPartnerEarning = partnerEarning - tdsAmount;
        // 1. Commission ledger record
        await tx.insert(payments_js_1.commissions).values({
            paymentId,
            bookingId,
            partnerId,
            grossAmount: String(grossAmount),
            commissionPct: DEFAULT_COMMISSION_PCT,
            commissionAmount: String(commissionAmount),
            taxOnCommission: String(taxOnCommission),
            partnerEarning: String(partnerEarning), // Gross before TDS
            // Assuming db schema update will add tdsAmount column, we log it in double-entry below
        });
        // 2. Credit partner or contractor wallet
        const [partner] = await tx.select({
            balance: partners_js_1.partners.walletBalance,
            contractorId: partners_js_1.partners.contractorId,
        }).from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId)).limit(1);
        if (partner?.contractorId) {
            const [contractor] = await tx.select({ balance: contractor_js_1.contractorProfiles.walletBalance })
                .from(contractor_js_1.contractorProfiles).where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, partner.contractorId)).limit(1);
            const newBalance = parseFloat(String(contractor?.balance ?? 0)) + finalPartnerEarning;
            await tx.update(contractor_js_1.contractorProfiles)
                .set({ walletBalance: String(newBalance) })
                .where((0, drizzle_orm_1.eq)(contractor_js_1.contractorProfiles.id, partner.contractorId));
            await tx.insert(payments_js_1.walletTransactions).values({
                contractorId: partner.contractorId,
                bookingId,
                amount: String(finalPartnerEarning),
                balanceAfter: String(newBalance),
                txType: 'earning',
                description: `Earning for booking ${bookingId.slice(0, 8)} (Technician: ${partnerId})`,
            });
        }
        else {
            const newBalance = parseFloat(String(partner?.balance ?? 0)) + finalPartnerEarning;
            await tx.update(partners_js_1.partners)
                .set({ walletBalance: String(newBalance) })
                .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
            await tx.insert(payments_js_1.walletTransactions).values({
                partnerId: partnerId,
                bookingId,
                amount: String(finalPartnerEarning),
                balanceAfter: String(newBalance),
                txType: 'earning',
                description: `Earning for booking ${bookingId.slice(0, 8)}`,
            });
        }
        // 3. Ledger Entries (Double-entry accounting)
        await tx.insert(payments_js_1.ledgerEntries).values({
            bookingId,
            accountType: 'platform',
            debit: String(grossAmount),
            narration: `Payment received for booking ${bookingId.slice(0, 8)}`,
        });
        await tx.insert(payments_js_1.ledgerEntries).values({
            bookingId,
            accountType: partner?.contractorId ? 'contractor' : 'partner',
            accountId: partner?.contractorId ? partner.contractorId : partnerId,
            credit: String(finalPartnerEarning),
            narration: `Earning for booking ${bookingId.slice(0, 8)} (After 1% TDS)`,
        });
        await tx.insert(payments_js_1.ledgerEntries).values({
            bookingId,
            accountType: 'platform',
            credit: String(commissionAmount),
            narration: `Commission for booking ${bookingId.slice(0, 8)}`,
        });
        // Compliance: Log TDS payable to government
        await tx.insert(payments_js_1.ledgerEntries).values({
            bookingId,
            accountType: 'platform',
            credit: String(tdsAmount),
            narration: `TDS Payable (1%) for booking ${bookingId.slice(0, 8)}`,
        });
        logger_js_1.logger.info({ bookingId, finalPartnerEarning, tdsAmount }, '[ledger] Double-entry completed with TDS');
    }
    /**
     * Deducts penalty from partner wallet for cancellation.
     */
    async recordPartnerCancellationPenalty(tx, bookingId, partnerId, penaltyAmount) {
        const [partner] = await tx.select({
            balance: partners_js_1.partners.walletBalance,
        }).from(partners_js_1.partners).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId)).limit(1);
        if (partner) {
            const newBalance = Math.max(0, parseFloat(String(partner.balance ?? 0)) - penaltyAmount);
            await tx.update(partners_js_1.partners)
                .set({ walletBalance: String(newBalance) })
                .where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
            await tx.insert(payments_js_1.walletTransactions).values({
                partnerId,
                bookingId,
                amount: String(-penaltyAmount),
                balanceAfter: String(newBalance),
                txType: 'penalty',
                description: `Cancellation penalty for booking ${bookingId.slice(0, 8)}`,
            });
            await tx.insert(payments_js_1.ledgerEntries).values({
                bookingId,
                accountType: 'partner',
                accountId: partnerId,
                debit: String(penaltyAmount),
                narration: `Cancellation penalty for booking ${bookingId.slice(0, 8)}`,
            });
            await tx.insert(payments_js_1.ledgerEntries).values({
                bookingId,
                accountType: 'platform',
                credit: String(penaltyAmount),
                narration: `Platform revenue from cancellation penalty ${bookingId.slice(0, 8)}`,
            });
            logger_js_1.logger.info({ bookingId, partnerId, penaltyAmount }, '[ledger] Penalty recorded');
        }
    }
}
exports.LedgerService = LedgerService;
exports.ledgerService = new LedgerService();
//# sourceMappingURL=ledger.service.js.map