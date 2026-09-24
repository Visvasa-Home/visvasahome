"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMiddleware = void 0;
const logger_js_1 = require("../../lib/logger.js");
const tenantMiddleware = async (request, reply) => {
    // Multi-Tenancy: Extract tenant from headers, defaults to 'default'
    const tenantId = request.headers['x-tenant-id'] || 'default';
    // Attach to request
    request.tenantId = tenantId;
    // Optional: We can validate if the tenantId is known/active in a distributed cache.
    // For now, we trust the gateway or simply accept it to partition the data logically.
    // We can attach a child logger specifically tagged with the tenant
    request.log = logger_js_1.logger.child({ tenantId });
};
exports.tenantMiddleware = tenantMiddleware;
//# sourceMappingURL=tenant.js.map