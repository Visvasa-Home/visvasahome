import { type NotificationJobData } from '../../lib/queue.js';
export declare class NotificationService {
    sendToUser(userId: string, notification: {
        title: string;
        body: string;
        type: 'push' | 'sms' | 'email' | 'in_app';
        data?: Record<string, unknown>;
    }): Promise<void>;
    sendBulk(userIds: string[], notification: {
        title: string;
        body: string;
        data?: Record<string, unknown>;
    }): Promise<void>;
    markRead(notificationId: string, userId: string): Promise<void>;
    getUnread(userId: string): Promise<{
        type: "push" | "email" | "sms" | "in_app";
        status: "pending" | "sent" | "delivered" | "failed";
        body: string;
        title: string;
        id: string;
        data: unknown;
        createdAt: Date;
        userId: string;
        isRead: boolean;
        sentAt: Date | null;
    }[]>;
}
export declare const notificationService: NotificationService;
export declare const notificationWorker: import("bullmq").Worker<NotificationJobData, any, string>;
//# sourceMappingURL=notification.service.d.ts.map