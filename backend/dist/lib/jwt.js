"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyToken = verifyToken;
exports.extractBearer = extractBearer;
/**
 * JWT Utilities — Shared Lib
 * Uses jose (JOSE standard) for ES256 or HS256 JWT sign/verify.
 *
 * In production: set JWT_ALGORITHM=ES256 and provide JWT_PRIVATE_KEY / JWT_PUBLIC_KEY (PEM)
 * In dev: falls back to HS256 with JWT_SECRET
 */
const jose_1 = require("jose");
const errors_js_1 = require("./errors.js");
const env_js_1 = require("../env.js");
const JWT_SECRET = env_js_1.env.JWT_SECRET;
const ACCESS_TTL = '15m';
const REFRESH_TTL = '30d';
const ISSUER = 'visvasahome';
const AUDIENCE = 'visvasahome-api';
// ─── Key (HS256 in dev) ───────────────────────────────────────────────────────
function getKey() {
    return new TextEncoder().encode(JWT_SECRET);
}
// ─── Sign ─────────────────────────────────────────────────────────────────────
async function signAccessToken(payload) {
    return new jose_1.SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(ACCESS_TTL)
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .sign(getKey());
}
async function signRefreshToken(payload) {
    return new jose_1.SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(REFRESH_TTL)
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .sign(getKey());
}
// ─── Verify ───────────────────────────────────────────────────────────────────
async function verifyToken(token) {
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, getKey(), {
            issuer: ISSUER,
            audience: AUDIENCE,
        });
        return payload;
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('expired'))
            throw errors_js_1.Errors.tokenExpired();
        throw errors_js_1.Errors.unauthorized('Invalid token');
    }
}
// ─── Extract Bearer ───────────────────────────────────────────────────────────
function extractBearer(authHeader) {
    if (!authHeader?.startsWith('Bearer ')) {
        throw errors_js_1.Errors.unauthorized('Missing Bearer token');
    }
    return authHeader.slice(7);
}
//# sourceMappingURL=jwt.js.map