"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBloomFilter = exports.bookingBloomFilter = exports.RedisBloomFilter = void 0;
/**
 * Redis-backed Bloom Filter for VisvasaHome
 * Prevents Cache Penetration by filtering out requests for impossible IDs.
 */
const crypto_1 = __importDefault(require("crypto"));
const redis_js_1 = require("./redis.js");
const logger_js_1 = require("./logger.js");
class RedisBloomFilter {
    key;
    numBits;
    numHashes;
    /**
     * @param key Redis key for the bit array
     * @param numBits Size of the bit array (default 8,388,608 bits = 1MB)
     * @param numHashes Number of hash functions (default 5)
     */
    constructor(key, numBits = 8388608, numHashes = 5) {
        this.key = key;
        this.numBits = numBits;
        this.numHashes = numHashes;
    }
    /**
     * Generates k hash offsets for a given item using SHA-256
     */
    getOffsets(item) {
        const hash = crypto_1.default.createHash('sha256').update(item).digest();
        const offsets = [];
        // We can extract 32-bit integers from the 256-bit hash (up to 8 hashes)
        for (let i = 0; i < Math.min(this.numHashes, 8); i++) {
            // Read 4 bytes at a time
            const val = hash.readUInt32BE(i * 4);
            offsets.push(val % this.numBits);
        }
        return offsets;
    }
    /**
     * Adds an item to the Bloom filter
     */
    async add(item) {
        const offsets = this.getOffsets(item);
        const pipeline = redis_js_1.redis.pipeline();
        for (const offset of offsets) {
            pipeline.setbit(this.key, offset, 1);
        }
        await pipeline.exec();
        logger_js_1.logger.debug({ item, key: this.key }, '[bloom] Added item to bloom filter');
    }
    /**
     * Checks if an item *might* exist in the Bloom filter
     * Returns false if it definitely DOES NOT exist (used to block impossible IDs).
     */
    async mightContain(item) {
        const offsets = this.getOffsets(item);
        const pipeline = redis_js_1.redis.pipeline();
        for (const offset of offsets) {
            pipeline.getbit(this.key, offset);
        }
        const results = await pipeline.exec();
        if (!results)
            return false;
        for (const [err, bit] of results) {
            if (err || bit === 0) {
                return false; // Definitely not present
            }
        }
        return true; // Possibly present
    }
}
exports.RedisBloomFilter = RedisBloomFilter;
// Instantiate specific bloom filters
exports.bookingBloomFilter = new RedisBloomFilter('bloom:bookings');
exports.userBloomFilter = new RedisBloomFilter('bloom:users');
//# sourceMappingURL=bloom.js.map