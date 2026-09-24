"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneSchema = exports.uuidSchema = exports.paginationSchema = void 0;
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.parseBody = parseBody;
exports.parseQuery = parseQuery;
const zod_1 = require("zod");
const response_js_1 = require("../../lib/response.js");
// ─── Validate factory ─────────────────────────────────────────────────────────
function validateBody(schema) {
    return async function (request, reply) {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            return (0, response_js_1.sendError)(reply, result.error);
        }
        request.validatedBody = result.data;
    };
}
function validateQuery(schema) {
    return async function (request, reply) {
        const result = schema.safeParse(request.query);
        if (!result.success) {
            return (0, response_js_1.sendError)(reply, result.error);
        }
        request.validatedQuery = result.data;
    };
}
// ─── Parse & throw on error (use inside handler body) ────────────────────────
function parseBody(schema, request) {
    return schema.parse(request.body);
}
function parseQuery(schema, request) {
    return schema.parse(request.query);
}
// ─── Common reusable schemas ──────────────────────────────────────────────────
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    perPage: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.uuidSchema = zod_1.z.string().uuid('Must be a valid UUID');
exports.phoneSchema = zod_1.z
    .string()
    .regex(/^\d{10}$/, 'Phone must be 10 digits');
//# sourceMappingURL=validate.js.map