export declare class SupportService {
    createTicket(userId: string, subject: string, description: string, bookingId?: string): Promise<{
        status: "in_progress" | "open" | "resolved" | "closed";
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookingId: string | null;
        subject: string;
        priority: "low" | "medium" | "high" | "urgent";
    }>;
    replyToTicket(ticketId: string, senderId: string, message: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        ticketId: string;
        senderId: string;
    }>;
    getTicketDetails(ticketId: string): Promise<{
        ticket: {
            status: "in_progress" | "open" | "resolved" | "closed";
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            bookingId: string | null;
            subject: string;
            priority: "low" | "medium" | "high" | "urgent";
        };
        messages: {
            message: string;
            id: string;
            createdAt: Date;
            ticketId: string;
            senderId: string;
        }[];
    }>;
}
export declare const supportService: SupportService;
//# sourceMappingURL=support.service.d.ts.map