/**
 * Notification Worker
 *
 * Processes notifications via:
 *   - FCM (Firebase Cloud Messaging) — Android + iOS push via google-auth-library
 *   - APNs (Apple Push Notification service) — iOS direct (optional, FCM covers both)
 *   - MSG91 / Twilio — OTP and transactional SMS
 *   - SendGrid / Nodemailer — transactional email
 *
 * Features:
 *   - Localized content via Groot localization service
 *   - Circuit breakers per channel (FCM, SMS, Email)
 *   - BookingAssigned → dual push to user + partner
 *   - Fallback: if FCM token absent but phone present → SMS
 *   - Persistence: notification log stored in DB for audit trail
 */
export declare class NotificationWorker {
    private worker;
    private fcmBreaker;
    private smsBreaker;
    private emailBreaker;
    constructor();
}
export declare const notificationWorker: NotificationWorker;
//# sourceMappingURL=notification.worker.d.ts.map