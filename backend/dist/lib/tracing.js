"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const logger_js_1 = require("./logger.js");
/**
 * OpenTelemetry Tracing Initialization
 * Hooks into Node.js to trace HTTP, PostgreSQL, Redis, and internal calls.
 */
const traceExporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
    // Default to Jaeger OTLP receiver (or Datadog/NewRelic agent)
    url: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
});
const sdk = new sdk_node_1.NodeSDK({
    // resource: new Resource({
    //   [SemanticResourceAttributes.SERVICE_NAME]: 'visvasahome-backend',
    //   [SemanticResourceAttributes.SERVICE_VERSION]: '2.0.0',
    //   environment: process.env.NODE_ENV || 'development',
    // }),
    traceExporter,
    instrumentations: [
        (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
            '@opentelemetry/instrumentation-fs': { enabled: false }, // Reduce noise
            '@opentelemetry/instrumentation-pg': { enabled: true },
            '@opentelemetry/instrumentation-ioredis': { enabled: true },
        }),
    ],
});
// Initialize the SDK and start tracing before application modules load
sdk.start();
logger_js_1.logger.info('[tracing] OpenTelemetry SDK Initialized');
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => logger_js_1.logger.info('[tracing] OpenTelemetry SDK gracefully shut down'))
        .catch((err) => logger_js_1.logger.error({ err }, '[tracing] Error shutting down OpenTelemetry SDK'))
        .finally(() => process.exit(0));
});
//# sourceMappingURL=tracing.js.map