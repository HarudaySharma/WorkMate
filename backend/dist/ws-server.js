"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const zod_1 = __importDefault(require("./zod"));
const logger_1 = __importDefault(require("./logger"));
const socket_io_1 = require("socket.io");
const verifyToken_middleware_1 = require("./middlewares/verifyToken.middleware");
const generateRoomId_1 = __importDefault(require("./utils/generateRoomId"));
const workmate_service_1 = __importDefault(require("./services/workmate/workmate.service"));
const mysql_service_1 = __importDefault(require("./services/mqsql/mysql.service"));
const server = http_1.default.createServer();
const io = new socket_io_1.Server(server, {
    path: "/api/chat/ws",
    cors: {
        // origin: [
        //     "http://localhost:5173",
        //     "http://localhost:3000",
        //     "http://localhost:3001",
        // ]
        origin: "*",
    }
});
const INFO_EVENT = "info";
io.use(verifyToken_middleware_1.wsVerifyToken);
io.on('connection', (socket) => {
    // connection to be established when user opens the chat section.
    logger_1.default.info(`connected to id:${socket.id}`);
    socket.on("get-messages", async ({ chatId, workspaceId, offset, limit }) => {
        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"));
            return;
        }
        const { user } = socket.data;
        // get all the messages
        try {
            const workmate = new workmate_service_1.default(mysql_service_1.default);
            const ret = await workmate.getChatMessages({
                userId: user.id,
                workspaceId: workspaceId,
                chatId: chatId,
            });
            const roomId = (0, generateRoomId_1.default)(workspaceId, chatId);
            io.to(roomId).emit("chat-messages", ret.data.messages);
        }
        catch (err) {
            console.error("get-messages error:", err);
            socket._error(new Error("Failed to get messages"));
        }
    });
    socket.on("create-message", async ({ message, chat, workspaceId }) => {
        if (!workspaceId && !chat) {
            socket._error(new Error("please send workspace id an chat id"));
            return;
        }
        const { user } = socket.data;
        try {
            // save the msg to the db and broadcast the message to all the chat room
            const workmate = new workmate_service_1.default(mysql_service_1.default);
            const ret = await workmate.createMessage({
                userId: user.id,
                chat: {
                    id: chat.id,
                    type: chat.type,
                    workspace_id: workspaceId,
                },
                msg: {
                    type: message.type,
                    text: message.text || null,
                    audio_url: message.audio_url || null,
                    image_url: message.image_url || null,
                }
            });
            const roomId = (0, generateRoomId_1.default)(workspaceId, chat.id);
            io.to(roomId).emit("new-message", ret.data.message);
        }
        catch (err) {
            console.error("create-message error:", err);
            socket._error(new Error("Failed to get messages"));
        }
    });
    socket.on("join-chat", ({ workspaceId, chatId }) => {
        // NOTE: check if the user is already present in any chat
        // HACK: to avoid doing this expensive task, just make sure that client is leaving there previous chat room before entering into new one.
        // make the user join the specific chat room
        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"));
            return;
        }
        logger_1.default.info({ workspaceId, chatId });
        const { user } = socket.data;
        logger_1.default.info(user);
        const roomId = (0, generateRoomId_1.default)(workspaceId, chatId);
        socket.join(roomId);
        //socket.to(roomId).emit("message", `User: ${user.name} joined the room with id: ${roomId}`)
        logger_1.default.info(`${user.username} joined the chat: ${chatId}`);
        io.to(roomId).emit(INFO_EVENT, `${user.username} joined the chat`); // emits to all room members including the sender.
        // NOTE: if the client wants to switch to other chat, they must leave the chat room they are currently in first.
    });
    socket.on("leave-chat", (data) => {
        const { workspaceId, chatId } = data;
        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"));
            return;
        }
        const roomId = (0, generateRoomId_1.default)(workspaceId, chatId);
        const { user } = socket.data;
        socket.leave(roomId);
        logger_1.default.info(`${user.username} left the chat ${chatId}`);
        io.to(roomId).emit(INFO_EVENT, `${user.username} left the chat`); // emits to all room members including the sender.
    });
});
function startWSServer() {
    server.listen(zod_1.default.WS_PORT, () => {
        logger_1.default.info(`web socket http server running on http://localhost:${zod_1.default.WS_PORT}`);
    });
}
exports.default = startWSServer;
