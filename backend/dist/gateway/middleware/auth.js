"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_js_1 = require("../../lib/jwt.js");
const response_js_1 = require("../../lib/response.js");
// ─── JWT Auth Plugin (optional — routes must opt-in via preHandler) ───────────
const authPlugin = (fastify, _opts, done) => {
    // Decorator: require authenticated user
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            const token = (0, jwt_js_1.extractBearer)(request.headers.authorization);
            request.user = await (0, jwt_js_1.verifyToken)(token);
        }
        catch (err) {
            return (0, response_js_1.sendError)(reply, err);
        }
    });
    done();
};
exports.default = (0, fastify_plugin_1.default)(authPlugin, { name: 'auth' });
//# sourceMappingURL=auth.js.map