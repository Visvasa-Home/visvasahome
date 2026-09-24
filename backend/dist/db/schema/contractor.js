"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractsRelations = exports.quotationsRelations = exports.contractorLeadsRelations = exports.contractorProfilesRelations = exports.contractMilestones = exports.contracts = exports.quotations = exports.contractorLeads = exports.contractorTechnicians = exports.contractorProfiles = exports.milestoneStatusEnum = exports.contractStatusEnum = exports.quoteStatusEnum = exports.leadStatusEnum = void 0;
/**
 * Drizzle Schema — Contractors, Leads, Quotations, Contracts, Milestones
 * Layer 4: Data
 *
 * Contractor Model:
 *   Company onboards → adds technicians (auto-approved) →
 *   sees open jobs (leads) in city → bids → platform bills commission
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const users_js_1 = require("./users.js");
const users_js_2 = require("./users.js");
const payments_js_1 = require("./payments.js");
// ─── Enums ───────────────────────────────────────────────────────────────────
exports.leadStatusEnum = (0, pg_core_1.pgEnum)('lead_status', ['open', 'bidding', 'awarded', 'closed', 'expired']);
exports.quoteStatusEnum = (0, pg_core_1.pgEnum)('quote_status', ['pending', 'accepted', 'rejected', 'expired']);
exports.contractStatusEnum = (0, pg_core_1.pgEnum)('contract_status', ['active', 'completed', 'cancelled', 'disputed']);
exports.milestoneStatusEnum = (0, pg_core_1.pgEnum)('milestone_status', ['pending', 'in_progress', 'completed', 'paid']);
// ─── Contractor Profiles ──────────────────────────────────────────────────────
exports.contractorProfiles = (0, pg_core_1.pgTable)('contractor_profiles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().references(() => users_js_1.users.id, { onDelete: 'cascade' }),
    companyName: (0, pg_core_1.varchar)('company_name', { length: 255 }),
    gstNumber: (0, pg_core_1.varchar)('gst_number', { length: 20 }),
    specializations: (0, pg_core_1.jsonb)('specializations').default([]).notNull(), // string[]
    teamSize: (0, pg_core_1.integer)('team_size').default(1).notNull(),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    minProjectValue: (0, pg_core_1.numeric)('min_project_value', { precision: 10, scale: 2 }),
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false).notNull(),
    rating: (0, pg_core_1.numeric)('rating', { precision: 3, scale: 2 }).default('0').notNull(),
    commissionPct: (0, pg_core_1.numeric)('commission_pct', { precision: 5, scale: 2 }).default('15').notNull(),
    walletBalance: (0, pg_core_1.numeric)('wallet_balance', { precision: 12, scale: 2 }).default('0').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    cityIdx: (0, pg_core_1.index)('contractors_city_idx').on(t.city),
}));
// ─── Contractor Technicians ───────────────────────────────────────────────────
// Technicians are users with role=partner, linked under a contractor company
exports.contractorTechnicians = (0, pg_core_1.pgTable)('contractor_technicians', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    contractorId: (0, pg_core_1.uuid)('contractor_id').notNull().references(() => exports.contractorProfiles.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => users_js_1.users.id),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    joinedAt: (0, pg_core_1.timestamp)('joined_at').defaultNow().notNull(),
}, (t) => ({
    pk: (0, pg_core_1.uniqueIndex)('contractor_technicians_pk').on(t.contractorId, t.userId),
}));
// ─── Leads (customer posts a job for contractors to bid on) ───────────────────
exports.contractorLeads = (0, pg_core_1.pgTable)('contractor_leads', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    customerId: (0, pg_core_1.uuid)('customer_id').notNull().references(() => users_js_1.users.id),
    addressId: (0, pg_core_1.uuid)('address_id').references(() => users_js_2.addresses.id),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    estimatedBudget: (0, pg_core_1.numeric)('estimated_budget', { precision: 10, scale: 2 }),
    preferredStartDate: (0, pg_core_1.date)('preferred_start_date'),
    photos: (0, pg_core_1.jsonb)('photos').default([]).notNull(), // string[] (S3 URLs)
    status: (0, exports.leadStatusEnum)('status').default('open').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
}, (t) => ({
    statusIdx: (0, pg_core_1.index)('leads_status_idx').on(t.status),
    cityIdx: (0, pg_core_1.index)('leads_city_idx').on(t.city),
}));
// ─── Quotations (contractor bids on a lead) ───────────────────────────────────
exports.quotations = (0, pg_core_1.pgTable)('quotations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    leadId: (0, pg_core_1.uuid)('lead_id').notNull().references(() => exports.contractorLeads.id, { onDelete: 'cascade' }),
    contractorId: (0, pg_core_1.uuid)('contractor_id').notNull().references(() => exports.contractorProfiles.id),
    quoteAmount: (0, pg_core_1.numeric)('quote_amount', { precision: 10, scale: 2 }).notNull(),
    timelineDays: (0, pg_core_1.integer)('timeline_days'),
    description: (0, pg_core_1.text)('description'),
    attachments: (0, pg_core_1.jsonb)('attachments').default([]).notNull(),
    status: (0, exports.quoteStatusEnum)('status').default('pending').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    respondedAt: (0, pg_core_1.timestamp)('responded_at'),
}, (t) => ({
    leadIdx: (0, pg_core_1.index)('quotations_lead_idx').on(t.leadId),
    contractorIdx: (0, pg_core_1.index)('quotations_contractor_idx').on(t.contractorId),
}));
// ─── Contracts (accepted quotation → binding contract) ────────────────────────
exports.contracts = (0, pg_core_1.pgTable)('contracts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    quotationId: (0, pg_core_1.uuid)('quotation_id').unique().notNull().references(() => exports.quotations.id),
    customerId: (0, pg_core_1.uuid)('customer_id').notNull().references(() => users_js_1.users.id),
    contractorId: (0, pg_core_1.uuid)('contractor_id').notNull().references(() => exports.contractorProfiles.id),
    totalAmount: (0, pg_core_1.numeric)('total_amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.contractStatusEnum)('status').default('active').notNull(),
    startDate: (0, pg_core_1.date)('start_date'),
    endDate: (0, pg_core_1.date)('end_date'),
    contractDocUrl: (0, pg_core_1.varchar)('contract_doc_url', { length: 512 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    customerIdx: (0, pg_core_1.index)('contracts_customer_idx').on(t.customerId),
    contractorIdx: (0, pg_core_1.index)('contracts_contractor_idx').on(t.contractorId),
}));
// ─── Contract Milestones ──────────────────────────────────────────────────────
exports.contractMilestones = (0, pg_core_1.pgTable)('contract_milestones', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    contractId: (0, pg_core_1.uuid)('contract_id').notNull().references(() => exports.contracts.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    amount: (0, pg_core_1.numeric)('amount', { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.milestoneStatusEnum)('status').default('pending').notNull(),
    dueDate: (0, pg_core_1.date)('due_date'),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    paymentId: (0, pg_core_1.uuid)('payment_id').references(() => payments_js_1.payments.id),
}, (t) => ({
    contractIdx: (0, pg_core_1.index)('milestones_contract_idx').on(t.contractId),
}));
// ─── Relations ────────────────────────────────────────────────────────────────
exports.contractorProfilesRelations = (0, drizzle_orm_1.relations)(exports.contractorProfiles, ({ one, many }) => ({
    user: one(users_js_1.users, { fields: [exports.contractorProfiles.id], references: [users_js_1.users.id] }),
    technicians: many(exports.contractorTechnicians),
    quotations: many(exports.quotations),
    contracts: many(exports.contracts),
}));
exports.contractorLeadsRelations = (0, drizzle_orm_1.relations)(exports.contractorLeads, ({ one, many }) => ({
    customer: one(users_js_1.users, { fields: [exports.contractorLeads.customerId], references: [users_js_1.users.id] }),
    quotations: many(exports.quotations),
}));
exports.quotationsRelations = (0, drizzle_orm_1.relations)(exports.quotations, ({ one }) => ({
    lead: one(exports.contractorLeads, { fields: [exports.quotations.leadId], references: [exports.contractorLeads.id] }),
    contractor: one(exports.contractorProfiles, { fields: [exports.quotations.contractorId], references: [exports.contractorProfiles.id] }),
    contract: one(exports.contracts, { fields: [exports.quotations.id], references: [exports.contracts.quotationId] }),
}));
exports.contractsRelations = (0, drizzle_orm_1.relations)(exports.contracts, ({ one, many }) => ({
    quotation: one(exports.quotations, { fields: [exports.contracts.quotationId], references: [exports.quotations.id] }),
    customer: one(users_js_1.users, { fields: [exports.contracts.customerId], references: [users_js_1.users.id] }),
    contractor: one(exports.contractorProfiles, { fields: [exports.contracts.contractorId], references: [exports.contractorProfiles.id] }),
    milestones: many(exports.contractMilestones),
}));
//# sourceMappingURL=contractor.js.map