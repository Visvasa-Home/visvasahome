"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = chatRouter;
const chat_service_js_1 = require("../../services/chat/chat.service.js");
const jwt_js_1 = require("../../lib/jwt.js");
async function chatRouter(fastify) {
    // We attach the websocket handler to /ws
    fastify.get('/ws', { websocket: true }, (connection, req) => {
        // We must authenticate the connection first.
        // Clients can pass token via query parameter ?token=... or standard headers.
        const tokenQuery = req.query?.token;
        const tokenHeader = req.headers.authorization;
        let token = '';
        if (tokenHeader) {
            token = (0, jwt_js_1.extractBearer)(tokenHeader);
        }
        else if (tokenQuery) {
            token = tokenQuery;
        }
        if (!token) {
            connection.send(JSON.stringify({ error: 'Unauthorized: No token provided' }));
            return connection.close(1008, 'Unauthorized');
        }
        (0, jwt_js_1.verifyToken)(token).then((payload) => {
            // Successfully authenticated
            chat_service_js_1.chatService.registerConnection(payload.sub, connection);
        }).catch((err) => {
            connection.send(JSON.stringify({ error: 'Unauthorized: Invalid token' }));
            connection.close(1008, 'Unauthorized');
        });
    });
}
//# sourceMappingURL=chat.js.map