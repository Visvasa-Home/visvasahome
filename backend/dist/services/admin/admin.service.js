"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
/**
 * AdminService — Layer 3: Domain Services
 *
 * Manages global system configs, feature flags, and administrative overrides.
 */
const client_js_1 = require("../../db/client.js");
const admin_js_1 = require("../../db/schema/admin.js");
const drizzle_orm_1 = require("drizzle-orm");
class AdminService {
    async getConfig(key) {
        const [config] = await client_js_1.db.select().from(admin_js_1.systemConfigs).where((0, drizzle_orm_1.eq)(admin_js_1.systemConfigs.key, key)).limit(1);
        return config ? config.value : null;
    }
    async setConfig(key, value, adminId, description) {
        await client_js_1.db.insert(admin_js_1.systemConfigs).values({
            key,
            value,
            description,
            updatedBy: adminId,
        }).onConflictDoUpdate({
            target: admin_js_1.systemConfigs.key,
            set: { value, description, updatedBy: adminId, updatedAt: new Date() },
        });
    }
    async getFeatureFlag(flag) {
        const [ff] = await client_js_1.db.select().from(admin_js_1.featureFlags).where((0, drizzle_orm_1.eq)(admin_js_1.featureFlags.flag, flag)).limit(1);
        return ff ? ff.isEnabled : false;
    }
    async toggleFeatureFlag(flag, isEnabled, adminId) {
        await client_js_1.db.insert(admin_js_1.featureFlags).values({
            flag,
            isEnabled,
            updatedBy: adminId,
        }).onConflictDoUpdate({
            target: admin_js_1.featureFlags.flag,
            set: { isEnabled, updatedBy: adminId, updatedAt: new Date() },
        });
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
//# sourceMappingURL=admin.service.js.map