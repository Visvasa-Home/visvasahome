export declare class CircuitBreaker {
    private readonly name;
    private readonly failureThreshold;
    private readonly resetTimeoutMs;
    private readonly actionTimeoutMs;
    private state;
    private failureCount;
    private lastFailureTime;
    constructor(name: string, failureThreshold?: number, resetTimeoutMs?: number, actionTimeoutMs?: number);
    fire<T>(action: () => Promise<T>, fallback?: () => Promise<T>): Promise<T>;
    private recordFailure;
    private reset;
}
//# sourceMappingURL=circuitBreaker.d.ts.map