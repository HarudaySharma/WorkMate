// src/socket.ts
import { io } from "socket.io-client";
import Cookies from "js-cookie";


const URL = "http://localhost:3001";

export const socket = io(URL, {
    path: "/api/chat/ws",
    // auth: {
    //     access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjIsIm5hbWUiOiJ4LTEiLCJ1c2VybmFtZSI6IngtMSIsImVtYWlsIjoieC0xQGlvLmNvbSIsInByb2ZpbGVfcGljdHVyZSI6Imh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPXgtMSJ9fSwiaWF0IjoxNzQ0MDk5NzMyfQ.RAVGl4qh8sLbT8zwBzKzM9b6o3gVAQyIw0DknrX2HDo",
    // },
    transports: ["websocket"],
    autoConnect: false,
});


export function disconnectSocket() {
    console.log("disconnecting socket connection")
    socket.disconnect()
}

export function connectSocketWithAuth() {
    console.log("creating a socket connection...")

    const access_token = Cookies.get("access_token"); // get from cookie
    socket.auth = { access_token: access_token };
    socket.connect();
}


// export const socket: Socket = io(URL, {
//   autoConnect: false,
// });

