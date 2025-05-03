// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { socket, connectSocketWithAuth } from "../socket";

export function useSocket() {
    const INFO_EVENT = "info"

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        console.log({ socketCon: socket.connected, connected })
    }, [socket.connected, connected])

    useEffect(() => {
        console.log("useSocket rendered")

        if (!socket.connected && !connected) {
            connectSocketWithAuth();
        }

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
            console.log({ socketCon: socket.connected, connected })
            if (!socket.connected) {
                setConnected(false)
                connectSocketWithAuth()
                setConnected(true)
            }
        }

        socket.on("connect", handleConnect)
        socket.on("disconnect", handleDisconnect)
        socket.on("connect_error", handleConnectionError)
        socket.on(INFO_EVENT, handleInfoEvent)

        return () => {
            console.log("socket hook clearing")
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
