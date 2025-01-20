import { User } from "./User";

export interface ChatDetail {
    senderId: string;
    message: string;
    createdAt: Date;
    user: User
}