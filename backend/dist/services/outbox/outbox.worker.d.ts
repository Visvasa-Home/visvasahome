export declare class OutboxWorker {
    private isRunning;
    private intervalId?;
    start(): void;
    stop(): void;
    private processOutbox;
}
export declare const outboxWorker: OutboxWorker;
//# sourceMappingURL=outbox.worker.d.ts.map