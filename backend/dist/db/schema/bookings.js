"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offersRelations = exports.bookingsRelations = exports.complaints = exports.complaintTypeEnum = exports.complaintStatusEnum = exports.reviews = exports.bookingStatusHistory = exports.offers = exports.bookingItems = exports.bookings = exports.cancelledByEnum = exports.offerStatusEnum = exports.bookingTypeEnum = exports.bookingStatusEnum = void 0;
/**
 * Drizzle Schema — Bookings, Offers, Status History, Reviews, Complaints
 * Layer 4: Data
 *
 * Booking State Machine:
 *   pending → searching → assigned → en_route → in_progress → completed
 *   pending | searching → no_partner
 *   any pre-completion → cancelled
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const users_js_1 = require("./users.js");
const partners_js_1 = require("./partners.js");
const services_js_1 = require("./services.js");
const users_js_2 = require("./users.js");
// ─── Booking Status Enum (state machine) ─────────────────────────────────────
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)('booking_status', [
    // Normal flow
    'pending', // created, awaiting payment confirmation
    'searching', // paid, dispatch started — looking for partners
    'assigned', // partner accepted — job assigned
    'en_route', // partner GPS-confirmed heading to customer
    'in_progress', // OTP verified, work started
    'completed', // job done, earnings credited
    // Terminal error states
    'no_partner', // dispatch exhausted — admin must manually assign
    // Cancellation
    'cancelled', // cancelled by customer / partner / admin
]);
// Booking type
exports.bookingTypeEnum = (0, pg_core_1.pgEnum)('booking_type', [
    'instant', // real-time dispatch
    'scheduled', // slot ≥ 1h ahead
    'amc_visit', // AMC subscription visit, final_amount = 0
]);
// ─── Offer Status ────────────────────────────────────────────────────────────
exports.offerStatusEnum = (0, pg_core_1.pgEnum)('offer_status', [
    'pending', 'accepted', 'rejected', 'expired', 'revoked',
]);
// ─── Cancellation By ─────────────────────────────────────────────────────────
exports.cancelledByEnum = (0, pg_core_1.pgEnum)('cancelled_by', ['customer', 'partner', 'admin', 'system']);
// ─── Bookings ─────────────────────────────────────────────────────────────────
exports.bookings = (0, pg_core_1.pgTable)('bookings', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingNumber: (0, pg_core_1.varchar)('booking_number', { length: 255 }).unique().notNull(), // VH-2024-001234
    customerId: (0, pg_core_1.uuid)('customer_id').notNull().references(() => users_js_1.users.id),
    partnerId: (0, pg_core_1.uuid)('partner_id').references(() => partners_js_1.partners.id),
    assignedContractorId: (0, pg_core_1.uuid)('assigned_contractor_id'), // optional, FK if we add it
    tenantId: (0, pg_core_1.varchar)('tenant_id', { length: 50 }).default('default').notNull(),
    serviceId: (0, pg_core_1.uuid)('service_id').notNull().references(() => services_js_1.services.id),
    addressId: (0, pg_core_1.uuid)('address_id').notNull().references(() => users_js_2.addresses.id),
    zoneId: (0, pg_core_1.uuid)('zone_id'),
    couponId: (0, pg_core_1.uuid)('coupon_id'),
    amcSubscriptionId: (0, pg_core_1.uuid)('amc_subscription_id'),
    idempotencyKey: (0, pg_core_1.varchar)('idempotency_key', { length: 255 }).unique(),
    // Booking type & timing
    bookingType: (0, exports.bookingTypeEnum)('booking_type').default('instant').notNull(),
    status: (0, exports.bookingStatusEnum)('status').default('pending').notNull(),
    scheduledTime: (0, pg_core_1.timestamp)('scheduled_time'), // only for scheduled/amc_visit
    slotStart: (0, pg_core_1.timestamp)('slot_start'),
    slotEnd: (0, pg_core_1.timestamp)('slot_end'),
    requiredSkill: (0, pg_core_1.varchar)('required_skill', { length: 100 }),
    preferredGender: (0, users_js_1.genderEnum)('preferred_gender'),
    // Pricing
    basePrice: (0, pg_core_1.numeric)('base_price', { precision: 10, scale: 2 }).notNull(),
    surgeAmount: (0, pg_core_1.numeric)('surge_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    addonsAmount: (0, pg_core_1.numeric)('addons_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    discountAmount: (0, pg_core_1.numeric)('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    taxAmount: (0, pg_core_1.numeric)('tax_amount', { precision: 10, scale: 2 }).default('0').notNull(),
    finalAmount: (0, pg_core_1.numeric)('final_amount', { precision: 10, scale: 2 }).notNull(),
    // Job control
    arrivalOtp: (0, pg_core_1.varchar)('arrival_otp', { length: 6 }),
    otpVerifiedAt: (0, pg_core_1.timestamp)('otp_verified_at'),
    partnerIdentityVerifiedAt: (0, pg_core_1.timestamp)('partner_identity_verified_at'),
    partnerIdentityConfidence: (0, pg_core_1.real)('partner_identity_confidence'),
    completionPhotos: (0, pg_core_1.jsonb)('completion_photos'), // Array of photo URLs
    notes: (0, pg_core_1.text)('notes'),
    // Cancellation
    cancellationReason: (0, pg_core_1.text)('cancellation_reason'),
    cancelledBy: (0, exports.cancelledByEnum)('cancelled_by'),
    cancellationFee: (0, pg_core_1.numeric)('cancellation_fee', { precision: 10, scale: 2 }).default('0').notNull(),
    // Dispatch & SLA tracking
    dispatchRetryCount: (0, pg_core_1.integer)('dispatch_retry_count').default(0).notNull(),
    slaEscalatedAt: (0, pg_core_1.timestamp)('sla_escalated_at'),
    // Timestamps for each state transition
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    confirmedAt: (0, pg_core_1.timestamp)('confirmed_at'),
    searchingStartedAt: (0, pg_core_1.timestamp)('searching_started_at'),
    partnerAssignedAt: (0, pg_core_1.timestamp)('partner_assigned_at'),
    partnerEnRouteAt: (0, pg_core_1.timestamp)('partner_en_route_at'),
    jobStartedAt: (0, pg_core_1.timestamp)('job_started_at'),
    jobCompletedAt: (0, pg_core_1.timestamp)('job_completed_at'),
    cancelledAt: (0, pg_core_1.timestamp)('cancelled_at'),
}, (t) => ({
    statusIdx: (0, pg_core_1.index)('bookings_status_idx').on(t.status),
    customerIdx: (0, pg_core_1.index)('bookings_customer_idx').on(t.customerId),
    partnerIdx: (0, pg_core_1.index)('bookings_partner_idx').on(t.partnerId),
    createdAtIdx: (0, pg_core_1.index)('bookings_created_at_idx').on(t.createdAt),
    scheduledTimeIdx: (0, pg_core_1.index)('bookings_scheduled_time_idx').on(t.scheduledTime), // For SchedulerWorker polling
}));
// ─── Booking Items (line items: service + addons) ─────────────────────────────
exports.bookingItems = (0, pg_core_1.pgTable)('booking_items', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').notNull().references(() => exports.bookings.id, { onDelete: 'cascade' }),
    itemType: (0, pg_core_1.varchar)('item_type', { length: 30 }).notNull(), // 'service' | 'addon'
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    quantity: (0, pg_core_1.integer)('quantity').default(1).notNull(),
    unitPrice: (0, pg_core_1.numeric)('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: (0, pg_core_1.numeric)('total_price', { precision: 10, scale: 2 }).notNull(),
});
// ─── Offers (dispatch round-robin to top-N partners) ─────────────────────────
exports.offers = (0, pg_core_1.pgTable)('offers', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').notNull().references(() => exports.bookings.id, { onDelete: 'cascade' }),
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull().references(() => partners_js_1.partners.id),
    status: (0, exports.offerStatusEnum)('status').default('pending').notNull(),
    rank: (0, pg_core_1.integer)('rank').notNull(), // 1st, 2nd, 3rd offer
    offerTtl: (0, pg_core_1.integer)('offer_ttl_secs').default(30).notNull(), // 30s instant, 120s scheduled
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    respondedAt: (0, pg_core_1.timestamp)('responded_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    bookingIdx: (0, pg_core_1.index)('offers_booking_idx').on(t.bookingId),
    partnerIdx: (0, pg_core_1.index)('offers_partner_idx').on(t.partnerId),
    statusIdx: (0, pg_core_1.index)('offers_status_idx').on(t.status),
}));
// ─── Booking Status History ───────────────────────────────────────────────────
exports.bookingStatusHistory = (0, pg_core_1.pgTable)('booking_status_history', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').notNull().references(() => exports.bookings.id, { onDelete: 'cascade' }),
    oldStatus: (0, exports.bookingStatusEnum)('old_status'),
    newStatus: (0, exports.bookingStatusEnum)('new_status').notNull(),
    changedById: (0, pg_core_1.uuid)('changed_by_id').references(() => users_js_1.users.id),
    changedByRole: (0, pg_core_1.varchar)('changed_by_role', { length: 20 }),
    note: (0, pg_core_1.text)('note'),
    changedAt: (0, pg_core_1.timestamp)('changed_at').defaultNow().notNull(),
}, (t) => ({
    bookingIdx: (0, pg_core_1.index)('status_history_booking_idx').on(t.bookingId),
}));
// ─── Reviews ─────────────────────────────────────────────────────────────────
exports.reviews = (0, pg_core_1.pgTable)('reviews', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').unique().notNull().references(() => exports.bookings.id),
    customerId: (0, pg_core_1.uuid)('customer_id').notNull().references(() => users_js_1.users.id),
    partnerId: (0, pg_core_1.uuid)('partner_id').references(() => partners_js_1.partners.id),
    serviceId: (0, pg_core_1.uuid)('service_id').notNull().references(() => services_js_1.services.id),
    rating: (0, pg_core_1.integer)('rating').notNull(), // 1–5
    comment: (0, pg_core_1.text)('comment'),
    photos: (0, pg_core_1.jsonb)('photos').default([]).notNull(), // string[]
    partnerReply: (0, pg_core_1.text)('partner_reply'),
    partnerRepliedAt: (0, pg_core_1.timestamp)('partner_replied_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    partnerIdx: (0, pg_core_1.index)('reviews_partner_idx').on(t.partnerId),
}));
// ─── Complaints ───────────────────────────────────────────────────────────────
exports.complaintStatusEnum = (0, pg_core_1.pgEnum)('complaint_status', [
    'open', 'under_review', 'resolved', 'escalated', 'closed',
]);
exports.complaintTypeEnum = (0, pg_core_1.pgEnum)('complaint_type', [
    'behaviour', 'service_quality', 'payment', 'delay', 'safety', 'other',
]);
exports.complaints = (0, pg_core_1.pgTable)('complaints', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)('booking_id').references(() => exports.bookings.id),
    filedById: (0, pg_core_1.uuid)('filed_by_id').notNull().references(() => users_js_1.users.id),
    filedByRole: (0, pg_core_1.varchar)('filed_by_role', { length: 20 }).notNull(),
    complaintType: (0, exports.complaintTypeEnum)('complaint_type').notNull(),
    subject: (0, pg_core_1.varchar)('subject', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    attachments: (0, pg_core_1.jsonb)('attachments').default([]).notNull(),
    status: (0, exports.complaintStatusEnum)('complaint_status').default('open').notNull(),
    resolutionNote: (0, pg_core_1.text)('resolution_note'),
    assignedToAdminId: (0, pg_core_1.uuid)('assigned_to_admin_id').references(() => users_js_1.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at'),
}, (t) => ({
    statusIdx: (0, pg_core_1.index)('complaints_status_idx').on(t.status),
}));
// ─── Relations ────────────────────────────────────────────────────────────────
exports.bookingsRelations = (0, drizzle_orm_1.relations)(exports.bookings, ({ one, many }) => ({
    customer: one(users_js_1.users, { fields: [exports.bookings.customerId], references: [users_js_1.users.id] }),
    partner: one(partners_js_1.partners, { fields: [exports.bookings.partnerId], references: [partners_js_1.partners.id] }),
    service: one(services_js_1.services, { fields: [exports.bookings.serviceId], references: [services_js_1.services.id] }),
    address: one(users_js_2.addresses, { fields: [exports.bookings.addressId], references: [users_js_2.addresses.id] }),
    items: many(exports.bookingItems),
    offers: many(exports.offers),
    statusHistory: many(exports.bookingStatusHistory),
    review: one(exports.reviews, { fields: [exports.bookings.id], references: [exports.reviews.bookingId] }),
    complaint: one(exports.complaints, { fields: [exports.bookings.id], references: [exports.complaints.bookingId] }),
}));
exports.offersRelations = (0, drizzle_orm_1.relations)(exports.offers, ({ one }) => ({
    booking: one(exports.bookings, { fields: [exports.offers.bookingId], references: [exports.bookings.id] }),
    partner: one(partners_js_1.partners, { fields: [exports.offers.partnerId], references: [partners_js_1.partners.id] }),
}));
//# sourceMappingURL=bookings.js.map