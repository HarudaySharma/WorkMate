// src/socket.ts
import { io } from "socket.io-client";
import Cookies from "js-cookie";


const URL = "http://localhost:3001";

export const socket = io(URL, {
    path: "/api/chat/ws",
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

