import { ChatMessageType } from '../enum/ChatMessageType';
/*
oggetto utilizzato per comunicazione da FE a BE. oggetto in uscita dall'utente verso molti
*/
export class ForwardChatMessage {
    public content: string;
    public userID: string;
    public roomID: string;
}

/*
oggetto utilizzato per comunicazione da BE a FE. oggetto in entrata dagl'altri utenti.
*/
export class IncomingChatMessage {
    public type: ChatMessageType;
    public content: string;
    public senderUsername: string;
    public roomTitle: string;
    public sendTime: Date;
}