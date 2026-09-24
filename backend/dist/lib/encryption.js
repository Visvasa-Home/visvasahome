"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptionService = exports.EncryptionService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const vault_js_1 = require("./vault.js");
const logger_js_1 = require("./logger.js");
// AES-256-GCM settings
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
/**
 * Enterprise Encryption Utility
 * Provides AES-256-GCM authenticated encryption for data-at-rest (e.g. KYC documents, PII).
 * Keys are derived dynamically using a master key from the Vault.
 */
class EncryptionService {
    /**
     * Encrypts a plaintext string into a base64 encoded format containing IV, Salt, Tag, and Ciphertext.
     */
    async encrypt(plaintext) {
        try {
            const masterKey = await vault_js_1.vault.getSecret('ENCRYPTION_MASTER_KEY');
            const iv = node_crypto_1.default.randomBytes(IV_LENGTH);
            const salt = node_crypto_1.default.randomBytes(SALT_LENGTH);
            // Derive a 32-byte key from the master key + salt using pbkdf2
            const key = node_crypto_1.default.pbkdf2Sync(masterKey, salt, 100000, KEY_LENGTH, 'sha256');
            const cipher = node_crypto_1.default.createCipheriv(ALGORITHM, key, iv);
            let encrypted = cipher.update(plaintext, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const tag = cipher.getAuthTag();
            // Format: b64(salt) : b64(iv) : b64(tag) : b64(ciphertext)
            return [
                salt.toString('base64'),
                iv.toString('base64'),
                tag.toString('base64'),
                Buffer.from(encrypted, 'hex').toString('base64')
            ].join(':');
        }
        catch (err) {
            logger_js_1.logger.error({ err }, '[encryption] Failed to encrypt data');
            throw new Error('Encryption failed');
        }
    }
    /**
     * Decrypts a previously encrypted string.
     */
    async decrypt(encryptedData) {
        try {
            const masterKey = await vault_js_1.vault.getSecret('ENCRYPTION_MASTER_KEY');
            const parts = encryptedData.split(':');
            if (parts.length !== 4)
                throw new Error('Invalid encrypted payload format');
            const salt = Buffer.from(parts[0], 'base64');
            const iv = Buffer.from(parts[1], 'base64');
            const tag = Buffer.from(parts[2], 'base64');
            const encryptedText = Buffer.from(parts[3], 'base64').toString('hex');
            const key = node_crypto_1.default.pbkdf2Sync(masterKey, salt, 100000, KEY_LENGTH, 'sha256');
            const decipher = node_crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
            decipher.setAuthTag(tag);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (err) {
            logger_js_1.logger.error({ err }, '[encryption] Failed to decrypt data');
            throw new Error('Decryption failed');
        }
    }
}
exports.EncryptionService = EncryptionService;
exports.encryptionService = new EncryptionService();
//# sourceMappingURL=encryption.js.map