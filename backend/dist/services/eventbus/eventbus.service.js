"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBusService = exports.EventBusService = void 0;
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const analytics_service_js_1 = require("../analytics/analytics.service.js");
const booking_service_js_1 = require("../booking/booking.service.js");
class EventBusService {
    worker;
    constructor() {
        this.worker = (0, queue_js_1.createWorker)(queue_js_1.QUEUES.EVENT_BUS, async (job) => {
            const event = job.data;
            logger_js_1.logger.info({ eventType: event.eventType, aggregateId: event.aggregateId }, '[eventbus] Processing event');
            // Always send to Analytics Data Lake
            await analytics_service_js_1.analyticsService.ingest(event);
            // Fan out based on event type
            switch (event.eventType) {
                case 'booking.paid':
                    // Trigger dispatch (this updates status to searching and queues the job)
                    await booking_service_js_1.bookingService.startDispatch(event.aggregateId);
                    break;
                case 'booking.created': {
                    if (event.payload.bookingType === 'scheduled' && event.payload.scheduledTime) {
                        const scheduledTime = new Date(event.payload.scheduledTime);
                        const now = new Date();
                        // T-24h reminder
                        const t24h = new Date(scheduledTime.getTime() - 24 * 60 * 60 * 1000);
                        if (t24h > now) {
                            const { notificationQueue } = await import('../../lib/queue.js');
                            await notificationQueue.add('remind', {
                                userId: event.payload.customerId,
                                type: 'push',
                                title: '📅 Upcoming Booking Tomorrow',
                                body: 'Your scheduled booking is coming up in 24 hours!',
                                data: { bookingId: event.aggregateId },
                            }, { delay: t24h.getTime() - now.getTime() });
                        }
                        // T-2h reminder
                        const t2h = new Date(scheduledTime.getTime() - 2 * 60 * 60 * 1000);
                        if (t2h > now) {
                            const { notificationQueue } = await import('../../lib/queue.js');
                            await notificationQueue.add('remind', {
                                userId: event.payload.customerId,
                                type: 'push',
                                title: '📅 Upcoming Booking',
                                body: 'Your scheduled booking is coming up in 2 hours!',
                                data: { bookingId: event.aggregateId },
                            }, { delay: t2h.getTime() - now.getTime() });
                        }
                    }
                    break;
                }
                case 'booking.cancelled': {
                    const { changedByRole, partnerId } = event.payload;
                    if (changedByRole === 'partner' && partnerId) {
                        // Apply penalty to partner score (reduce acceptance rate or rating)
                        logger_js_1.logger.info({ partnerId }, '[eventbus] Applying penalty for partner cancellation');
                        // Normally this would call partnerService.applyPenalty(partnerId)
                        // For now, we simulate by emitting a log or calling a service method.
                        const { partnerService } = await import('../partner/partner.service.js');
                        // Assuming partnerService has a method to record cancellation, or we can just decrement score here.
                        // In a real system, we might subtract -10 rating points or lower acceptance rate
                    }
                    break;
                }
                case 'booking.partner.assigned': {
                    const { notificationQueue } = await import('../../lib/queue.js');
                    const { customerId, partnerId, bookingId } = event.payload;
                    if (customerId) {
                        await notificationQueue.add('notify', {
                            userId: customerId, type: 'push',
                            title: '👷 Partner Assigned',
                            body: 'A professional has been assigned to your booking.',
                            data: { bookingId: bookingId },
                        });
                    }
                    if (partnerId) {
                        await notificationQueue.add('notify', {
                            userId: partnerId, type: 'push',
                            title: '🎯 Job Assigned',
                            body: 'You have been successfully assigned to the booking.',
                            data: { bookingId: bookingId },
                        });
                    }
                    break;
                }
                case 'booking.completed': {
                    // Trigger rating prompt and ledger update
                    const { notificationQueue } = await import('../../lib/queue.js');
                    const { customerId, bookingId } = event.payload;
                    if (customerId) {
                        await notificationQueue.add('notify', {
                            userId: customerId, type: 'push',
                            title: '⭐ Rate your service',
                            body: 'Your service is complete! Please rate your experience.',
                            data: { bookingId: bookingId },
                        });
                    }
                    // The ledger updates would be handled in PaymentService upon completion, or by emitting another event
                    break;
                }
                case 'payment.captured': {
                    // Trigger invoice generation
                    logger_js_1.logger.info({ aggregateId: event.aggregateId }, '[eventbus] Payment captured, generating invoice');
                    const { invoiceService } = await import('../payment/invoice.service.js');
                    try {
                        await invoiceService.generateInvoice(event.aggregateId);
                    }
                    catch (err) {
                        logger_js_1.logger.error({ err, aggregateId: event.aggregateId }, 'Failed to generate invoice');
                    }
                    break;
                }
                case 'payout.initiated': {
                    const { notificationQueue } = await import('../../lib/queue.js');
                    const { beneficiaryId } = event.payload;
                    if (beneficiaryId) {
                        await notificationQueue.add('notify', {
                            userId: beneficiaryId, type: 'push',
                            title: '💸 Payout Initiated',
                            body: 'Your payout has been initiated and will reflect shortly.',
                            data: { payoutId: event.aggregateId },
                        });
                    }
                    break;
                }
                case 'amc.visit.due': {
                    // Triggers auto-create booking
                    const { amcService } = await import('../amc/amc.service.js');
                    const { customerId } = event.payload;
                    logger_js_1.logger.info({ aggregateId: event.aggregateId }, '[eventbus] AMC visit due, generating booking');
                    try {
                        await amcService.useVisit(event.aggregateId, customerId);
                    }
                    catch (err) {
                        logger_js_1.logger.error({ err, subscriptionId: event.aggregateId }, 'Failed to create AMC due visit');
                    }
                    break;
                }
                default:
                    logger_js_1.logger.warn({ eventType: event.eventType }, '[eventbus] Unhandled event type');
            }
        });
        this.worker.on('failed', (job, err) => {
            logger_js_1.logger.error({ err, jobId: job?.id }, '[eventbus] Job failed');
        });
    }
}
exports.EventBusService = EventBusService;
exports.eventBusService = new EventBusService();
//# sourceMappingURL=eventbus.service.js.map