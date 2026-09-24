"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
require("dotenv/config");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    TS_PORT: zod_1.z.string().default('4000'),
    HOST: zod_1.z.string().default('0.0.0.0'),
    AUTH_DB_URL: zod_1.z.string().url(),
    USER_DB_URL: zod_1.z.string().url(),
    PROVIDER_DB_URL: zod_1.z.string().url(),
    CATALOG_DB_URL: zod_1.z.string().url(),
    BOOKING_DB_URL: zod_1.z.string().url(),
    PAYMENT_DB_URL: zod_1.z.string().url(),
    RATING_DB_URL: zod_1.z.string().url(),
    OUTBOX_DB_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    RATE_LIMIT_PER_MINUTE: zod_1.z.string().default('100'),
    OTP_TTL_SECS: zod_1.z.string().default('300'),
    CORS_ORIGINS: zod_1.z.string().default('http://localhost:3000'),
    // Feature Flags
    FEATURE_REALTIME_DISPATCH: zod_1.z.enum(['true', 'false']).default('false'),
    FEATURE_INSTANT_BOOKING: zod_1.z.enum(['true', 'false']).default('true'),
    FEATURE_GRAPHQL_BFF: zod_1.z.enum(['true', 'false']).default('false'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('Invalid environment variables:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
//# sourceMappingURL=env.js.map