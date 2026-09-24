/**
 * Enterprise Encryption Utility
 * Provides AES-256-GCM authenticated encryption for data-at-rest (e.g. KYC documents, PII).
 * Keys are derived dynamically using a master key from the Vault.
 */
export declare class EncryptionService {
    /**
     * Encrypts a plaintext string into a base64 encoded format containing IV, Salt, Tag, and Ciphertext.
     */
    encrypt(plaintext: string): Promise<string>;
    /**
     * Decrypts a previously encrypted string.
     */
    decrypt(encryptedData: string): Promise<string>;
}
export declare const encryptionService: EncryptionService;
//# sourceMappingURL=encryption.d.ts.map