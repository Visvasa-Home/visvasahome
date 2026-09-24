"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requireAdminRole = requireAdminRole;
exports.requireOwnership = requireOwnership;
const errors_js_1 = require("../../lib/errors.js");
const response_js_1 = require("../../lib/response.js");
// ─── Role guard factory ───────────────────────────────────────────────────────
function requireRole(...roles) {
    return async function (request, reply) {
        const user = request.user;
        if (!user) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.unauthorized());
        }
        if (!roles.includes(user.role)) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden(`Requires role: ${roles.join(' or ')}. Your role: ${user.role}`));
        }
    };
}
// ─── Admin role guard ─────────────────────────────────────────────────────────
function requireAdminRole(...adminRoles) {
    return async function (request, reply) {
        const user = request.user;
        if (!user || user.role !== 'admin') {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('Admin access required'));
        }
        // SUPER_ADMIN bypasses all sub-role restrictions
        if (user.adminRole === 'super_admin')
            return;
        if (!user.adminRole || !adminRoles.includes(user.adminRole)) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden(`Requires admin role: ${adminRoles.join(' or ')}`));
        }
    };
}
// ─── Ownership guard (customer owns the resource) ────────────────────────────
function requireOwnership(getResourceUserId) {
    return async function (request, reply) {
        const user = request.user;
        if (!user)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.unauthorized());
        if (user.role === 'admin')
            return; // admin can access anything
        const resourceUserId = getResourceUserId(request);
        if (!resourceUserId || resourceUserId !== user.sub) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.forbidden('You do not own this resource'));
        }
    };
}
//# sourceMappingURL=rbac.js.map