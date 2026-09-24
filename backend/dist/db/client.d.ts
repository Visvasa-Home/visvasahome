import * as schema from './schema/index.js';
export declare const authDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const userDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const providerDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const catalogDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const bookingDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const paymentDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const ratingDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const outboxDb: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export type Database = typeof authDb;
export declare function checkDbHealth(): Promise<boolean>;
//# sourceMappingURL=client.d.ts.map