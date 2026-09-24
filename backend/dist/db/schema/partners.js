"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerServicesRelations = exports.partnerDocumentsRelations = exports.partnersRelations = exports.partnerAvailabilitySlots = exports.partnerLocations = exports.partnerDocuments = exports.partnerServices = exports.partners = exports.geometry = exports.employmentTypeEnum = exports.interviewStatusEnum = exports.kycStatusEnum = exports.documentStatusEnum = exports.documentTypeEnum = exports.workStatusEnum = exports.careerLevelEnum = exports.partnerStatusEnum = void 0;
/**
 * Drizzle Schema — Partners, Partner Services, Documents, Location, KYC
 * Layer 4: Data
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const users_js_1 = require("./users.js");
const services_js_1 = require("./services.js");
// ─── Enums ───────────────────────────────────────────────────────────────────
exports.partnerStatusEnum = (0, pg_core_1.pgEnum)('partner_status', [
    'pending', 'kyc_submitted', 'active', 'suspended', 'blocked', 'rejected',
]);
exports.careerLevelEnum = (0, pg_core_1.pgEnum)('career_level', ['onboarding', 'sme', 'trainer']);
exports.workStatusEnum = (0, pg_core_1.pgEnum)('work_status', ['available', 'on_job', 'offline']);
exports.documentTypeEnum = (0, pg_core_1.pgEnum)('document_type', [
    'aadhaar', 'pan', 'driving_license', 'bank_passbook', 'profile_photo', 'police_clearance',
]);
exports.documentStatusEnum = (0, pg_core_1.pgEnum)('document_status', ['pending', 'approved', 'rejected']);
exports.kycStatusEnum = (0, pg_core_1.pgEnum)('kyc_status', ['pending', 'verified', 'rejected']);
exports.interviewStatusEnum = (0, pg_core_1.pgEnum)('interview_status', ['scheduled', 'passed', 'failed']);
exports.employmentTypeEnum = (0, pg_core_1.pgEnum)('employment_type', ['part_time', 'full_time']);
// PostGIS Geometry Type for Drizzle
exports.geometry = (0, pg_core_1.customType)({
    dataType() {
        return 'geometry(Point, 4326)';
    },
    toDriver(val) {
        return `SRID=4326;POINT(${val.coordinates[0]} ${val.coordinates[1]})`;
    },
    fromDriver(value) {
        // Basic string parsing or rely on raw driver output depending on pg parser
        // We'll keep it simple: assuming the query uses ST_AsGeoJSON
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
});
// ─── Partners ─────────────────────────────────────────────────────────────────
exports.partners = (0, pg_core_1.pgTable)('partners', {
    id: (0, pg_core_1.uuid)('id').primaryKey().references(() => users_js_1.users.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.varchar)('name', { length: 120 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 15 }).unique().notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique(),
    status: (0, exports.partnerStatusEnum)('status').default('pending').notNull(),
    encryptedAadhaar: (0, pg_core_1.varchar)('encrypted_aadhaar', { length: 512 }),
    encryptedPan: (0, pg_core_1.varchar)('encrypted_pan', { length: 512 }),
    kycWorkflowId: (0, pg_core_1.varchar)('kyc_workflow_id', { length: 255 }),
    kycStatus: (0, exports.kycStatusEnum)('kyc_status').default('pending').notNull(),
    interviewScheduledAt: (0, pg_core_1.timestamp)('interview_scheduled_at'),
    interviewStatus: (0, exports.interviewStatusEnum)('interview_status'),
    interviewNotes: (0, pg_core_1.text)('interview_notes'),
    backgroundCheckPassed: (0, pg_core_1.boolean)('background_check_passed').default(false).notNull(),
    isAvailable: (0, pg_core_1.boolean)('is_available').default(false).notNull(),
    workStatus: (0, exports.workStatusEnum)('work_status').default('offline').notNull(),
    employmentType: (0, exports.employmentTypeEnum)('employment_type'),
    skillTags: (0, pg_core_1.jsonb)('skill_tags').default([]).notNull(), // string[]
    serviceAreas: (0, pg_core_1.jsonb)('service_areas').default([]).notNull(), // string[] (city/pincode)
    workingHoursStart: (0, pg_core_1.time)('working_hours_start'),
    workingHoursEnd: (0, pg_core_1.time)('working_hours_end'),
    calendarBlocks: (0, pg_core_1.jsonb)('calendar_blocks').default([]).notNull(), // Array of { start: string, end: string }
    bio: (0, pg_core_1.text)('bio'),
    basePrice: (0, pg_core_1.numeric)('base_price', { precision: 10, scale: 2 }),
    jobsCompleted: (0, pg_core_1.integer)('jobs_completed').default(0).notNull(),
    careerLevel: (0, exports.careerLevelEnum)('career_level').default('onboarding').notNull(),
    rating: (0, pg_core_1.real)('rating').default(0).notNull(),
    totalRatings: (0, pg_core_1.integer)('total_ratings').default(0).notNull(),
    completionRate: (0, pg_core_1.real)('completion_rate').default(0).notNull(),
    acceptanceRate: (0, pg_core_1.real)('acceptance_rate').default(0).notNull(),
    walletBalance: (0, pg_core_1.numeric)('wallet_balance', { precision: 12, scale: 2 }).default('0').notNull(),
    bankAccountNumber: (0, pg_core_1.varchar)('bank_account_number', { length: 512 }), // encrypted
    bankIfsc: (0, pg_core_1.varchar)('bank_ifsc', { length: 20 }),
    upiId: (0, pg_core_1.varchar)('upi_id', { length: 100 }),
    contractorId: (0, pg_core_1.uuid)('contractor_id'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    statusIdx: (0, pg_core_1.index)('partners_status_idx').on(t.status),
    workStatusIdx: (0, pg_core_1.index)('partners_work_status_idx').on(t.workStatus),
}));
// ─── Partner ↔ Service many-to-many ──────────────────────────────────────────
exports.partnerServices = (0, pg_core_1.pgTable)('partner_services', {
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull().references(() => exports.partners.id, { onDelete: 'cascade' }),
    serviceId: (0, pg_core_1.uuid)('service_id').notNull().references(() => services_js_1.services.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: (0, pg_core_1.uniqueIndex)('partner_services_pk').on(t.partnerId, t.serviceId),
}));
// ─── Partner Documents ───────────────────────────────────────────────────────
exports.partnerDocuments = (0, pg_core_1.pgTable)('partner_documents', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull().references(() => exports.partners.id, { onDelete: 'cascade' }),
    documentType: (0, exports.documentTypeEnum)('document_type').notNull(),
    fileUrl: (0, pg_core_1.varchar)('file_url', { length: 512 }).notNull(),
    status: (0, exports.documentStatusEnum)('status').default('pending').notNull(),
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    reviewedAt: (0, pg_core_1.timestamp)('reviewed_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    partnerIdx: (0, pg_core_1.index)('partner_documents_partner_idx').on(t.partnerId),
}));
// ─── Partner Locations (persisted DB snapshot; live loc is in Redis) ──────────
exports.partnerLocations = (0, pg_core_1.pgTable)('partner_locations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    partnerId: (0, pg_core_1.uuid)('partner_id').unique().notNull().references(() => exports.partners.id, { onDelete: 'cascade' }),
    geom: (0, exports.geometry)('geom'),
    accuracy: (0, pg_core_1.real)('accuracy'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ─── Partner Availability Slots ───────────────────────────────────────────────
exports.partnerAvailabilitySlots = (0, pg_core_1.pgTable)('partner_availability_slots', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    partnerId: (0, pg_core_1.uuid)('partner_id').notNull().references(() => exports.partners.id, { onDelete: 'cascade' }),
    date: (0, pg_core_1.varchar)('date', { length: 10 }).notNull(), // YYYY-MM-DD
    slotStart: (0, pg_core_1.time)('slot_start').notNull(),
    slotEnd: (0, pg_core_1.time)('slot_end').notNull(),
    isBooked: (0, pg_core_1.boolean)('is_booked').default(false).notNull(),
    bookingId: (0, pg_core_1.uuid)('booking_id'),
}, (t) => ({
    partnerDateIdx: (0, pg_core_1.index)('slots_partner_date_idx').on(t.partnerId, t.date),
}));
// ─── Relations ────────────────────────────────────────────────────────────────
exports.partnersRelations = (0, drizzle_orm_1.relations)(exports.partners, ({ one, many }) => ({
    user: one(users_js_1.users, { fields: [exports.partners.id], references: [users_js_1.users.id] }),
    documents: many(exports.partnerDocuments),
    partnerServices: many(exports.partnerServices),
    location: one(exports.partnerLocations, { fields: [exports.partners.id], references: [exports.partnerLocations.partnerId] }),
    availabilitySlots: many(exports.partnerAvailabilitySlots),
}));
exports.partnerDocumentsRelations = (0, drizzle_orm_1.relations)(exports.partnerDocuments, ({ one }) => ({
    partner: one(exports.partners, { fields: [exports.partnerDocuments.partnerId], references: [exports.partners.id] }),
}));
exports.partnerServicesRelations = (0, drizzle_orm_1.relations)(exports.partnerServices, ({ one }) => ({
    partner: one(exports.partners, { fields: [exports.partnerServices.partnerId], references: [exports.partners.id] }),
    service: one(services_js_1.services, { fields: [exports.partnerServices.serviceId], references: [services_js_1.services.id] }),
}));
//# sourceMappingURL=partners.js.map