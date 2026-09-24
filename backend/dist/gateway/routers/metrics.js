"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequestDurationMicroseconds = void 0;
exports.metricsRouter = metricsRouter;
const prom_client_1 = __importDefault(require("prom-client"));
// Create a Registry
const register = new prom_client_1.default.Registry();
// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'visvasahome-backend'
});
// Enable the collection of default metrics
prom_client_1.default.collectDefaultMetrics({ register });
// Export custom metrics
exports.httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
register.registerMetric(exports.httpRequestDurationMicroseconds);
async function metricsRouter(fastify) {
    // GET /metrics
    fastify.get('/metrics', async (_req, reply) => {
        const metrics = await register.metrics();
        reply.header('Content-Type', register.contentType);
        return reply.send(metrics);
    });
}
//# sourceMappingURL=metrics.js.map