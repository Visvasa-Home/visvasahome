interface CacheOptions {
    ttlSecs?: number;
    negativeTtlSecs?: number;
}
/**
 * Fetch with negative caching.
 * @param key Redis cache key
 * @param fetcher Async function that queries the DB
 * @param options Cache TTL options
 */
export declare function fetchWithCache<T>(key: string, fetcher: () => Promise<T | null | undefined>, options?: CacheOptions): Promise<T | null>;
export {};
//# sourceMappingURL=cacheWrapper.d.ts.map