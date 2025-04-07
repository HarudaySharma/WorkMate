import http from "http"
import env from "./zod"
import logger from "./logger"
import { Server } from "socket.io"
import { wsVerifyToken } from "./middlewares/verifyToken.middleware"

import { JWTPayload } from "./types"

const server = http.createServer()

const io = new Server(server, {
    path: "/api/chat/ws",
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
        ]
    }
})


io.use(wsVerifyToken)
io.on('connection', (socket) => {
    logger.info(`connected to id:${socket.id}`)

    const {workspaceId, chatId} = socket.handshake.query;
    logger.info({workspaceId, chatId})

    const { user } = socket.data as { user: JWTPayload["data"]["user"] };
    logger.info(user)
})

export default function startWSServer() {
    server.listen(env.WS_PORT, () => {
        logger.info(`web socket http server running on http://localhost:${env.WS_PORT}`)
    })
}
