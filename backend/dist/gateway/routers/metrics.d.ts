import type { FastifyInstance } from 'fastify';
import client from 'prom-client';
export declare const httpRequestDurationMicroseconds: client.Histogram<"code" | "method" | "route">;
export declare function metricsRouter(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=metrics.d.ts.map