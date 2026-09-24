import { EventBusJobData } from '../../lib/queue.js';
export declare class AnalyticsService {
    private dataLakePath;
    private snowflakeBreaker;
    constructor();
    ingest(event: EventBusJobData): Promise<void>;
}
export declare const analyticsService: AnalyticsService;
//# sourceMappingURL=analytics.service.d.ts.map