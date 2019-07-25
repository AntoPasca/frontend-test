import { User } from "./User";

export class ChatMessage {
    public type : string;
    public content : string;
    public  sender : User;
    public sendTime: Date;
}