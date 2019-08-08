import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn: BehaviorSubject<boolean>;

  constructor() {
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
}
