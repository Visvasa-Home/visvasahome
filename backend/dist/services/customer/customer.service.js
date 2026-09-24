"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = exports.CustomerService = void 0;
/**
 * CustomerService — Layer 3: Domain Services
 *
 * Handles customer profile management, saved addresses, family members,
 * and user preferences.
 */
const client_js_1 = require("../../db/client.js");
const users_js_1 = require("../../db/schema/users.js");
const errors_js_1 = require("../../lib/errors.js");
const drizzle_orm_1 = require("drizzle-orm");
const node_crypto_1 = __importDefault(require("node:crypto"));
class CustomerService {
    async getProfile(userId) {
        const [user] = await client_js_1.db.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, userId)).limit(1);
        if (!user)
            throw errors_js_1.Errors.notFound('Customer profile not found');
        return user;
    }
    async addAddress(userId, input) {
        const [address] = await client_js_1.db.insert(users_js_1.addresses).values({
            id: node_crypto_1.default.randomUUID(),
            userId,
            label: input.label,
            addressLine: input.addressLine,
            city: input.city,
            state: input.state,
            pincode: input.pincode,
            latitude: input.lat,
            longitude: input.lng,
        }).returning();
        return address;
    }
    async listAddresses(userId) {
        return client_js_1.db.select().from(users_js_1.addresses).where((0, drizzle_orm_1.eq)(users_js_1.addresses.userId, userId));
    }
}
exports.CustomerService = CustomerService;
exports.customerService = new CustomerService();
//# sourceMappingURL=customer.service.js.map