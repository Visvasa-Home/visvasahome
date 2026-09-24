"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
const logger_js_1 = require("./logger.js");
var CircuitState;
(function (CircuitState) {
    CircuitState[CircuitState["CLOSED"] = 0] = "CLOSED";
    CircuitState[CircuitState["OPEN"] = 1] = "OPEN";
    CircuitState[CircuitState["HALF_OPEN"] = 2] = "HALF_OPEN";
})(CircuitState || (CircuitState = {}));
class CircuitBreaker {
    name;
    failureThreshold;
    resetTimeoutMs;
    actionTimeoutMs;
    state = CircuitState.CLOSED;
    failureCount = 0;
    lastFailureTime = 0;
    constructor(name, failureThreshold = 5, resetTimeoutMs = 10000, actionTimeoutMs = 0 // 0 means no timeout
    ) {
        this.name = name;
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
        this.actionTimeoutMs = actionTimeoutMs;
    }
    async fire(action, fallback) {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
                this.state = CircuitState.HALF_OPEN;
            }
            else {
                if (fallback) {
                    logger_js_1.logger.warn(`[circuitBreaker] ${this.name} is OPEN, using fallback`);
                    return fallback();
                }
                throw new Error(`CircuitBreaker ${this.name} is OPEN`);
            }
        }
        try {
            let actionPromise = action();
            if (this.actionTimeoutMs > 0) {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`CircuitBreaker ${this.name} action timed out after ${this.actionTimeoutMs}ms`)), this.actionTimeoutMs);
                });
                actionPromise = Promise.race([actionPromise, timeoutPromise]);
            }
            const result = await actionPromise;
            // If we succeed and were half open, reset the breaker
            if (this.state === CircuitState.HALF_OPEN) {
                this.reset();
            }
            return result;
        }
        catch (err) {
            this.recordFailure();
            if (fallback) {
                logger_js_1.logger.warn({ err }, `[circuitBreaker] ${this.name} failed (or timed out), using fallback`);
                return fallback();
            }
            throw err;
        }
    }
    recordFailure() {
        this.failureCount += 1;
        this.lastFailureTime = Date.now();
        if (this.state === CircuitState.HALF_OPEN || this.failureCount >= this.failureThreshold) {
            this.state = CircuitState.OPEN;
            logger_js_1.logger.error(`[circuitBreaker] ${this.name} tripped to OPEN`);
        }
    }
    reset() {
        this.failureCount = 0;
        this.state = CircuitState.CLOSED;
        logger_js_1.logger.info(`[circuitBreaker] ${this.name} reset to CLOSED`);
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=circuitBreaker.js.map