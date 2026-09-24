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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityService = exports.IdentityService = void 0;
/**
 * IdentityService — Layer 3: Domain Services
 *
 * Handles user authentication, OTP generation, and JWT token management.
 */
const client_js_1 = require("../../db/client.js");
const users_js_1 = require("../../db/schema/users.js");
const otp_js_1 = require("../../lib/otp.js");
const jwt_js_1 = require("../../lib/jwt.js");
const drizzle_orm_1 = require("drizzle-orm");
const node_crypto_1 = __importDefault(require("node:crypto"));
const bcrypt = __importStar(require("bcrypt"));
class IdentityService {
    async sendLoginOtp(phone) {
        await (0, otp_js_1.sendOtp)(phone);
    }
    async verifyLoginOtp(phone, otp, name) {
        await (0, otp_js_1.verifyOtp)(phone, otp);
        let [user] = await client_js_1.authDb.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.phone, phone)).limit(1);
        if (!user) {
            const [newUser] = await client_js_1.authDb.insert(users_js_1.users).values({
                id: node_crypto_1.default.randomUUID(),
                phone,
                name: name || 'User',
            }).returning();
            user = newUser;
        }
        return this.createSession(user);
    }
    async loginWithPassword(email, passwordPlain) {
        const [user] = await client_js_1.authDb.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.email, email)).limit(1);
        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }
        const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid email or password');
        }
        return this.createSession(user);
    }
    async registerWithPassword(email, passwordPlain, name, phone) {
        const [existing] = await client_js_1.authDb.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.email, email)).limit(1);
        if (existing) {
            throw new Error('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordPlain, salt);
        const [user] = await client_js_1.authDb.insert(users_js_1.users).values({
            id: node_crypto_1.default.randomUUID(),
            phone,
            email,
            passwordHash,
            name,
        }).returning();
        return this.createSession(user);
    }
    async createSession(user) {
        const accessToken = await (0, jwt_js_1.signAccessToken)({ id: user.id, phone: user.phone, roles: [user.role] });
        const refreshToken = await (0, jwt_js_1.signRefreshToken)({ id: user.id, phone: user.phone, roles: [user.role] });
        await client_js_1.authDb.insert(users_js_1.sessions).values({
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        return { user, accessToken, refreshToken };
    }
    /**
     * GDPR / PDPA Right to be Forgotten
     * Anonymizes PII data (phone, email, name) for a user to maintain referential integrity
     * for bookings/payments, but removes all identifiable info.
     */
    async deleteAccount(userId) {
        const redactedString = `[REDACTED_${node_crypto_1.default.randomUUID().split('-')[0]}]`;
        // Anonymize user record
        await client_js_1.authDb.update(users_js_1.users).set({
            phone: redactedString,
            email: `${redactedString}@deleted.local`,
            name: 'Deleted User',
            passwordHash: null,
            isActive: false,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(users_js_1.users.id, userId));
        // Delete active sessions
        await client_js_1.authDb.delete(users_js_1.sessions).where((0, drizzle_orm_1.eq)(users_js_1.sessions.userId, userId));
        // In a real system, emit an event 'user.deleted' so other services (e.g., chat, analytics) can anonymize their data too.
    }
}
exports.IdentityService = IdentityService;
exports.identityService = new IdentityService();
//# sourceMappingURL=identity.service.js.map