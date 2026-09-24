/**
 * BullMQ Queue Definitions — Shared Lib
 * All queue names and job types centralized here.
 */
import { Queue, Worker, type Processor } from 'bullmq';
export declare const QUEUES: {
    readonly DISPATCH: "dispatch";
    readonly OFFER_TIMEOUT: "offer-timeout";
    readonly NOTIFICATION: "notification";
    readonly SETTLEMENT: "settlement";
    readonly AMC_RENEWAL: "amc-renewal";
    readonly EVENT_BUS: "event-bus";
    readonly PAYOUT: "payout";
};
export interface DispatchJobData {
    bookingId: string;
    isScheduled: boolean;
    offerIndex?: number;
}
export interface OfferTimeoutJobData {
    offerId: string;
    bookingId: string;
    partnerId: string;
    offerIndex: number;
}
export interface EventBusJobData {
    eventId: string;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: Record<string, unknown>;
}
export interface NotificationJobData {
    userId: string;
    title: string;
    body: string;
    type: 'push' | 'sms' | 'email' | 'in_app';
    data?: Record<string, unknown>;
    fcmToken?: string;
    phone?: string;
    email?: string;
}
export interface SettlementJobData {
    settlementId: string;
    partnerId: string;
    amount: number;
    method: string;
    upiId?: string;
    bankAccount?: string;
    bankIfsc?: string;
}
export interface AmcRenewalJobData {
    subscriptionId: string;
    customerId: string;
}
export declare function createQueue<T>(name: string): Queue<T>;
export declare function createWorker<T>(name: string, processor: Processor<T>, concurrency?: number): Worker<T>;
export declare const dispatchQueue: Queue<DispatchJobData, any, string, DispatchJobData, any, string>;
export declare const notificationQueue: Queue<NotificationJobData, any, string, NotificationJobData, any, string>;
export declare const settlementQueue: Queue<SettlementJobData, any, string, SettlementJobData, any, string>;
export declare const amcRenewalQueue: Queue<AmcRenewalJobData, any, string, AmcRenewalJobData, any, string>;
export declare const eventBusQueue: Queue<EventBusJobData, any, string, EventBusJobData, any, string>;
export declare const payoutQueue: Queue<any, any, string, any, any, string>;
//# sourceMappingURL=queue.d.ts.map