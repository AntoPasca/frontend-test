import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlPath } from '../app.costants';
import { Observable } from 'rxjs';
import { IncomingChatMessage } from '../dto/ChatMessage';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private http: HttpClient, private urlPath: UrlPath) { }

    public eliminaMessaggio(messageId: string): Observable<any> {
        return this.http.delete(this.urlPath.eliminaMessaggio.replace("${messageId}", messageId), { responseType: 'text' });
    }

    public getMessaggi(userID: string, roomID: string): Observable<Array<IncomingChatMessage>> {
        const params = encodeURIComponent(JSON.stringify({ 'userID': userID, 'roomID': roomID }));
        return this.http.get<Array<IncomingChatMessage>>(this.urlPath.messaggio.concat("?params=").concat(params));
    }
}