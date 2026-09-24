export interface RpcOptions {
    serviceName: string;
    methodName: string;
    timeoutMs?: number;
    retries?: number;
}
/**
 * Executes a function via the RPC wrapper.
 * In a fully distributed microservices setup, `fn` would be an HTTP fetch call.
 * Here, we wrap the internal service call to enforce the RPC boundary policies.
 */
export declare function executeRpc<T>(options: RpcOptions, fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=rpc.d.ts.map