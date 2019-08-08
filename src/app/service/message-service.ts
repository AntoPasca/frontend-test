import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlPath } from '../app.costants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private http: HttpClient, private urlPath: UrlPath) { }

    public eliminaMessaggio(messageId: string): Observable<any> {
        return this.http.delete(this.urlPath.eliminaMessaggio.replace("${messageId}", messageId), { responseType : 'text'});
    }

}