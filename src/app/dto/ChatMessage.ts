import { User } from "./User";
import { Room } from './Room';
import { ChatMessageType } from '../enum/ChatMessageType';

export class ChatMessage {
    public id: string;
    public type: ChatMessageType;
    public content: string;
    public sender: User;
    public room: Room;
    public sendTime: Date;
}