"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (userId: string, otherUserId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL);

        newSocket.on("connect", () => {
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        newSocket.on("roomJoined", (data: { roomId: string; message: string }) => {
            console.log(data.message);
            setCurrentRoom(data.roomId);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const joinRoom = (userId: string, otherUserId: string) => {
        if (socket) {
            socket.emit("joinRoom", { userId, otherUserId });
        }
    };

    return <SocketContext.Provider value={{ socket, isConnected, joinRoom }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};