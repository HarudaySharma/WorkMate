import http from "http"
import env from "./zod"
import logger from "./logger"
import { Server } from "socket.io"
import { wsVerifyToken } from "./middlewares/verifyToken.middleware"

import { JWTPayload } from "./types"
import generateRoomId from "./utils/generateRoomId"
import Workmate from "./services/workmate/workmate.service"
import db from "./services/mqsql/mysql.service"
import { CreateMessageEventParams, GetMessagesEventParams, JoinChatEventParams, LeaveChatEventParams } from "./types/workspace.service"

const server = http.createServer()

const io = new Server(server, {
    path: "/api/chat/ws",
    cors: {
        // origin: [
        //     "http://localhost:5173",
        //     "http://localhost:3000",
        //     "http://localhost:3001",
        // ]
        origin: "*",
    }
})


const INFO_EVENT = "info"

io.use(wsVerifyToken)
io.on('connection', (socket) => {
    // connection to be established when user opens the chat section.
    logger.info(`connected to id:${socket.id}`)

    socket.on("get-messages", async ({ chatId, workspaceId, offset, limit }: GetMessagesEventParams) => {
        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"))
            return
        }

        const { user } = socket.data as { user: JWTPayload["data"]["user"] };

        // get all the messages
        try {
            const workmate = new Workmate(db);
            const ret = await workmate.getChatMessages({
                userId: user.id,
                workspaceId: workspaceId,
                chatId: chatId,
            })

            const roomId = generateRoomId(workspaceId, chatId)
            io.to(roomId).emit("chat-messages", ret.data.messages)
        } catch (err) {
            console.error("get-messages error:", err);
            socket._error(new Error("Failed to get messages"))
        }
    })

    socket.on("create-message", async ({ message, chatId, workspaceId }: CreateMessageEventParams) => {
        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"))
            return
        }

        const { user } = socket.data as { user: JWTPayload["data"]["user"] };

        try {
            // save the msg to the db and broadcast the message to all the chat room
            const workmate = new Workmate(db);
            const ret = await workmate.createMessage({
                userId: user.id,
                chat: {
                    id: chatId,
                    workspace_id: workspaceId,
                },
                msg: {
                    type: message.type,
                    text: message.text || null,
                    audio_url: message.audio_url || null,
                    image_url: message.image_url || null,
                }
            })

            const roomId = generateRoomId(workspaceId, chatId)
            io.to(roomId).emit("new-message", ret.data.message)
        }
        catch (err) {
            console.error("create-message error:", err);
            socket._error(new Error("Failed to get messages"))
        }

    })

    socket.on("join-chat", ({ workspaceId, chatId }: JoinChatEventParams) => {
        // NOTE: check if the user is already present in any chat
        // HACK: to avoid doing this expensive task, just make sure that client is leaving there previous chat room before entering into new one.

        // make the user join the specific chat room
        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"))
            return
        }

        logger.info({ workspaceId, chatId })

        const { user } = socket.data as { user: JWTPayload["data"]["user"] };
        logger.info(user)

        const roomId = generateRoomId(workspaceId, chatId)

        socket.join(roomId)

        //socket.to(roomId).emit("message", `User: ${user.name} joined the room with id: ${roomId}`)
        io.to(roomId).emit(INFO_EVENT, `${user.username} joined the chat`) // emits to all room members including the sender.
        // NOTE: if the client wants to switch to other chat, they must leave the chat room they are currently in first.
    })

    socket.on("leave-chat", (data: LeaveChatEventParams) => {
        const { workspaceId, chatId } = data as { workspaceId: number, chatId: number }

        if (!workspaceId && !chatId) {
            socket._error(new Error("please send workspace id an chat id"))
            return
        }

        const roomId = generateRoomId(workspaceId, chatId)
        const { user } = socket.data as { user: JWTPayload["data"]["user"] };

        socket.leave(roomId)
        io.to(roomId).emit(INFO_EVENT, `${user.username} left the chat`) // emits to all room members including the sender.
    })
})

function startWSServer() {
    server.listen(env.WS_PORT, () => {
        logger.info(`web socket http server running on http://localhost:${env.WS_PORT}`)
    })
}

export default startWSServer
