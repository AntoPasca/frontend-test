import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlPath } from '../app.costants';
import { Observable } from 'rxjs';
import { Room } from '../dto/Room';

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    constructor(private http: HttpClient, private urlPath: UrlPath) { }

    public crea(room: Room): Observable<any> {
        return this.http.post(this.urlPath.roomPath, room);
    }

    public getStanza(roomExample: Room): Observable<Array<Room>> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = encodeURIComponent(JSON.stringify(roomExample));
        return this.http.get<Array<Room>>(this.urlPath.roomPath + "/?params=" + params, { headers: headers });
    }
}