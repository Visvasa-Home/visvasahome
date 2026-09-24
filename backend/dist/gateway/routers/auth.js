"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = authRouter;
const zod_1 = require("zod");
const client_js_1 = require("../../db/client.js");
const users_js_1 = require("../../db/schema/users.js");
const jwt_js_1 = require("../../lib/jwt.js");
const response_js_1 = require("../../lib/response.js");
const validate_js_1 = require("../middleware/validate.js");
const errors_js_1 = require("../../lib/errors.js");
const identity_service_js_1 = require("../../services/identity/identity.service.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── Schemas ──────────────────────────────────────────────────────────────────
const sendOtpSchema = zod_1.z.object({
    phone: validate_js_1.phoneSchema,
    role: zod_1.z.enum(['customer', 'partner', 'contractor']).default('customer'),
});
const verifyOtpSchema = zod_1.z.object({
    phone: validate_js_1.phoneSchema,
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits'),
    name: zod_1.z.string().min(2).max(120).optional(),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
// ─── Router ───────────────────────────────────────────────────────────────────
async function authRouter(fastify) {
    // POST /api/v1/auth/send-otp
    fastify.post('/send-otp', {
        config: {
            rateLimit: {
                max: 3, // Max 3 OTP requests
                timeWindow: '1 minute'
            }
        }
    }, async (request, reply) => {
        const { phone } = (0, validate_js_1.parseBody)(sendOtpSchema, request);
        await identity_service_js_1.identityService.sendLoginOtp(phone);
        return (0, response_js_1.sendOk)(reply, { message: 'OTP sent', phone });
    });
    // POST /api/v1/auth/verify-otp  (login or register)
    fastify.post('/verify-otp', {
        config: {
            rateLimit: {
                max: 5, // Max 5 verification attempts
                timeWindow: '1 minute'
            }
        }
    }, async (request, reply) => {
        const { phone, otp, name } = (0, validate_js_1.parseBody)(verifyOtpSchema, request);
        const result = await identity_service_js_1.identityService.verifyLoginOtp(phone, otp, name);
        return (0, response_js_1.sendOk)(reply, {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: {
                id: result.user.id,
                name: result.user.name,
                phone: result.user.phone,
                role: result.user.role,
            },
        });
    });
    // POST /api/v1/auth/refresh
    fastify.post('/refresh', async (request, reply) => {
        const { refreshToken } = (0, validate_js_1.parseBody)(refreshSchema, request);
        const payload = await (0, jwt_js_1.verifyToken)(refreshToken);
        // Validate session exists
        const [session] = await client_js_1.db.select().from(users_js_1.sessions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_js_1.sessions.refreshToken, refreshToken), (0, drizzle_orm_1.eq)(users_js_1.sessions.userId, payload.sub))).limit(1);
        if (!session || session.expiresAt < new Date()) {
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.tokenExpired());
        }
        const newAccessToken = await (0, jwt_js_1.signAccessToken)({
            sub: payload.sub,
            role: payload.role,
            adminRole: payload.adminRole,
            phone: payload.phone,
        });
        return (0, response_js_1.sendOk)(reply, { accessToken: newAccessToken });
    });
    // POST /api/v1/auth/logout
    fastify.post('/logout', {
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const { refreshToken } = (0, validate_js_1.parseBody)(zod_1.z.object({ refreshToken: zod_1.z.string() }), request);
        await client_js_1.db.delete(users_js_1.sessions).where((0, drizzle_orm_1.eq)(users_js_1.sessions.refreshToken, refreshToken));
        return { success: true };
    });
    // GET /api/v1/auth/me
    fastify.get('/me', {
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const [user] = await client_js_1.db.select({
            id: users_js_1.users.id, name: users_js_1.users.name, phone: users_js_1.users.phone,
            email: users_js_1.users.email, role: users_js_1.users.role, isActive: users_js_1.users.isActive,
        }).from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, request.user.sub)).limit(1);
        if (!user)
            return (0, response_js_1.sendError)(reply, errors_js_1.Errors.notFound('User'));
        return (0, response_js_1.sendOk)(reply, user);
    });
}
//# sourceMappingURL=auth.js.map