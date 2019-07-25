import { UserService } from './../service/user-service';
import { User } from './../dto/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private router: Router, private userService : UserService) { }

  ngOnInit() {
  }

  login(){
    let user : User = new User();
    user.username = this.username;
    user.password = this.password;
    this.userService.login(user).subscribe(
      data => {
        console.log(data);
        localStorage.setItem("username",this.username);
        this.router.navigate(['/chat']);
      },
      error => {
        console.log(error);
      }
    )
    
  }
  register(){
    this.router.navigate(['/signup']);
  }
}
