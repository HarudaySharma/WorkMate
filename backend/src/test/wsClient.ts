import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
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
socket.on("connect", () => {
  console.log("✅ Connected to socket server!");
  console.log("Socket ID:", socket.id);
});


socket.on("message", (msg) => {
    console.log(msg)
})
// Handle errors
socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

// You can emit or listen to other events as needed
// socket.emit("some-event", { ... });
// socket.on("message", (data) => console.log(data));

