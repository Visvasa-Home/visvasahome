import { WebSocket } from 'ws';
export declare class ChatService {
    private activeConnections;
    /**
     * Register a user's WebSocket connection
     */
    registerConnection(userId: string, socket: WebSocket): void;
    /**
     * Processes a message received from a user's WebSocket
     */
    private handleIncomingMessage;
}
export declare const chatService: ChatService;
//# sourceMappingURL=chat.service.d.ts.map