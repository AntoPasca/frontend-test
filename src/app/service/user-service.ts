import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { UrlPath } from '../app.costants';
import { User } from '../dto/User';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private urlPath: UrlPath) { }

    public registra(user: User): Observable<String> {
        return this.http.post(this.urlPath.registraUtente, user, { responseType: "text" });
    }

    public login(user: User): Observable<User> {
        return this.http.post<User>(this.urlPath.loginUtente, user);
    }

    public getUtente(username: User): Observable<Array<User>> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = encodeURIComponent(JSON.stringify(username));
        return this.http.get<Array<User>>(this.urlPath.userPath + "/?params=" + params, { headers: headers });
    }

    public getUtenti(): Observable<Array<User>> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = encodeURIComponent(JSON.stringify({}));
        return this.http.get<Array<User>>(this.urlPath.userPath + "/?params=" + params, { headers: headers });
    }

}