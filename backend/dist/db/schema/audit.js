"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_js_1 = require("./users.js");
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    adminId: (0, pg_core_1.uuid)('admin_id').references(() => users_js_1.users.id).notNull(),
    action: (0, pg_core_1.varchar)('action', { length: 255 }).notNull(),
    targetResource: (0, pg_core_1.varchar)('target_resource', { length: 255 }).notNull(),
    payload: (0, pg_core_1.jsonb)('payload'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
//# sourceMappingURL=audit.js.map