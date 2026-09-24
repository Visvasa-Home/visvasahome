export declare class RedisBloomFilter {
    private key;
    private numBits;
    private numHashes;
    /**
     * @param key Redis key for the bit array
     * @param numBits Size of the bit array (default 8,388,608 bits = 1MB)
     * @param numHashes Number of hash functions (default 5)
     */
    constructor(key: string, numBits?: number, numHashes?: number);
    /**
     * Generates k hash offsets for a given item using SHA-256
     */
    private getOffsets;
    /**
     * Adds an item to the Bloom filter
     */
    add(item: string): Promise<void>;
    /**
     * Checks if an item *might* exist in the Bloom filter
     * Returns false if it definitely DOES NOT exist (used to block impossible IDs).
     */
    mightContain(item: string): Promise<boolean>;
}
export declare const bookingBloomFilter: RedisBloomFilter;
export declare const userBloomFilter: RedisBloomFilter;
//# sourceMappingURL=bloom.d.ts.map