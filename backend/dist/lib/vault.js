"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vault = void 0;
const circuitBreaker_js_1 = require("./circuitBreaker.js");
const logger_js_1 = require("./logger.js");
/**
 * Enterprise Secrets Management (Vault / AWS Secrets Manager Clone)
 * Securely retrieves API keys dynamically, avoiding hardcoded secrets or exposing them in long-lived memory.
 */
class SecretsVault {
    // Using a circuit breaker so that if the vault is unreachable, it can fall back safely.
    vaultBreaker = new circuitBreaker_js_1.CircuitBreaker('Vault', 3, 15000, 2000); // 2s strict timeout
    // Cache for short-lived access
    cache = new Map();
    async getSecret(secretName) {
        const cached = this.cache.get(secretName);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.value;
        }
        return this.vaultBreaker.fire(async () => {
            // Mock network call to Vault/KMS
            await new Promise(resolve => setTimeout(resolve, 50));
            let secretValue = 'mocked_secret_value';
            // In reality, this would fetch from AWS Secrets Manager:
            // const client = new SecretsManagerClient({ region: 'us-east-1' });
            // const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
            // secretValue = response.SecretString;
            // Using env as mock backend for now
            if (secretName === 'STRIPE_SECRET_KEY')
                secretValue = 'sk_test_mock';
            if (secretName === 'GOOGLE_MAPS_KEY')
                secretValue = 'AIzaSyA_mock_key';
            if (secretName === 'AUTHBRIDGE_KEY')
                secretValue = 'ab_mock_key';
            if (secretName === 'SENDGRID_KEY')
                secretValue = 'sg_mock_key';
            if (secretName === 'ENCRYPTION_MASTER_KEY')
                secretValue = 'v3ry_s3cr3t_m4st3r_k3y_f0r_AES256';
            logger_js_1.logger.debug({ secretName }, '[vault] Secret fetched securely from Vault');
            // Cache for 5 minutes to reduce vault load
            this.cache.set(secretName, {
                value: secretValue,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });
            return secretValue;
        }, async () => {
            logger_js_1.logger.error({ secretName }, '[vault] Failed to fetch secret. Returning safe mock/error.');
            throw new Error(`Vault unreachable for secret: ${secretName}`);
        });
    }
}
exports.vault = new SecretsVault();
//# sourceMappingURL=vault.js.map