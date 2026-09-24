declare class CallService {
    private client;
    private twilioNumber;
    private getClient;
    /**
     * Initiates a masked call between customer and partner
     */
    initiateCall(bookingId: string, callerId: string, role: 'customer' | 'partner'): Promise<void>;
    /**
     * Generates TwiML to connect the call to the receiver
     */
    generateConnectTwiML(receiverPhone: string): string;
}
export declare const callService: CallService;
export {};
//# sourceMappingURL=call.service.d.ts.map