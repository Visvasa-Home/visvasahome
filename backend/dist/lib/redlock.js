"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redlock = void 0;
const redlock_1 = __importDefault(require("redlock"));
const redis_js_1 = require("./redis.js");
exports.redlock = new redlock_1.default([redis_js_1.redis], {
    driftFactor: 0.01,
    retryCount: 3,
    retryDelay: 200, // ms
    retryJitter: 200, // ms
    automaticExtensionThreshold: 500, // ms
});
//# sourceMappingURL=redlock.js.map