import { Conversation } from './Conversation';
import { User } from "./User";

export class ChatMessage {
    public type : string;
    public content : string;
    public  sender : User;
    public conversation : Conversation;
    public sendTime: Date;
}