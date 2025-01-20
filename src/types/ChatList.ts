import { User } from "./User";

export interface ChatList {
    user: User;
    lastMessage: string;
    lastMessageTime: string;
}