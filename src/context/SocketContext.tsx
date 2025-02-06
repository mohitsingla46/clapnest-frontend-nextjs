"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (userId: string, otherUserId: string) => void;
    leaveRoom: (userId: string, roomId: string) => void;
    currentRoom: string | null;
    sendMessage: (messageData: any) => void;
    onMessageReceived: (callback: ((message: any) => void) | null) => void;
    userStatuses: Array<{ userId: string; online: boolean; lastSeen?: string, formattedLastSeen?: string }>;
    setUserStatuses: React.Dispatch<React.SetStateAction<Array<{ userId: string; online: boolean; lastSeen?: string; formattedLastSeen?: string }>>>;
    markMessagesAsRead: (userId: string, roomId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [userStatuses, setUserStatuses] = useState<Array<{ userId: string; online: boolean; lastSeen?: string, formattedLastSeen?: string }>>([]);
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("user");
            if (user) {
                setUserData(JSON.parse(user));
            }
        }
    }, []);

    useEffect(() => {
        if (!userData) return;

        const newSocket = io(SOCKET_SERVER_URL, {
            query: {
                userId: userData.id
            }
        });

        newSocket.on("connect", () => setIsConnected(true));

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            setCurrentRoom(null);
        });

        newSocket.on("roomJoined", (data: { roomId: string; message: string }) => {
            setCurrentRoom(data.roomId);
        });

        newSocket.on("userStatusUpdate", (data: { userId: string; online: boolean; lastSeen?: string, formattedLastSeen?: string }) => {
            setUserStatuses(prev => {
                const updatedStatuses = prev.filter(status => status.userId !== data.userId);
                updatedStatuses.push({ userId: data.userId, online: data.online, lastSeen: data.lastSeen, formattedLastSeen: data.formattedLastSeen });
                return updatedStatuses;
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userData]);

    const joinRoom = (userId: string, otherUserId: string) => {
        if (socket) {
            socket.emit("joinRoom", { userId, otherUserId });
        }
    };

    const leaveRoom = (userId: string, roomId: string) => {
        if (socket) {
            socket.emit("leaveRoom", { userId, roomId });
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

    const markMessagesAsRead = (userId: string, roomId: string) => {
        if (!socket || !userId || !roomId) return;

        if (isUserInChatRoom(userId, roomId)) {
            socket.emit("markAsRead", { userId, roomId });
        }
    };

    const isUserInChatRoom = (userId: string, roomId: string) => {
        if (!userData) return;
        return currentRoom === roomId && userId === userData.id;
    };

    return <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom, currentRoom, sendMessage, onMessageReceived, userStatuses, setUserStatuses, markMessagesAsRead }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};