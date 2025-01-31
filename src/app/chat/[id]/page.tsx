"use client";
import { useSocket } from '@/context/SocketContext';
import { GET_CHAT_HISTORY, GET_USER_DETAIL } from '@/graphql/graphql-queries';
import { ChatDetail as chatMessage } from '@/types/ChatDetail';
import { User } from '@/types/User';
import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const ChatDetail = () => {
    const { id } = useParams();
    const otherUserId = Array.isArray(id) ? id[0] : id;
    const router = useRouter();
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const { joinRoom, leaveRoom, currentRoom, sendMessage, onMessageReceived } = useSocket();

    const [messages, setMessages] = useState<chatMessage[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const { data: chatHistoryData } = useQuery(GET_CHAT_HISTORY, {
        variables: { otherUserId },
        skip: !otherUserId,
    });
    const { data: userDetailsData } = useQuery(GET_USER_DETAIL, {
        variables: { id: otherUserId },
    });

    // Send message
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentRoom || !currentUserId) return;

        const messageData = {
            senderId: currentUserId,
            roomId: currentRoom,
            message: newMessage,
        };

        sendMessage(messageData);
        setNewMessage('');
    }

    // Load user from localStorage
    useEffect(() => {
        const currentUser = localStorage.getItem('user');
        setCurrentUserId(currentUser ? JSON.parse(currentUser).id : null);
    }, []);

    // Join the chat room
    useEffect(() => {
        if (currentUserId && otherUserId) {
            joinRoom(currentUserId, otherUserId);
        }

        return () => {
            if (currentRoom) {
                leaveRoom(currentRoom);
            }
        };
    }, [currentUserId, otherUserId, joinRoom, currentRoom, leaveRoom]);

    // Load user and chat history
    useEffect(() => {
        if (userDetailsData?.getUserDetail) {
            setUser(userDetailsData.getUserDetail);
        }
        if (chatHistoryData?.getChatHistory) {
            setMessages(chatHistoryData.getChatHistory);
        }
    }, [userDetailsData, chatHistoryData]);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Listen for incoming messages
    useEffect(() => {
        onMessageReceived((newMsg) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    senderId: newMsg.senderId,
                    message: newMsg.message,
                    createdAt: new Date(),
                    formattedCreatedAt: new Date().toLocaleString(),
                    user: { id: newMsg.senderId, name: "Unknown", email: "" },
                }
            ]);
        });
    
        return () => onMessageReceived(null);
    }, [onMessageReceived]);

    return (
        <div className="min-h-screen md:flex md:justify-center md:items-center md:mt-2">
            <div className="w-full h-screen md:h-[80vh] md:max-w-md bg-white md:rounded-lg md:shadow-lg relative flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center bg-gray-800 text-white md:rounded-t-lg p-4">
                    <button
                        onClick={() => router.push('/chat')}
                        className="bg-transparent text-blue-500 p-2 rounded-md hover:bg-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <img
                        src="https://placehold.co/50"
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                        <h6 className="text-base font-medium">{user?.name || 'N/A'}</h6>
                        <span className="text-sm text-gray-300">Online</span>
                    </div>
                </div>

                {/* Messages Container */}
                <div
                    ref={messageContainerRef}
                    className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4 [scrollbar-width:thin] [scrollbar-color:#00f2fe_#f1f1f1] scroll-smooth custom-scrollbar"
                >
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id || `${msg.senderId}-${index}`}
                            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-2xl ${msg.senderId === currentUserId
                                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <p className="break-words">{msg.message}</p>
                                {/* <span className="block text-xs mt-1 opacity-75">
                                    {msg.formattedCreatedAt}
                                </span> */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input - Fixed at bottom */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full px-6 py-2 hover:opacity-90 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatDetail