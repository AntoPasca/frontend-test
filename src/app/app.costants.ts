
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class UrlPath {
    private basePath = environment.backendUrl.concat("websocket/");

    public webSocketChatUrl = this.basePath.concat("ws");
}