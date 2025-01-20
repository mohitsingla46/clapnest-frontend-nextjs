import { User } from "./User";

export interface ChatList {
    user: User;
    roomId: string;
    lastMessage: string;
    lastMessageTime: string;
}