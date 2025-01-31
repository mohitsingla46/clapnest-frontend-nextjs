"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (userId: string, otherUserId: string) => void;
    leaveRoom: (roomId: string) => void;
    currentRoom: string | null;
    sendMessage: (messageData: any) => void;
    onMessageReceived: (callback: ((message: any) => void) | null) => void;
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
            setCurrentRoom(null);
        });

        newSocket.on("roomJoined", (data: { roomId: string; message: string }) => {
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

    const leaveRoom = (roomId: string) => {
        if (socket) {
            socket.emit("leaveRoom", { roomId });
            setCurrentRoom(null);
        }
    };

    const sendMessage = (messageData: any) => {
        if (!socket || !currentRoom) return;
        socket.emit("message", { ...messageData, roomId: currentRoom });
    };

    const onMessageReceived = (callback: ((message: any) => void) | null) => {
        if (!socket) return;
        if (callback) {
            socket.on("message", callback);
        } else {
            socket.off("message");
        }
    };

    return <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom, currentRoom, sendMessage, onMessageReceived }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};