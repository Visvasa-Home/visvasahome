"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceAddonsRelations = exports.servicesRelations = exports.categoriesRelations = exports.notifications = exports.notificationStatusEnum = exports.notificationTypeEnum = exports.coupons = exports.amcPlans = exports.serviceAreas = exports.serviceAddons = exports.services = exports.categories = exports.couponTypeEnum = exports.amcPlanTypeEnum = void 0;
/**
 * Drizzle Schema — Service Catalog, Categories, AMC Plans, Coupons, Service Areas
 * Layer 4: Data
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Enums ───────────────────────────────────────────────────────────────────
exports.amcPlanTypeEnum = (0, pg_core_1.pgEnum)('amc_plan_type', ['basic', 'standard', 'premium']);
exports.couponTypeEnum = (0, pg_core_1.pgEnum)('coupon_type', ['flat', 'percent', 'free_service']);
// ─── Categories ───────────────────────────────────────────────────────────────
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 120 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 120 }).unique().notNull(),
    description: (0, pg_core_1.text)('description'),
    iconUrl: (0, pg_core_1.varchar)('icon_url', { length: 512 }),
    parentId: (0, pg_core_1.uuid)('parent_id'), // self-ref added in relations
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    sortOrder: (0, pg_core_1.integer)('sort_order').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── Services ─────────────────────────────────────────────────────────────────
exports.services = (0, pg_core_1.pgTable)('services', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    categoryId: (0, pg_core_1.uuid)('category_id').notNull().references(() => exports.categories.id),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).unique().notNull(),
    description: (0, pg_core_1.text)('description'),
    skillTag: (0, pg_core_1.varchar)('skill_tag', { length: 100 }),
    basePrice: (0, pg_core_1.numeric)('base_price', { precision: 10, scale: 2 }).notNull(),
    durationMins: (0, pg_core_1.integer)('duration_mins').notNull(),
    estimatedArrivalMins: (0, pg_core_1.integer)('estimated_arrival_mins').default(30).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    isAmcEligible: (0, pg_core_1.boolean)('is_amc_eligible').default(false).notNull(),
    imageUrl: (0, pg_core_1.varchar)('image_url', { length: 512 }),
    sortOrder: (0, pg_core_1.integer)('sort_order').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    categoryIdx: (0, pg_core_1.index)('services_category_idx').on(t.categoryId),
    slugIdx: (0, pg_core_1.uniqueIndex)('services_slug_idx').on(t.slug),
}));
// ─── Service Add-ons ─────────────────────────────────────────────────────────
exports.serviceAddons = (0, pg_core_1.pgTable)('service_addons', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    serviceId: (0, pg_core_1.uuid)('service_id').notNull().references(() => exports.services.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.numeric)('price', { precision: 10, scale: 2 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
});
// ─── Service Areas ───────────────────────────────────────────────────────────
exports.serviceAreas = (0, pg_core_1.pgTable)('service_areas', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 120 }).notNull(),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 100 }).notNull(),
    pincodes: (0, pg_core_1.jsonb)('pincodes').default([]).notNull(), // string[]
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── AMC Plans ───────────────────────────────────────────────────────────────
exports.amcPlans = (0, pg_core_1.pgTable)('amc_plans', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    planType: (0, exports.amcPlanTypeEnum)('plan_type').notNull(),
    price: (0, pg_core_1.numeric)('price', { precision: 10, scale: 2 }).notNull(),
    validityMonths: (0, pg_core_1.integer)('validity_months').notNull(),
    totalVisits: (0, pg_core_1.integer)('total_visits').notNull(),
    applicableServices: (0, pg_core_1.jsonb)('applicable_services').default([]).notNull(), // uuid[]
    benefits: (0, pg_core_1.jsonb)('benefits').default([]).notNull(), // string[]
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ─── Coupons ─────────────────────────────────────────────────────────────────
exports.coupons = (0, pg_core_1.pgTable)('coupons', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).unique().notNull(),
    description: (0, pg_core_1.text)('description'),
    couponType: (0, exports.couponTypeEnum)('coupon_type').notNull(),
    discountValue: (0, pg_core_1.numeric)('discount_value', { precision: 10, scale: 2 }).notNull(),
    minOrderValue: (0, pg_core_1.numeric)('min_order_value', { precision: 10, scale: 2 }).default('0').notNull(),
    maxDiscountCap: (0, pg_core_1.numeric)('max_discount_cap', { precision: 10, scale: 2 }),
    validFrom: (0, pg_core_1.timestamp)('valid_from').notNull(),
    validUntil: (0, pg_core_1.timestamp)('valid_until').notNull(),
    maxUses: (0, pg_core_1.integer)('max_uses'),
    usesPerUser: (0, pg_core_1.integer)('uses_per_user').default(1).notNull(),
    totalUsed: (0, pg_core_1.integer)('total_used').default(0).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    applicableServices: (0, pg_core_1.jsonb)('applicable_services').default([]).notNull(), // [] = all
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    codeIdx: (0, pg_core_1.uniqueIndex)('coupons_code_idx').on(t.code),
}));
// ─── Notifications ────────────────────────────────────────────────────────────
exports.notificationTypeEnum = (0, pg_core_1.pgEnum)('notification_type', ['push', 'sms', 'email', 'in_app']);
exports.notificationStatusEnum = (0, pg_core_1.pgEnum)('notification_status', ['pending', 'sent', 'delivered', 'failed']);
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    body: (0, pg_core_1.text)('body').notNull(),
    type: (0, exports.notificationTypeEnum)('type').default('in_app').notNull(),
    status: (0, exports.notificationStatusEnum)('status').default('pending').notNull(),
    data: (0, pg_core_1.jsonb)('data').default({}).notNull(),
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    sentAt: (0, pg_core_1.timestamp)('sent_at'),
}, (t) => ({
    userIdx: (0, pg_core_1.index)('notifications_user_idx').on(t.userId),
}));
// ─── Relations ────────────────────────────────────────────────────────────────
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ many, one }) => ({
    services: many(exports.services),
    parent: one(exports.categories, { fields: [exports.categories.parentId], references: [exports.categories.id] }),
    children: many(exports.categories),
}));
exports.servicesRelations = (0, drizzle_orm_1.relations)(exports.services, ({ one, many }) => ({
    category: one(exports.categories, { fields: [exports.services.categoryId], references: [exports.categories.id] }),
    addons: many(exports.serviceAddons),
}));
exports.serviceAddonsRelations = (0, drizzle_orm_1.relations)(exports.serviceAddons, ({ one }) => ({
    service: one(exports.services, { fields: [exports.serviceAddons.serviceId], references: [exports.services.id] }),
}));
//# sourceMappingURL=services.js.map