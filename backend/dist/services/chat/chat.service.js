"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const ws_1 = require("ws");
const client_js_1 = require("../../db/client.js");
const chat_js_1 = require("../../db/schema/chat.js");
const drizzle_orm_1 = require("drizzle-orm");
const logger_js_1 = require("../../lib/logger.js");
class ChatService {
    // In-memory registry of active WebSocket connections
    // Key: userId, Value: WebSocket instance
    activeConnections = new Map();
    /**
     * Register a user's WebSocket connection
     */
    registerConnection(userId, socket) {
        this.activeConnections.set(userId, socket);
        logger_js_1.logger.info({ userId }, '[chat] User connected');
        socket.on('close', () => {
            this.activeConnections.delete(userId);
            logger_js_1.logger.info({ userId }, '[chat] User disconnected');
        });
        socket.on('message', async (data) => {
            try {
                const payload = JSON.parse(data.toString());
                await this.handleIncomingMessage(userId, payload);
            }
            catch (err) {
                logger_js_1.logger.error({ err, userId }, '[chat] Error processing incoming message');
            }
        });
    }
    /**
     * Processes a message received from a user's WebSocket
     */
    async handleIncomingMessage(senderId, payload) {
        const { roomId, text } = payload;
        // 1. Validate room exists and user is a participant
        const [room] = await client_js_1.db.select().from(chat_js_1.chatRooms).where((0, drizzle_orm_1.eq)(chat_js_1.chatRooms.id, roomId)).limit(1);
        if (!room) {
            logger_js_1.logger.warn({ senderId, roomId }, '[chat] Invalid room ID');
            return;
        }
        if (room.customerId !== senderId && room.partnerId !== senderId) {
            logger_js_1.logger.warn({ senderId, roomId }, '[chat] User is not part of this room');
            return;
        }
        // 2. Persist message to database
        const [messageRecord] = await client_js_1.db.insert(chat_js_1.chatMessages).values({
            roomId,
            senderId,
            senderRole: senderId === room.customerId ? 'customer' : 'partner',
            message: text,
        }).returning();
        // 3. Dispatch to the recipient if they are online
        const recipientId = room.customerId === senderId ? room.partnerId : room.customerId;
        const recipientSocket = this.activeConnections.get(recipientId);
        const messageEnvelope = JSON.stringify({
            type: 'chat.message',
            data: messageRecord,
        });
        if (recipientSocket && recipientSocket.readyState === ws_1.WebSocket.OPEN) {
            recipientSocket.send(messageEnvelope);
            logger_js_1.logger.info({ senderId, recipientId, roomId }, '[chat] Message dispatched over WebSocket');
        }
        else {
            // 4. Fallback: Recipient is offline. Enqueue a push notification.
            logger_js_1.logger.info({ recipientId, roomId }, '[chat] Recipient offline, dispatching push notification');
            const { notificationQueue } = await import('../../lib/queue.js');
            await notificationQueue.add('push', {
                userId: recipientId,
                type: 'push',
                title: 'New Message',
                body: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                data: { roomId, messageId: messageRecord.id }
            });
        }
        // Also echo back to sender to confirm receipt (optional but good practice)
        const senderSocket = this.activeConnections.get(senderId);
        if (senderSocket && senderSocket.readyState === ws_1.WebSocket.OPEN) {
            senderSocket.send(JSON.stringify({ type: 'chat.ack', data: { messageId: messageRecord.id } }));
        }
    }
}
exports.ChatService = ChatService;
exports.chatService = new ChatService();
//# sourceMappingURL=chat.service.js.map