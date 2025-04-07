"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var socket = (0, socket_io_client_1.io)("http://localhost:3001", {
    path: "/api/chat/ws",
    auth: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjMsIm5hbWUiOiJ4LTMiLCJ1c2VybmFtZSI6IngtMyIsImVtYWlsIjoieC0zQGlvLmNvbSIsInByb2ZpbGVfcGljdHVyZSI6Imh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPXgtMyJ9fSwiaWF0IjoxNzQ0MDExMDE1fQ._cn49gJHqjIrDkBaMImGE464TqgYUwVKNCvERZu0gng",
    },
    query: {
        workspaceId: "1",
        chatId: "2",
    },
    transports: ["websocket"],
});
// Handle connection
socket.on("connect", function () {
    console.log("✅ Connected to socket server!");
    console.log("Socket ID:", socket.id);
});
// Handle errors
socket.on("connect_error", function (err) {
    console.error("❌ Connection error:", err.message);
});
// You can emit or listen to other events as needed
// socket.emit("some-event", { ... });
// socket.on("message", (data) => console.log(data));
