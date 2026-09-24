"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.paginatedOk = paginatedOk;
exports.sendOk = sendOk;
exports.sendCreated = sendCreated;
exports.sendError = sendError;
const errors_js_1 = require("./errors.js");
const zod_1 = require("zod");
// ─── Builders ─────────────────────────────────────────────────────────────────
function ok(data, meta) {
    return { success: true, data, ...(meta ? { meta } : {}) };
}
function paginatedOk(data, page, perPage, total) {
    return ok(data, {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
    });
}
// ─── Fastify reply helpers ────────────────────────────────────────────────────
function sendOk(reply, data, statusCode = 200) {
    void reply.status(statusCode).send(ok(data));
}
function sendCreated(reply, data) {
    void reply.status(201).send(ok(data));
}
function sendError(reply, error) {
    if (error instanceof errors_js_1.AppError) {
        void reply.status(error.statusCode).send({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
        });
        return;
    }
    if (error instanceof zod_1.ZodError) {
        void reply.status(400).send({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: error.issues,
            },
        });
        return;
    }
    // Unknown error — don't leak details in production
    const msg = process.env.NODE_ENV === 'development' ? error.message : 'Internal server error';
    void reply.status(500).send({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: msg },
    });
}
//# sourceMappingURL=response.js.map