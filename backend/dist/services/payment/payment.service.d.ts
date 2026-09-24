export declare class PaymentService {
    private razorpayInstance;
    private getRazorpay;
    createOrder(bookingId: string): Promise<{
        razorpayOrderId: string;
        amount: number;
        currency: string;
        paymentId: string;
    }>;
    verifyWebhookSignature(body: string, signature: string): Promise<boolean>;
    handleWebhook(event: string, payload: Record<string, unknown>): Promise<void>;
    onPaymentCaptured(paymentId: string, bookingId: string): Promise<void>;
    initiateRefund(paymentId: string, amount: number, reason: string, initiatedById: string): Promise<string>;
    requestSettlement(partnerId: string, amount: number): Promise<string>;
    processSettlement(settlementId: string, adminId: string, utrNumber: string): Promise<void>;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment.service.d.ts.map