import { UserService } from './../service/user-service';
import { User } from './../dto/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  username: string = '';
  password: string = '';
  errusr = false;
  errpsw = false;

  constructor(private router: Router, private userService: UserService, private loginService: LoginService) { }

  ngOnInit() {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }

  login() {
    this.errpsw = false;
    this.errusr = false;
    let user: User = new User();
    user.username = this.username;
    user.password = this.password;
    this.userService.login(user).subscribe(
      data => {
        console.log(data);
        this.loginService.setConnectedUser(data);
        this.loginService.setLoggedIn(true);
        this.router.navigate(['/chat']);
      },
      err => {
        if (err.error.message == 'ERRUSR') {
          this.errusr = true;
        }
        else if (err.error.message == 'ERRPSW') {
          this.errpsw = true;
        }
      }
    )

  }
  register() {
    this.router.navigate(['/signup']);
  }
}
