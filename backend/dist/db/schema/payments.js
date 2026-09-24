"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissionsRelations = exports.payoutsRelations = exports.amcSubscriptionsRelations = exports.walletTransactionsRelations = exports.paymentsRelations = exports.payouts = exports.payoutStatusEnum = exports.beneficiaryTypeEnum = exports.ledgerEntries = exports.accountTypeEnum = exports.amcVisits = exports.amcVisitStatusEnum = exports.amcSubscriptions = exports.referrals = exports.referralStatusEnum = exports.walletTransactions = exports.wallets = exports.walletTxTypeEnum = exports.walletOwnerTypeEnum = exports.settlements = exports.invoices = exports.commissions = exports.refunds = exports.payments = exports.amcSubStatusEnum = exports.txTypeEnum = exports.settlementStatusEnum = exports.refundStatusEnum = exports.paymentMethodEnum = exports.paymentStatusEnum = void 0;
/**
 * Drizzle Schema — Payments, Earnings, AMC Subscriptions
 * Layer 4: Data
 *
 * Accounting rules:
 *   - Every payment → Commission record + WalletTransaction debit
 *   - No money moves without a double-entry record
 *   - Settlement = explicit admin-approved payout
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const users_js_1 = require("./users.js");
const partners_js_1 = require("./partners.js");
const bookings_js_1 = require("./bookings.js");
const services_js_1 = require("./services.js");
const contractor_js_1 = require("./contractor.js");
// ─── Enums ───────────────────────────────────────────────────────────────────
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)('payment_status', ['pending', 'captured', 'failed', 'refunded']);
exports.paymentMethodEnum = (0, pg_core_1.pgEnum)('payment_method', ['upi', 'card', 'net_banking', 'wallet', 'cash', 'cod']);
exports.refundStatusEnum = (0, pg_core_1.pgEnum)('refund_status', ['initiated', 'processing', 'completed', 'failed']);
exports.settlementStatusEnum = (0, pg_core_1.pgEnum)('settlement_status', ['pending', 'processing', 'completed', 'failed']);
exports.txTypeEnum = (0, pg_core_1.pgEnum)('tx_type', [
    'earning', 'payout', 'lead_fee', 'penalty', 'bonus', 'refund',
]);
exports.amcSubStatusEnum = (0, pg_core_1.pgEnum)('amc_sub_status', ['pending_payment', 'active', 'expired', 'cancelled', 'paused']);
// ─── Payments ─────────────────────────────────────────────────────────────────
exports.payments = (0, pg_core_1.pgTable)('payments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').unique().notNull().references(() => bookings_js_1.bookings.id),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.paymentStatusEnum)('status').default('pending').notNull(),
    method: (0, exports.paymentMethodEnum)('method'),
    razorpayOrderId: (0, pg_core_1.varchar)('razorpay_order_id', { length: 255 }),
    razorpayPaymentId: (0, pg_core_1.varchar)('razorpay_payment_id', { length: 255 }),
    razorpaySignature: (0, pg_core_1.varchar)('razorpay_signature', { length: 512 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    paidAt: (0, pg_core_1.timestamp)('paid_at'),
}, (t) => ({
    statusIdx: (0, pg_core_1.index)('payments_status_idx').on(t.status),
}));
// ─── Refunds ─────────────────────────────────────────────────────────────────
exports.refunds = (0, pg_core_1.pgTable)('refunds', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    paymentId: (0, pg_core_1.uuid)('payment_id').notNull().references(() => exports.payments.id),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    reason: (0, pg_core_1.text)('reason'),
    status: (0, exports.refundStatusEnum)('status').default('initiated').notNull(),
    razorpayRefundId: (0, pg_core_1.varchar)('razorpay_refund_id', { length: 255 }),
    initiatedById: (0, pg_core_1.uuid)('initiated_by_id').references(() => users_js_1.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
});
// ─── Commissions (double-entry, per booking) ──────────────────────────────────
exports.commissions = (0, pg_core_1.pgTable)('commissions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    paymentId: (0, pg_core_1.uuid)('payment_id').unique().notNull().references(() => exports.payments.id),
    bookingId: (0, pg_core_1.uuid)('booking_id').notNull().references(() => bookings_js_1.bookings.id),
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull().references(() => partners_js_1.partners.id),
    grossAmount: (0, pg_core_1.numeric)('gross_amount', { precision: 10, scale: 2 }).notNull(),
    commissionPct: (0, pg_core_1.real)('commission_pct').notNull(), // e.g. 20.0
    commissionAmount: (0, pg_core_1.numeric)('commission_amount', { precision: 10, scale: 2 }).notNull(),
    taxOnCommission: (0, pg_core_1.numeric)('tax_on_commission', { precision: 10, scale: 2 }).default('0').notNull(),
    partnerEarning: (0, pg_core_1.numeric)('partner_earning', { precision: 10, scale: 2 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── Invoices ─────────────────────────────────────────────────────────────────
exports.invoices = (0, pg_core_1.pgTable)('invoices', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    paymentId: (0, pg_core_1.uuid)('payment_id').unique().notNull().references(() => exports.payments.id),
    invoiceNumber: (0, pg_core_1.varchar)('invoice_number', { length: 50 }).unique().notNull(),
    customerId: (0, pg_core_1.uuid)('customer_id').notNull().references(() => users_js_1.users.id),
    subtotal: (0, pg_core_1.numeric)('subtotal', { precision: 10, scale: 2 }).notNull(),
    taxAmount: (0, pg_core_1.numeric)('tax_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    discountAmount: (0, pg_core_1.numeric)('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    totalAmount: (0, pg_core_1.numeric)('total_amount', { precision: 10, scale: 2 }).notNull(),
    invoiceUrl: (0, pg_core_1.varchar)('invoice_url', { length: 512 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── Settlements (admin-approved payout to partner bank/UPI) ─────────────────
exports.settlements = (0, pg_core_1.pgTable)('settlements', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull().references(() => partners_js_1.partners.id),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.settlementStatusEnum)('status').default('pending').notNull(),
    payoutMethod: (0, pg_core_1.varchar)('payout_method', { length: 30 }), // 'bank' | 'upi'
    utrNumber: (0, pg_core_1.varchar)('utr_number', { length: 100 }), // bank reference
    initiatedById: (0, pg_core_1.uuid)('initiated_by_id').references(() => users_js_1.users.id),
    requestedAt: (0, pg_core_1.timestamp)('requested_at').defaultNow().notNull(),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
    notes: (0, pg_core_1.text)('notes'),
}, (t) => ({
    partnerIdx: (0, pg_core_1.index)('settlements_partner_idx').on(t.partnerId),
    statusIdx: (0, pg_core_1.index)('settlements_status_idx').on(t.status),
}));
// ─── Wallets (first-class balance carrier for customer & partner) ─────────────
exports.walletOwnerTypeEnum = (0, pg_core_1.pgEnum)('wallet_owner_type', ['customer', 'partner']);
exports.walletTxTypeEnum = (0, pg_core_1.pgEnum)('wallet_tx_type', [
    'top_up', 'refund', 'referral_bonus', 'earning', 'bonus',
    'payment', 'payout', 'penalty', 'lead_fee',
]);
exports.wallets = (0, pg_core_1.pgTable)('wallets', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    ownerId: (0, pg_core_1.uuid)('owner_id').notNull().unique(),
    ownerType: (0, exports.walletOwnerTypeEnum)('owner_type').notNull(),
    balance: (0, pg_core_1.numeric)('balance', { precision: 12, scale: 2 }).default('0').notNull(),
    currency: (0, pg_core_1.varchar)('currency', { length: 3 }).default('INR').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    ownerIdx: (0, pg_core_1.index)('wallets_owner_idx').on(t.ownerId),
}));
// ─── Wallet Transactions (ledger — every credit/debit, generic) ───────────────
exports.walletTransactions = (0, pg_core_1.pgTable)('wallet_transactions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    walletId: (0, pg_core_1.uuid)('wallet_id').references(() => exports.wallets.id),
    // Legacy partner-only columns kept for backward compat
    partnerId: (0, pg_core_1.uuid)('partner_id').references(() => partners_js_1.partners.id),
    contractorId: (0, pg_core_1.uuid)('contractor_id').references(() => contractor_js_1.contractorProfiles.id),
    bookingId: (0, pg_core_1.uuid)('booking_id').references(() => bookings_js_1.bookings.id),
    settlementId: (0, pg_core_1.uuid)('settlement_id').references(() => exports.settlements.id),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 255 }), // generic external ref
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(), // + credit, – debit
    balanceAfter: (0, pg_core_1.numeric)('balance_after', { precision: 12, scale: 2 }).notNull(),
    txType: (0, exports.walletTxTypeEnum)('tx_type'), // new generic enum
    description: (0, pg_core_1.varchar)('description', { length: 512 }),
    note: (0, pg_core_1.text)('note'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    partnerIdx: (0, pg_core_1.index)('wallet_tx_partner_idx').on(t.partnerId),
    walletIdx: (0, pg_core_1.index)('wallet_tx_wallet_idx').on(t.walletId),
}));
// ─── Referrals ────────────────────────────────────────────────────────────────
exports.referralStatusEnum = (0, pg_core_1.pgEnum)('referral_status', [
    'pending', // Referral link clicked — awaiting signup
    'signed_up', // Referee signed up
    'completed', // Referee completed their first booking — credit unlocked
    'rewarded', // Credit issued to referrer
    'expired', // 30-day window passed without completion
]);
exports.referrals = (0, pg_core_1.pgTable)('referrals', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    referrerId: (0, pg_core_1.uuid)('referrer_id').notNull().references(() => users_js_1.users.id),
    refereeId: (0, pg_core_1.uuid)('referee_id').references(() => users_js_1.users.id),
    referralCode: (0, pg_core_1.varchar)('referral_code', { length: 20 }).unique().notNull(),
    status: (0, exports.referralStatusEnum)('status').default('pending').notNull(),
    referrerCredit: (0, pg_core_1.numeric)('referrer_credit', { precision: 8, scale: 2 }).default('0').notNull(), // INR reward on completion
    refereeCredit: (0, pg_core_1.numeric)('referee_credit', { precision: 8, scale: 2 }).default('0').notNull(), // First-booking discount for referee
    firstBookingId: (0, pg_core_1.uuid)('first_booking_id').references(() => bookings_js_1.bookings.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(), // 30 days from creation
}, (t) => ({
    referrerIdx: (0, pg_core_1.index)('referrals_referrer_idx').on(t.referrerId),
    referralCodeIdx: (0, pg_core_1.index)('referrals_code_idx').on(t.referralCode),
}));
// ─── AMC Subscriptions ────────────────────────────────────────────────────────
exports.amcSubscriptions = (0, pg_core_1.pgTable)('amc_subscriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    customerId: (0, pg_core_1.uuid)('customer_id').notNull().references(() => users_js_1.users.id),
    planId: (0, pg_core_1.uuid)('plan_id').notNull().references(() => services_js_1.amcPlans.id),
    addressId: (0, pg_core_1.uuid)('address_id').references(() => users_js_1.addresses.id),
    status: (0, exports.amcSubStatusEnum)('status').default('pending_payment').notNull(),
    startDate: (0, pg_core_1.date)('start_date'),
    endDate: (0, pg_core_1.date)('end_date'),
    visitsTotal: (0, pg_core_1.integer)('visits_total').notNull(),
    visitsUsed: (0, pg_core_1.integer)('visits_used').default(0).notNull(),
    visitsRemaining: (0, pg_core_1.integer)('visits_remaining').notNull(),
    paymentId: (0, pg_core_1.uuid)('payment_id').references(() => exports.payments.id),
    autoRenew: (0, pg_core_1.boolean)('auto_renew').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    renewedAt: (0, pg_core_1.timestamp)('renewed_at'),
}, (t) => ({
    customerIdx: (0, pg_core_1.index)('amc_subs_customer_idx').on(t.customerId),
    statusIdx: (0, pg_core_1.index)('amc_subs_status_idx').on(t.status),
}));
// ─── AMC Visits ───────────────────────────────────────────────────────────────
exports.amcVisitStatusEnum = (0, pg_core_1.pgEnum)('amc_visit_status', ['scheduled', 'completed', 'missed', 'cancelled']);
exports.amcVisits = (0, pg_core_1.pgTable)('amc_visits', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    contractId: (0, pg_core_1.uuid)('contract_id').notNull().references(() => exports.amcSubscriptions.id, { onDelete: 'cascade' }),
    bookingId: (0, pg_core_1.uuid)('booking_id').references(() => bookings_js_1.bookings.id),
    visitNumber: (0, pg_core_1.integer)('visit_number').notNull(),
    status: (0, exports.amcVisitStatusEnum)('status').default('scheduled').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── Ledger Entries ───────────────────────────────────────────────────────────
exports.accountTypeEnum = (0, pg_core_1.pgEnum)('account_type', ['platform', 'partner', 'contractor', 'customer']);
exports.ledgerEntries = (0, pg_core_1.pgTable)('ledger_entries', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').references(() => bookings_js_1.bookings.id),
    accountType: (0, exports.accountTypeEnum)('account_type').notNull(),
    accountId: (0, pg_core_1.uuid)('account_id'), // generic reference to user/partner/contractor
    debit: (0, pg_core_1.numeric)('debit', { precision: 12, scale: 2 }).default('0').notNull(),
    credit: (0, pg_core_1.numeric)('credit', { precision: 12, scale: 2 }).default('0').notNull(),
    narration: (0, pg_core_1.varchar)('narration', { length: 512 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── Payouts ──────────────────────────────────────────────────────────────────
exports.beneficiaryTypeEnum = (0, pg_core_1.pgEnum)('beneficiary_type', ['PARTNER', 'CONTRACTOR']);
exports.payoutStatusEnum = (0, pg_core_1.pgEnum)('payout_status', ['pending', 'processing', 'completed', 'failed']);
exports.payouts = (0, pg_core_1.pgTable)('payouts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    beneficiaryId: (0, pg_core_1.uuid)('beneficiary_id').notNull(),
    beneficiaryType: (0, exports.beneficiaryTypeEnum)('beneficiary_type').notNull(),
    periodStart: (0, pg_core_1.timestamp)('period_start').notNull(),
    periodEnd: (0, pg_core_1.timestamp)('period_end').notNull(),
    gross: (0, pg_core_1.numeric)('gross', { precision: 12, scale: 2 }).notNull(),
    commission: (0, pg_core_1.numeric)('commission', { precision: 12, scale: 2 }).notNull(),
    tds: (0, pg_core_1.numeric)('tds', { precision: 12, scale: 2 }).notNull(),
    net: (0, pg_core_1.numeric)('net', { precision: 12, scale: 2 }).notNull(),
    status: (0, exports.payoutStatusEnum)('status').default('pending').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}); // ─── Relations ────────────────────────────────────────────────────────────────
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one }) => ({
    booking: one(bookings_js_1.bookings, { fields: [exports.payments.bookingId], references: [bookings_js_1.bookings.id] }),
    refund: one(exports.refunds, { fields: [exports.payments.id], references: [exports.refunds.paymentId] }),
    commission: one(exports.commissions, { fields: [exports.payments.id], references: [exports.commissions.paymentId] }),
    invoice: one(exports.invoices, { fields: [exports.payments.id], references: [exports.invoices.paymentId] }),
}));
exports.walletTransactionsRelations = (0, drizzle_orm_1.relations)(exports.walletTransactions, ({ one }) => ({
    partner: one(partners_js_1.partners, { fields: [exports.walletTransactions.partnerId], references: [partners_js_1.partners.id] }),
    booking: one(bookings_js_1.bookings, { fields: [exports.walletTransactions.bookingId], references: [bookings_js_1.bookings.id] }),
    settlement: one(exports.settlements, { fields: [exports.walletTransactions.settlementId], references: [exports.settlements.id] }),
}));
exports.amcSubscriptionsRelations = (0, drizzle_orm_1.relations)(exports.amcSubscriptions, ({ one }) => ({
    customer: one(users_js_1.users, { fields: [exports.amcSubscriptions.customerId], references: [users_js_1.users.id] }),
    plan: one(services_js_1.amcPlans, { fields: [exports.amcSubscriptions.planId], references: [services_js_1.amcPlans.id] }),
    payment: one(exports.payments, { fields: [exports.amcSubscriptions.paymentId], references: [exports.payments.id] }),
}));
exports.payoutsRelations = (0, drizzle_orm_1.relations)(exports.payouts, ({ one }) => ({
    partner: one(partners_js_1.partners, { fields: [exports.payouts.beneficiaryId], references: [partners_js_1.partners.id] }),
}));
exports.commissionsRelations = (0, drizzle_orm_1.relations)(exports.commissions, ({ one }) => ({
    payment: one(exports.payments, { fields: [exports.commissions.paymentId], references: [exports.payments.id] }),
    booking: one(bookings_js_1.bookings, { fields: [exports.commissions.bookingId], references: [bookings_js_1.bookings.id] }),
    partner: one(partners_js_1.partners, { fields: [exports.commissions.partnerId], references: [partners_js_1.partners.id] }),
}));
//# sourceMappingURL=payments.js.map