/**
 * Localization Service (Internal "Groot" clone)
 * Fetches localization strings, backed by Redis cache and protected by a Circuit Breaker.
 * Simulates a highly-resilient remote service call with a strict 100ms timeout.
 */
export declare class LocalizationService {
    private breaker;
    constructor();
    /**
     * Translates a key to the target locale.
     * Protects the request with a timeout and fallback.
     */
    getTranslation(locale: string, key: string, fallbackText: string): Promise<string>;
    private fetchTranslation;
}
export declare const localizationService: LocalizationService;
//# sourceMappingURL=localization.service.d.ts.map