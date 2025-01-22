import { User } from "./User";

export interface ChatDetail {
    id: string;
    senderId: string;
    message: string;
    createdAt: Date;
    user: User
}