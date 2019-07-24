import { Injectable } from '@angular/core';
import { ChatMessage } from './../ChatMessage';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class WebsocketService{

    private baseUrl = "http://websocket-chat-websocketchat.apps.us-west-2.online-starter.openshift.com/websocket/";

    constructor (private http : HttpClient) {}

    public getMessage() : Observable<Array<ChatMessage>>{
        return this.http.get<Array<ChatMessage>>(this.baseUrl);
    }
}