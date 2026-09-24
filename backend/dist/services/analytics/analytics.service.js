"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = exports.AnalyticsService = void 0;
/**
 * Analytics Service
 * Simulates pushing events to a Data Lake or OLAP store (like BigQuery or ClickHouse).
 * For now, it appends to a JSONL file in a simulated volume.
 */
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const logger_js_1 = require("../../lib/logger.js");
const circuitBreaker_js_1 = require("../../lib/circuitBreaker.js");
const vault_js_1 = require("../../lib/vault.js");
class AnalyticsService {
    dataLakePath;
    snowflakeBreaker = new circuitBreaker_js_1.CircuitBreaker('Snowflake Analytics', 5, 30000, 5000);
    constructor() {
        this.dataLakePath = node_path_1.default.resolve(process.cwd(), 'data', 'datalake_sync.jsonl');
    }
    async ingest(event) {
        try {
            // 1. Authenticate with Data Warehouse using Vault
            const snowflakeKey = await vault_js_1.vault.getSecret('SNOWFLAKE_API_KEY');
            // 2. Stream to Snowflake / BigQuery
            await this.snowflakeBreaker.fire(async () => {
                // Mock network delay streaming to Snowflake
                await new Promise(resolve => setTimeout(resolve, 30));
                // Ensure directory exists for local fallback/staging
                await promises_1.default.mkdir(node_path_1.default.dirname(this.dataLakePath), { recursive: true });
                const logEntry = JSON.stringify({
                    ingestedAt: new Date().toISOString(),
                    ...event,
                }) + '\n';
                await promises_1.default.appendFile(this.dataLakePath, logEntry, 'utf-8');
            });
        }
        catch (err) {
            logger_js_1.logger.error({ err, eventId: event.eventId }, '[analytics] Failed to ingest event to Snowflake/Data Lake');
        }
    }
}
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = new AnalyticsService();
//# sourceMappingURL=analytics.service.js.map