import 'dotenv/config';
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    TS_PORT: string;
    HOST: string;
    AUTH_DB_URL: string;
    USER_DB_URL: string;
    PROVIDER_DB_URL: string;
    CATALOG_DB_URL: string;
    BOOKING_DB_URL: string;
    PAYMENT_DB_URL: string;
    RATING_DB_URL: string;
    OUTBOX_DB_URL: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    RATE_LIMIT_PER_MINUTE: string;
    OTP_TTL_SECS: string;
    CORS_ORIGINS: string;
    FEATURE_REALTIME_DISPATCH: "true" | "false";
    FEATURE_INSTANT_BOOKING: "true" | "false";
    FEATURE_GRAPHQL_BFF: "true" | "false";
};
//# sourceMappingURL=env.d.ts.map