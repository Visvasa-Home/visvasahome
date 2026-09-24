"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditAdminAction = auditAdminAction;
const client_js_1 = require("../../db/client.js");
const users_js_1 = require("../../db/schema/users.js");
const logger_js_1 = require("../../lib/logger.js");
const node_crypto_1 = __importDefault(require("node:crypto"));
const encryption_js_1 = require("../../lib/encryption.js");
/**
 * Audit log hook
 * Intended to be used via onResponse or preHandler to log admin actions
 */
async function auditAdminAction(request, reply) {
    const user = request.user;
    // Only log if the user is an admin and the request modifies data (POST, PUT, PATCH, DELETE)
    if (!user || user.role !== 'admin')
        return;
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method))
        return;
    try {
        let payload = request.body ? JSON.stringify(request.body) : null;
        // Encrypt sensitive payloads at rest using AES-256-GCM
        if (payload) {
            payload = await encryption_js_1.encryptionService.encrypt(payload);
        }
        const signature = node_crypto_1.default.createHash('sha256').update(`${user.sub}:${request.url}:${Date.now()}`).digest('hex');
        await client_js_1.db.insert(users_js_1.auditLogs).values({
            eventType: request.method,
            userId: user.sub,
            service: request.url,
            ipAddress: request.ip,
            payload: payload,
            signature: signature,
        });
    }
    catch (err) {
        logger_js_1.logger.error({ err, adminId: user.sub }, '[audit] Failed to write audit log');
    }
}
//# sourceMappingURL=audit.js.map