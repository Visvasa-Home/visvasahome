"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
/**
 * Fastify Server — Layer 2: API Gateway
 *
 * Registers:
 *   - Plugins: CORS, Helmet, Rate Limit, Auth
 *   - Routers: auth, catalog, customer, partner, contractor, admin, webhooks
 *   - Global error handler (uniform envelope)
 *
 * All routes versioned under /api/v1/*
 */
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const env_js_1 = require("../env.js");
const redis_js_1 = require("../lib/redis.js");
const logger_js_1 = require("../lib/logger.js");
const response_js_1 = require("../lib/response.js");
const errors_js_1 = require("../lib/errors.js");
const zod_1 = require("zod");
const auth_js_1 = __importDefault(require("./middleware/auth.js"));
const tenant_js_1 = require("./middleware/tenant.js");
const auth_js_2 = require("./routers/auth.js");
const catalog_js_1 = require("./routers/catalog.js");
const customer_js_1 = require("./routers/customer.js");
const partner_js_1 = require("./routers/partner.js");
const contractor_js_1 = require("./routers/contractor.js");
const admin_js_1 = require("./routers/admin.js");
const webhooks_js_1 = require("./routers/webhooks.js");
const payments_js_1 = require("./routers/payments.js");
const chat_js_1 = require("./routers/chat.js");
const location_js_1 = require("./routers/location.js");
const metrics_js_1 = require("./routers/metrics.js");
const monitoring_js_1 = require("./routers/monitoring.js");
const wallet_js_1 = require("./routers/wallet.js");
const call_js_1 = require("./routers/call.js");
const client_js_1 = require("../db/client.js");
const redis_js_2 = require("../lib/redis.js");
const websocket_1 = __importDefault(require("@fastify/websocket"));
// ─── Server factory ───────────────────────────────────────────────────────────
async function buildServer() {
    const app = (0, fastify_1.default)({
        logger: {
            transport: {
                target: 'pino-pretty',
            },
            level: env_js_1.env.NODE_ENV === 'development' ? 'debug' : 'info',
        },
        trustProxy: true,
        bodyLimit: 1_048_576, // 1 MB
    });
    // ── Swagger / OpenAPI ─────────────────────────────────────────────────────────
    await app.register(swagger_1.default, {
        openapi: {
            info: { title: 'VisvasaHome API', description: 'VisvasaHome Layered Backend API', version: '2.0.0' },
            components: {
                securitySchemes: {
                    bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                },
            },
        },
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: { docExpansion: 'list', deepLinking: false },
        staticCSP: true,
    });
    // ── Security ──────────────────────────────────────────────────────────────────
    await app.register(helmet_1.default, {
        contentSecurityPolicy: false, // managed externally for APIs
    });
    await app.register(cors_1.default, {
        origin: env_js_1.env.CORS_ORIGINS.split(','),
        credentials: true,
    });
    // Websocket plugin
    await app.register(websocket_1.default);
    // Redis-backed rate limit
    await app.register(rate_limit_1.default, {
        redis: redis_js_1.redis,
        max: parseInt(env_js_1.env.RATE_LIMIT_PER_MINUTE, 10),
        timeWindow: '1 minute',
        keyGenerator: (req) => {
            if (req.user?.sub)
                return `user:${req.user.sub}`;
            return `ip:${req.ip}`;
        },
        errorResponseBuilder: () => ({
            success: false,
            error: { code: 'RATE_LIMITED', message: 'Too many requests. Slow down.' },
        }),
    });
    // ── Auth & Tenant plugins ────────────────────────────────────────────────────────
    // Register tenant middleware globally (before auth)
    app.addHook('preHandler', tenant_js_1.tenantMiddleware);
    await app.register(auth_js_1.default);
    // ── GraphQL Plugin ────────────────────────────────────────────────────────────
    const mercurius = (await import('mercurius')).default;
    const { schema } = await import('./graphql/schema.js');
    const { resolvers } = await import('./graphql/resolvers.js');
    await app.register(mercurius, {
        schema,
        resolvers,
        path: '/graphql',
        graphiql: true,
        context: (request) => {
            // The authPlugin populates request.user if the Bearer token is valid
            return {
                user: request.user
            };
        }
    });
    // ── Prometheus Metrics Hook ───────────────────────────────────────────────────
    app.addHook('onRequest', (request, reply, done) => {
        request.startTime = process.hrtime();
        done();
    });
    app.addHook('onResponse', (request, reply, done) => {
        const startTime = request.startTime;
        if (startTime) {
            const diff = process.hrtime(startTime);
            const duration = diff[0] + diff[1] / 1e9;
            metrics_js_1.httpRequestDurationMicroseconds
                .labels(request.method, request.routerPath || 'unknown', String(reply.statusCode))
                .observe(duration);
        }
        done();
    });
    // ── Global error handler (uniform error envelope) ────────────────────────────
    app.setErrorHandler((error, _request, reply) => {
        logger_js_1.logger.error({ err: error }, '[server] Unhandled error');
        if (error instanceof errors_js_1.AppError || error instanceof zod_1.ZodError) {
            return (0, response_js_1.sendError)(reply, error);
        }
        // Fastify validation errors
        if (error.validation) {
            return reply.status(400).send({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: error.validation,
                },
            });
        }
        return (0, response_js_1.sendError)(reply, error);
    });
    // 404 handler
    app.setNotFoundHandler((_request, reply) => {
        return reply.status(404).send({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Route not found' },
        });
    });
    // ── Health & Metrics ──────────────────────────────────────────────────────────
    app.get('/health', async (_req, reply) => {
        const [db, redisOk] = await Promise.all([(0, client_js_1.checkDbHealth)(), (0, redis_js_2.checkRedisHealth)()]);
        const status = db && redisOk ? 'healthy' : 'degraded';
        return reply.status(db && redisOk ? 200 : 503).send({
            success: db && redisOk,
            data: { status, database: db, redis: redisOk, version: '2.0.0' },
        });
    });
    await app.register(metrics_js_1.metricsRouter);
    // ── Version prefix ────────────────────────────────────────────────────────────
    // All API routes under /api/v1
    await app.register(async (v1) => {
        // Public routes (no auth)
        await v1.register(auth_js_2.authRouter, { prefix: '/auth' });
        await v1.register(catalog_js_1.catalogRouter, { prefix: '/catalog' });
        await v1.register(webhooks_js_1.webhooksRouter, { prefix: '/webhooks' });
        await v1.register(payments_js_1.paymentsRouter, { prefix: '/payments' }); // satisfies /api/v1/payments/webhook
        // Role-scoped routes
        await v1.register(customer_js_1.customerRouter, { prefix: '/customer' });
        await v1.register(partner_js_1.partnerRouter, { prefix: '/partner' });
        await v1.register(contractor_js_1.contractorRouter, { prefix: '/contractor' });
        await v1.register(admin_js_1.adminRouter, { prefix: '/admin' });
        // Chat & Real-Time
        await v1.register(chat_js_1.chatRouter, { prefix: '/chat' });
        await v1.register(location_js_1.locationRouter, { prefix: '/location' });
        // Admin monitoring (SSE stream + surge override)
        await v1.register(monitoring_js_1.monitoringRouter, { prefix: '/admin/monitoring' });
        // Wallet & referrals
        await v1.register(wallet_js_1.walletRouter, { prefix: '/wallet' });
        // Call Masking
        await v1.register(call_js_1.callRouter, { prefix: '/call' });
        await v1.register(call_js_1.twilioWebhookRouter, { prefix: '/webhooks/twilio' });
    }, { prefix: '/api/v1' });
    return app;
}
//# sourceMappingURL=server.js.map