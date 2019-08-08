import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { UrlPath } from '../app.costants';
import { User } from '../dto/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn: BehaviorSubject<boolean>;
  public isConnected = new Subject<boolean>();
  public stompClient: Stomp.Client = null;
  private userConnected: User = null;

  constructor(private urlPath: UrlPath) {
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  public isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  public setLoggedIn(flag: boolean): void {
    this.loggedIn.next(flag);
  }

  public observeLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public connectApplication(userId: string): Subject<boolean> {
    const socket = new SockJS(this.urlPath.webSocketChatUrl);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({ userId: userId }, () => {
      this.isConnected.next(true);
    }, () => console.log("stomp client error")
    );
    return this.isConnected;
  }

  public disconnectApplication() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => console.log("stomp client disconnected"));
    }
  }

  getConnectedUser(): User {
    return this.userConnected;
  }

  setConnectedUser(user: User) {
    this.userConnected = user;
  }
}
