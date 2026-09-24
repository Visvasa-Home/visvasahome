"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const payments_js_1 = require("../../db/schema/payments.js");
const users_js_1 = require("../../db/schema/users.js");
const services_js_1 = require("../../db/schema/services.js");
const drizzle_orm_1 = require("drizzle-orm");
const logger_js_1 = require("../../lib/logger.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class InvoiceService {
    /**
     * Generates a PDF invoice for a completed booking/payment
     * and saves it to a local 'uploads/invoices' directory (mocking S3).
     */
    async generateInvoice(paymentId) {
        const [payment] = await client_js_1.db.select().from(payments_js_1.payments).where((0, drizzle_orm_1.eq)(payments_js_1.payments.id, paymentId)).limit(1);
        if (!payment)
            throw new Error('Payment not found');
        const [booking] = await client_js_1.db.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, payment.bookingId)).limit(1);
        if (!booking)
            throw new Error('Booking not found');
        const [customer] = await client_js_1.db.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, booking.customerId)).limit(1);
        const [address] = await client_js_1.db.select().from(users_js_1.addresses).where((0, drizzle_orm_1.eq)(users_js_1.addresses.id, booking.addressId)).limit(1);
        const [service] = await client_js_1.db.select().from(services_js_1.services).where((0, drizzle_orm_1.eq)(services_js_1.services.id, booking.serviceId)).limit(1);
        const invoiceNumber = `INV-${booking.bookingNumber.replace('VH-', '')}`;
        // Create uploads folder if it doesn't exist
        const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads/invoices');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path_1.default.join(uploadsDir, `${invoiceNumber}.pdf`);
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const stream = fs_1.default.createWriteStream(filePath);
            doc.pipe(stream);
            // Header
            doc.fontSize(20).text('VisvasaHome', { align: 'right' });
            doc.fontSize(10).text('123 Startup Lane, Bangalore, India', { align: 'right' });
            doc.moveDown();
            // Invoice Info
            doc.fontSize(16).text('TAX INVOICE', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
            doc.text(`Date: ${new Date().toLocaleDateString()}`);
            doc.text(`Booking ID: ${booking.bookingNumber}`);
            doc.moveDown();
            // Customer Info
            doc.fontSize(14).text('Bill To:');
            doc.fontSize(12).text(customer.name);
            if (address) {
                doc.text(`${address.addressLine}, ${address.landmark || ''}`);
                doc.text(`${address.city}, ${address.state} ${address.pincode}`);
            }
            doc.moveDown();
            // Table Header
            const tableTop = doc.y;
            doc.font('Helvetica-Bold');
            doc.text('Item', 50, tableTop);
            doc.text('Total', 450, tableTop, { width: 90, align: 'right' });
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.font('Helvetica');
            // Table Row
            doc.text(service?.name || 'Service', 50, tableTop + 25);
            doc.text(`Rs. ${booking.basePrice}`, 450, tableTop + 25, { width: 90, align: 'right' });
            // Additional charges
            let currentY = tableTop + 50;
            if (parseFloat(booking.surgeAmount) > 0) {
                doc.text('Surge Charge', 50, currentY);
                doc.text(`Rs. ${booking.surgeAmount}`, 450, currentY, { width: 90, align: 'right' });
                currentY += 20;
            }
            if (parseFloat(booking.discountAmount) > 0) {
                doc.text('Discount', 50, currentY);
                doc.text(`-Rs. ${booking.discountAmount}`, 450, currentY, { width: 90, align: 'right' });
                currentY += 20;
            }
            if (parseFloat(booking.taxAmount) > 0) {
                doc.text('Tax (GST)', 50, currentY);
                doc.text(`Rs. ${booking.taxAmount}`, 450, currentY, { width: 90, align: 'right' });
                currentY += 20;
            }
            doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
            doc.font('Helvetica-Bold');
            doc.text('Final Amount', 250, currentY + 10, { width: 150, align: 'right' });
            doc.text(`Rs. ${booking.finalAmount}`, 450, currentY + 10, { width: 90, align: 'right' });
            // Footer
            doc.moveDown(4);
            doc.fontSize(10).font('Helvetica').text('Thank you for choosing VisvasaHome!', { align: 'center' });
            doc.end();
            stream.on('finish', async () => {
                try {
                    const invoiceUrl = `/uploads/invoices/${invoiceNumber}.pdf`;
                    // Save to database
                    await client_js_1.db.insert(payments_js_1.invoices).values({
                        paymentId,
                        invoiceNumber,
                        customerId: booking.customerId,
                        subtotal: String(parseFloat(booking.basePrice) + parseFloat(booking.surgeAmount)),
                        taxAmount: booking.taxAmount,
                        discountAmount: booking.discountAmount,
                        totalAmount: booking.finalAmount,
                        invoiceUrl,
                    });
                    logger_js_1.logger.info({ invoiceNumber, paymentId }, '[invoice] Generated PDF invoice');
                    resolve(invoiceUrl);
                }
                catch (err) {
                    logger_js_1.logger.error({ err, invoiceNumber }, '[invoice] Failed to save invoice record');
                    reject(err);
                }
            });
            stream.on('error', (err) => {
                logger_js_1.logger.error({ err, invoiceNumber }, '[invoice] Failed to write PDF');
                reject(err);
            });
        });
    }
}
exports.invoiceService = new InvoiceService();
//# sourceMappingURL=invoice.service.js.map