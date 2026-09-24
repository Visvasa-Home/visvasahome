"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.outboxDb = exports.ratingDb = exports.paymentDb = exports.bookingDb = exports.catalogDb = exports.providerDb = exports.userDb = exports.authDb = void 0;
exports.checkDbHealth = checkDbHealth;
/**
 * Drizzle Client — Layer 4: Data
 * Creates a singleton database connection per microservice domain.
 */
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = __importStar(require("./schema/index.js"));
const env_js_1 = require("../env.js");
// Base pool config function
function createPool(connectionString) {
    const pool = new pg_1.Pool({
        connectionString,
        max: 20, // max pool connections
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        ssl: env_js_1.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
    pool.on('error', (err) => {
        console.error(`[db] Pool error on ${connectionString}:`, err.message);
    });
    return pool;
}
// Create dedicated connection pools per domain
const authPool = createPool(env_js_1.env.AUTH_DB_URL);
const userPool = createPool(env_js_1.env.USER_DB_URL);
const providerPool = createPool(env_js_1.env.PROVIDER_DB_URL);
const catalogPool = createPool(env_js_1.env.CATALOG_DB_URL);
const bookingPool = createPool(env_js_1.env.BOOKING_DB_URL);
const paymentPool = createPool(env_js_1.env.PAYMENT_DB_URL);
const ratingPool = createPool(env_js_1.env.RATING_DB_URL);
const outboxPool = createPool(env_js_1.env.OUTBOX_DB_URL);
// Export Drizzle instances per domain
exports.authDb = (0, node_postgres_1.drizzle)(authPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.userDb = (0, node_postgres_1.drizzle)(userPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.providerDb = (0, node_postgres_1.drizzle)(providerPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.catalogDb = (0, node_postgres_1.drizzle)(catalogPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.bookingDb = (0, node_postgres_1.drizzle)(bookingPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.paymentDb = (0, node_postgres_1.drizzle)(paymentPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.ratingDb = (0, node_postgres_1.drizzle)(ratingPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
exports.outboxDb = (0, node_postgres_1.drizzle)(outboxPool, { schema, logger: env_js_1.env.NODE_ENV === 'development' });
// We preserve a generic alias `db` internally for scripts that haven't been refactored yet,
// pointing to the largest schema (booking_db) to minimize instant breakage, but services MUST use their domain DB.
exports.db = exports.bookingDb;
// Health check
async function checkDbHealth() {
    try {
        const client = await bookingPool.connect(); // just check one for general health
        await client.query('SELECT 1');
        client.release();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=client.js.map