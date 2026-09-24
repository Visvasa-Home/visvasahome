"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlags = exports.systemConfigs = void 0;
/**
 * Drizzle Schema — Admin & Configs
 * Layer 4: Data
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users_js_1 = require("./users.js");
exports.systemConfigs = (0, pg_core_1.pgTable)('system_configs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    key: (0, pg_core_1.varchar)('key', { length: 100 }).unique().notNull(), // e.g., 'PLATFORM_COMMISSION_PCT'
    value: (0, pg_core_1.jsonb)('value').notNull(), // can be number, string, array, object
    description: (0, pg_core_1.varchar)('description', { length: 500 }),
    updatedBy: (0, pg_core_1.uuid)('updated_by').references(() => users_js_1.users.id),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.featureFlags = (0, pg_core_1.pgTable)('feature_flags', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    flag: (0, pg_core_1.varchar)('flag', { length: 100 }).unique().notNull(), // e.g., 'ENABLE_AMC_RENEWAL'
    isEnabled: (0, pg_core_1.boolean)('is_enabled').default(false).notNull(),
    updatedBy: (0, pg_core_1.uuid)('updated_by').references(() => users_js_1.users.id),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
//# sourceMappingURL=admin.js.map