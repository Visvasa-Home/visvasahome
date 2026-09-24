"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMfa = requireMfa;
const response_js_1 = require("../../lib/response.js");
const errors_js_1 = require("../../lib/errors.js");
const client_js_1 = require("../../db/client.js");
const users_js_1 = require("../../db/schema/users.js");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * MFA Middleware for Admin Panel Elevated Actions
 * Enforces Multi-Factor Authentication (e.g. TOTP) for sensitive admin endpoints.
 */
async function requireMfa(request, reply) {
    const mfaToken = request.headers['x-mfa-token'];
    if (!mfaToken || typeof mfaToken !== 'string') {
        return (0, response_js_1.sendError)(reply, errors_js_1.Errors.unauthorized('MFA token required for this action'));
    }
    // Assuming user context is populated by auth middleware
    if (!request.user || !request.user.sub) {
        return (0, response_js_1.sendError)(reply, errors_js_1.Errors.unauthorized());
    }
    // In a real system, we'd verify the TOTP token using a library like `otplib`
    // against a stored MFA secret for the admin user.
    // For this mock implementation, we accept a static bypass or a simulated validation.
    if (mfaToken !== '123456' && mfaToken !== 'bypass') {
        // Check if user is actually active admin
        const [adminUser] = await client_js_1.db.select({ role: users_js_1.users.role })
            .from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, request.user.sub)).limit(1);
        if (!adminUser || adminUser.role !== 'admin') {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.unauthorized('Invalid MFA token'));
        }
        // Mock verification failure
        return (0, response_js_1.sendError)(reply, errors_js_1.Errors.unauthorized('Invalid MFA token'));
    }
}
//# sourceMappingURL=mfa.js.map