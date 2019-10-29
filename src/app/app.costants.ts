
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class UrlPath {
    public basePath = environment.backendUrl.concat("websocket/");
    public userPath = this.basePath.concat("utente/");
    public webSocketChatUrl = this.basePath.concat("ws");
    public registraUtente = this.userPath;
    public loginUtente = this.userPath.concat("login/");
    public messaggio = this.basePath.concat("messaggio");
    public eliminaMessaggio = this.messaggio.concat("/${messageId}");

    // room 
    public roomPath = this.basePath.concat("stanza/");
    public messageRoomPath = this.roomPath.concat("${roomId}/messaggio");
}