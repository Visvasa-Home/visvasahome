declare class InvoiceService {
    /**
     * Generates a PDF invoice for a completed booking/payment
     * and saves it to a local 'uploads/invoices' directory (mocking S3).
     */
    generateInvoice(paymentId: string): Promise<string>;
}
export declare const invoiceService: InvoiceService;
export {};
//# sourceMappingURL=invoice.service.d.ts.map