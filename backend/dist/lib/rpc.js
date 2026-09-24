"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeRpc = executeRpc;
/**
 * Internal RPC Framework (VisvasaHome-Style)
 *
 * Wraps inter-service API calls (or internal functions) with a standard envelope,
 * injecting:
 *  - OpenTelemetry Tracing headers
 *  - Circuit Breaking
 *  - Timeouts & Retries
 *
 * This minimizes boilerplate across the codebase and standardizes internal communication.
 */
const api_1 = require("@opentelemetry/api");
const logger_js_1 = require("./logger.js");
const circuitBreaker_js_1 = require("./circuitBreaker.js");
const errors_js_1 = require("./errors.js");
// Simulated registry for circuit breakers per service
const circuitBreakers = new Map();
function getBreaker(serviceName) {
    if (!circuitBreakers.has(serviceName)) {
        // Default config: 5 failures, 30s open, 5s timeout
        circuitBreakers.set(serviceName, new circuitBreaker_js_1.CircuitBreaker(serviceName, 5, 30000, 5000));
    }
    return circuitBreakers.get(serviceName);
}
/**
 * Executes a function via the RPC wrapper.
 * In a fully distributed microservices setup, `fn` would be an HTTP fetch call.
 * Here, we wrap the internal service call to enforce the RPC boundary policies.
 */
async function executeRpc(options, fn) {
    const tracer = api_1.trace.getTracer('visvasahome-rpc');
    const breaker = getBreaker(options.serviceName);
    return tracer.startActiveSpan(`RPC ${options.serviceName}.${options.methodName}`, async (span) => {
        try {
            span.setAttribute('rpc.service', options.serviceName);
            span.setAttribute('rpc.method', options.methodName);
            // Execute via Circuit Breaker
            const result = await breaker.fire(async () => {
                // Implementation of timeout if specified
                if (options.timeoutMs) {
                    return Promise.race([
                        fn(),
                        new Promise((_, reject) => setTimeout(() => reject(errors_js_1.Errors.internal(`RPC Timeout calling ${options.serviceName}`)), options.timeoutMs)),
                    ]);
                }
                return fn();
            });
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            return result;
        }
        catch (err) {
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: err.message,
            });
            span.recordException(err);
            logger_js_1.logger.error({ err, service: options.serviceName, method: options.methodName }, '[rpc] Call failed');
            throw err;
        }
        finally {
            span.end();
        }
    });
}
//# sourceMappingURL=rpc.js.map