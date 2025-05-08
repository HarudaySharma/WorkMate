import { io } from "socket.io-client";
import { CreateMessageRet, CreateMessageEventParams } from "../types/workspace.service";

const socket = io("http://localhost:3001", {
    path: "/api/chat/ws",
    auth: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjIsIm5hbWUiOiJ4LTEiLCJ1c2VybmFtZSI6IngtMSIsImVtYWlsIjoieC0xQGlvLmNvbSIsInByb2ZpbGVfcGljdHVyZSI6Imh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPXgtMSJ9fSwiaWF0IjoxNzQ0MDk5NzMyfQ.RAVGl4qh8sLbT8zwBzKzM9b6o3gVAQyIw0DknrX2HDo",
    },
    transports: ["websocket"],
});

// Handle connection
socket.on("connect", () => {
    console.log("✅ Connected to socket server!");
    console.log("Socket ID:", socket.id);
});


const joinChat = () => {
    console.log("joining the chat")
    socket.emit("join-chat", {
        "workspaceId": 1,
        "chatId": 2,
    });
}

// const createMessage = () => {
//     console.log("creating a new message....")
//     socket.emit("create-message", {
//         "workspaceId": 1,
//         "chatId": 2,
//         message: {
//             type: 'text',
//             text: "this is a dummy text",
//         },
//         chat: {
//             id: chat
//         }
//     } as CreateMessageEventParams,);
// }
//
socket.on("new-message", (retObj: CreateMessageRet) => {
    console.log("new message recieved")
    console.log(retObj)
})

const INFO_EVENT = "info"

socket.on(INFO_EVENT, (msg) => {
    console.log(msg)
})

// Handle errors
socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
});

// You can emit or listen to other events as needed
// socket.emit("some-event", { ... });
// socket.on("message", (data) => console.log(data));

function start() {
    joinChat()
    // createMessage()
}


start()
