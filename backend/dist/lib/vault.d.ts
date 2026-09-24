/**
 * Enterprise Secrets Management (Vault / AWS Secrets Manager Clone)
 * Securely retrieves API keys dynamically, avoiding hardcoded secrets or exposing them in long-lived memory.
 */
declare class SecretsVault {
    private vaultBreaker;
    private cache;
    getSecret(secretName: string): Promise<string>;
}
export declare const vault: SecretsVault;
export {};
//# sourceMappingURL=vault.d.ts.map