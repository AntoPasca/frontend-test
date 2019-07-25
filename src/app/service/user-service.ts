import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { UrlPath } from '../app.costants';
import { User } from '../dto/User';


@Injectable({
    providedIn: 'root'
})


export class UserService{

    constructor (private http : HttpClient, private urlPath: UrlPath) {}
    
    public registra(user: User) : Observable<any>{
        return this.http.post(this.urlPath.registraUtente, user);
    }

    public login(user: User) : Observable<User>{
        return this.http.post<User>(this.urlPath.loginUtente, user);
    }

}