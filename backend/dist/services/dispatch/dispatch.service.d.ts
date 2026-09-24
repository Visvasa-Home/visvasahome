import { type DispatchJobData } from '../../lib/queue.js';
export declare class DispatchService {
    private dispatchBreaker;
    /**
     * Main dispatch entry: find and rank eligible partners, create offer records.
     * Called by the BullMQ worker.
     */
    dispatch(bookingId: string, isScheduled: boolean, offerIndex?: number, preferredPartnerId?: string): Promise<void>;
    private internalDispatch;
    /**
     * Partner accepts an offer. Atomic via Redis SETNX lock.
     */
    acceptOffer(offerId: string, partnerId: string): Promise<void>;
    /**
     * Partner rejects / offer expires → cascade to next offer.
     */
    handleOfferTimeout(offerId: string, bookingId: string, currentOfferIndex: number): Promise<void>;
    forceAssign(bookingId: string, partnerId: string, adminId: string): Promise<void>;
    /**
     * Hour Tracking
     * Required for Minimum Wage and Overtime compliance if partners are deemed employees.
     */
    recordShiftTime(partnerId: string, action: 'clock_in' | 'clock_out', latitude?: number, longitude?: number): Promise<void>;
    private filterEligiblePartners;
    private rankPartners;
    private sendOfferNotification;
}
export declare const dispatchService: DispatchService;
export declare const dispatchWorker: import("bullmq").Worker<DispatchJobData, any, string>;
import { OfferTimeoutJobData } from '../../lib/queue.js';
export declare const offerTimeoutWorker: import("bullmq").Worker<OfferTimeoutJobData, any, string>;
//# sourceMappingURL=dispatch.service.d.ts.map