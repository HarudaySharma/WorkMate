// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { socket, connectSocketWithAuth } from "../socket";

export function useSocket() {
    const INFO_EVENT = "info"

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!socket.connected && !connected) {
            connectSocketWithAuth();
        }
        console.log("useSocket rendered")

        const handleConnect = () => {
            console.log("Connected to socket server:", socket.id);
            setConnected(true);
        }
        const handleDisconnect = () => {
            console.log("Disconnected from socket server:", socket.id);
            setConnected(false);
        }
        const handleInfoEvent = (msg: any) => {
            console.log(msg)
        }
        const handleConnectionError = (err: Error) => {
            console.error("❌ Connection error:", err);
        }

        socket.on("connect", handleConnect)
        socket.on("disconnect", handleDisconnect)
        socket.on("connect_error", handleConnectionError)
        socket.on(INFO_EVENT, handleInfoEvent)

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectionError)
            socket.off(INFO_EVENT, handleInfoEvent)

            // if (socket.connected) {
            //     console.log("disconnecting socket connection")
            //     socket.disconnect();
            // }
        };
    }, []);

    return { socket, connected };
}
