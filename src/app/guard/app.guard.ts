import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {

  constructor(
    private authService: LoginService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    console.log('GUARDIA ATTIVATA');
    return this.authService.observeLoggedIn()
      .pipe(
        tap(isLoggedIn => {
          if (!isLoggedIn) {
            this.router.navigateByUrl('');
          }
        })
      );
  }
}
