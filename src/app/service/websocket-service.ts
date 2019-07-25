import { Injectable } from '@angular/core';
import { ChatMessage } from '../dto/ChatMessage';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UrlPath } from '../app.costants';


@Injectable({
    providedIn: 'root'
})


export class WebsocketService{

    constructor (private http : HttpClient, private urlPath: UrlPath) {}

    private baseUrl = this.urlPath.basePath;

    public getMessage() : Observable<Array<ChatMessage>>{
        return this.http.get<Array<ChatMessage>>(this.baseUrl);
    }
}