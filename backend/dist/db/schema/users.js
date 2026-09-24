"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmTokensRelations = exports.sessionsRelations = exports.addressesRelations = exports.usersRelations = exports.fcmTokens = exports.auditLogs = exports.addresses = exports.sessions = exports.users = exports.genderEnum = exports.adminRoleEnum = exports.roleEnum = void 0;
/**
 * Drizzle Schema — Users, Sessions, Addresses
 * Layer 4: Data
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Enums ───────────────────────────────────────────────────────────────────
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['customer', 'partner', 'contractor', 'admin']);
exports.adminRoleEnum = (0, pg_core_1.pgEnum)('admin_role', [
    'super_admin', 'operations_admin', 'partner_admin',
    'customer_support', 'finance_admin', 'service_admin', 'analytics_admin',
]);
exports.genderEnum = (0, pg_core_1.pgEnum)('gender', ['male', 'female', 'other']);
// ─── Users ───────────────────────────────────────────────────────────────────
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    phone: (0, pg_core_1.varchar)('phone', { length: 15 }).unique().notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }), // bcrypt hashed password
    name: (0, pg_core_1.varchar)('name', { length: 120 }).notNull(),
    role: (0, exports.roleEnum)('role').default('customer').notNull(),
    adminRole: (0, exports.adminRoleEnum)('admin_role'),
    gender: (0, exports.genderEnum)('gender'),
    profilePictureUrl: (0, pg_core_1.varchar)('profile_picture_url', { length: 512 }),
    fcmToken: (0, pg_core_1.varchar)('fcm_token', { length: 512 }),
    preferredLocale: (0, pg_core_1.varchar)('preferred_locale', { length: 10 }).default('en').notNull(),
    tenantId: (0, pg_core_1.varchar)('tenant_id', { length: 50 }).default('default').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    phoneIdx: (0, pg_core_1.uniqueIndex)('users_phone_idx').on(t.phone),
    emailIdx: (0, pg_core_1.index)('users_email_idx').on(t.email),
}));
// ─── Sessions ────────────────────────────────────────────────────────────────
exports.sessions = (0, pg_core_1.pgTable)('sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    refreshToken: (0, pg_core_1.text)('refresh_token').unique().notNull(),
    deviceInfo: (0, pg_core_1.text)('device_info'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 50 }),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    userIdx: (0, pg_core_1.index)('sessions_user_idx').on(t.userId),
}));
// ─── Addresses ───────────────────────────────────────────────────────────────
exports.addresses = (0, pg_core_1.pgTable)('addresses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    label: (0, pg_core_1.varchar)('label', { length: 60 }), // Home / Work / Other
    addressLine: (0, pg_core_1.varchar)('address_line', { length: 512 }).notNull(),
    landmark: (0, pg_core_1.varchar)('landmark', { length: 256 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)('state', { length: 100 }).notNull(),
    pincode: (0, pg_core_1.varchar)('pincode', { length: 10 }).notNull(),
    latitude: (0, pg_core_1.varchar)('latitude', { length: 20 }), // stored as string for precision
    longitude: (0, pg_core_1.varchar)('longitude', { length: 20 }),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    userIdx: (0, pg_core_1.index)('addresses_user_idx').on(t.userId),
}));
// ─── Audit Logs ──────────────────────────────────────────────────────────────
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    eventType: (0, pg_core_1.varchar)('event_type', { length: 100 }).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id),
    service: (0, pg_core_1.varchar)('service', { length: 100 }).notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 50 }),
    payload: (0, pg_core_1.text)('payload'), // JSON string
    signature: (0, pg_core_1.varchar)('signature', { length: 512 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (t) => ({
    eventIdx: (0, pg_core_1.index)('audit_event_type_idx').on(t.eventType),
    tsIdx: (0, pg_core_1.index)('audit_created_at_idx').on(t.createdAt),
}));
// ─── FCM Tokens (multi-device push token registry) ───────────────────────────
exports.fcmTokens = (0, pg_core_1.pgTable)('fcm_tokens', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    token: (0, pg_core_1.varchar)('token', { length: 512 }).unique().notNull(),
    platform: (0, pg_core_1.varchar)('platform', { length: 10 }).notNull().default('android'), // 'android' | 'ios' | 'web'
    deviceId: (0, pg_core_1.varchar)('device_id', { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    userIdx: (0, pg_core_1.index)('fcm_tokens_user_idx').on(t.userId),
    tokenIdx: (0, pg_core_1.index)('fcm_tokens_token_idx').on(t.token),
}));
// ─── Relations ────────────────────────────────────────────────────────────────
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    sessions: many(exports.sessions),
    addresses: many(exports.addresses),
    fcmTokens: many(exports.fcmTokens),
}));
exports.addressesRelations = (0, drizzle_orm_1.relations)(exports.addresses, ({ one }) => ({
    user: one(exports.users, { fields: [exports.addresses.userId], references: [exports.users.id] }),
}));
exports.sessionsRelations = (0, drizzle_orm_1.relations)(exports.sessions, ({ one }) => ({
    user: one(exports.users, { fields: [exports.sessions.userId], references: [exports.users.id] }),
}));
exports.fcmTokensRelations = (0, drizzle_orm_1.relations)(exports.fcmTokens, ({ one }) => ({
    user: one(exports.users, { fields: [exports.fcmTokens.userId], references: [exports.users.id] }),
}));
//# sourceMappingURL=users.js.map