export declare class SlotService {
    /**
     * Acquire a 10-minute hold (soft-lock) on a specific slot in a specific zone.
     * If the slot is already held or fully booked, this will throw an error.
     *
     * A "slot key" looks like: `slot:{zoneId}:{serviceId}:{YYYY-MM-DD}:{HH:MM}`
     */
    holdSlot(zoneId: string, serviceId: string, dateStr: string, timeStr: string, customerId: string): Promise<string>;
    /**
     * Release the hold. Called if payment fails or expires.
     */
    releaseHold(zoneId: string, serviceId: string, dateStr: string, timeStr: string, customerId: string): Promise<void>;
    /**
     * Finalize the slot (convert hold to permanent booking).
     * Called when payment is successfully captured.
     */
    finalizeSlot(zoneId: string, serviceId: string, dateStr: string, timeStr: string, customerId: string): Promise<void>;
}
export declare const slotService: SlotService;
//# sourceMappingURL=slot.service.d.ts.map