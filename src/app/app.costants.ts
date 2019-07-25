
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class UrlPath {
    public basePath = environment.backendUrl.concat("websocket/");
    private USER_PATH = this.basePath.concat("utente/");
    public webSocketChatUrl = this.basePath.concat("ws");
    public registraUtente = this.USER_PATH;
    public loginUtente = this.USER_PATH.concat("login/");
}