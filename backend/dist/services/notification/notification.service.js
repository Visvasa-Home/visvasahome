"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = exports.notificationService = exports.NotificationService = void 0;
/**
 * NotificationService — Layer 3: Domain Services
 *
 * Dispatches push (FCM), SMS, email, and in-app notifications.
 * Uses BullMQ for async delivery with retry.
 */
const client_js_1 = require("../../db/client.js");
const services_js_1 = require("../../db/schema/services.js");
const users_js_1 = require("../../db/schema/users.js");
const queue_js_1 = require("../../lib/queue.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
// ─── NotificationService ──────────────────────────────────────────────────────
class NotificationService {
    async sendToUser(userId, notification) {
        // Save in-app notification to DB
        await client_js_1.db.insert(services_js_1.notifications).values({
            userId,
            title: notification.title,
            body: notification.body,
            type: notification.type,
            data: notification.data ?? {},
            status: 'pending',
        });
        // Get user details for FCM/SMS
        const [user] = await client_js_1.db.select({ fcmToken: users_js_1.users.fcmToken, phone: users_js_1.users.phone, email: users_js_1.users.email })
            .from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.id, userId)).limit(1);
        // Queue async delivery
        await queue_js_1.notificationQueue.add('send', {
            userId,
            title: notification.title,
            body: notification.body,
            type: notification.type,
            data: notification.data,
            fcmToken: user?.fcmToken ?? undefined,
            phone: user?.phone,
            email: user?.email ?? undefined,
        });
    }
    async sendBulk(userIds, notification) {
        await Promise.all(userIds.map(userId => this.sendToUser(userId, { ...notification, type: 'push' })));
    }
    async markRead(notificationId, userId) {
        await client_js_1.db.update(services_js_1.notifications)
            .set({ isRead: true })
            .where((0, drizzle_orm_1.eq)(services_js_1.notifications.id, notificationId));
    }
    async getUnread(userId) {
        return client_js_1.db.select().from(services_js_1.notifications)
            .where((0, drizzle_orm_1.eq)(services_js_1.notifications.userId, userId))
            .orderBy(services_js_1.notifications.createdAt)
            .limit(50);
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
// ─── BullMQ Notification Worker ───────────────────────────────────────────────
exports.notificationWorker = (0, queue_js_1.createWorker)('notification', async (job) => {
    const { type, title, body, fcmToken, phone, data } = job.data;
    if (type === 'push' && fcmToken) {
        await sendFcm(fcmToken, title, body, data);
    }
    if (type === 'sms' && phone) {
        await sendSms(phone, body);
    }
    if (type === 'email' && job.data.email) {
        await sendEmail(job.data.email, title, body);
    }
}, 10);
exports.notificationWorker.on('completed', (job) => logger_js_1.logger.info({ jobId: job.id, type: job.data.type }, '[notification-worker] Delivered'));
exports.notificationWorker.on('failed', (job, err) => logger_js_1.logger.error({ jobId: job?.id, err }, '[notification-worker] Failed'));
// ─── Delivery implementations ─────────────────────────────────────────────────
async function sendFcm(token, title, body, data) {
    const FCM_SERVER_KEY = process.env.FIREBASE_SERVER_KEY;
    if (!FCM_SERVER_KEY) {
        logger_js_1.logger.debug({ title }, '[FCM] No server key — skipping');
        return;
    }
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${FCM_SERVER_KEY}`,
        },
        body: JSON.stringify({
            to: token,
            notification: { title, body },
            data: data ?? {},
        }),
    });
    if (!res.ok)
        logger_js_1.logger.warn({ status: res.status }, '[FCM] Push delivery failed');
}
async function sendSms(phone, body) {
    const provider = process.env.SMS_PROVIDER;
    if (!provider) {
        logger_js_1.logger.debug({ phone, body }, '[SMS] No provider configured — skipping');
        return;
    }
    // Pluggable — same as OTP provider (MSG91 / Twilio)
    logger_js_1.logger.info({ phone }, '[SMS] Sent (stubbed)');
}
async function sendEmail(email, subject, body) {
    logger_js_1.logger.info({ email, subject }, '[email] Sent (stubbed — plug in SES/Mailgun)');
}
//# sourceMappingURL=notification.service.js.map