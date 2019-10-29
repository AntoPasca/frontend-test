import { UserService } from './../service/user-service';
import { User } from './../dto/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { Link, Node } from '../d3/models';
import CONFIG from '../app.config';



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
  errlogin = false;

  nodes: Node[] = [];
  links: Link[] = [];

  constructor(private router: Router, private userService: UserService, private loginService: LoginService) {
    const N = CONFIG.N,
      getIndex = number => number - 1;

    /** constructing the nodes array */
    for (let i = 1; i <= N; i++) {
      this.nodes.push(new Node(i));
    }

    for (let i = 1; i <= N; i++) {
      for (let m = 2; i * m <= N; m++) {
        /** increasing connections toll on connecting nodes */
        this.nodes[getIndex(i)].linkCount++;
        this.nodes[getIndex(i * m)].linkCount++;

        /** connecting the nodes before starting the simulation */
        this.links.push(new Link(i, i * m));
      }
    }
  }

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
        // connect ws
        this.loginService.connectApplication(data.id).then(resolve => {
          this.router.navigate(['/chat']);
        })
      },
      err => {
        if (err.error.message == 'ERRUSR') {
          this.errusr = true;
        }
        else if (err.error.message == 'ERRPSW') {
          this.errpsw = true;
        } else if (err.error.message == "ERRLOGIN") {
          this.errlogin = true;
        }
      }
    )

  }
  register() {
    this.router.navigate(['/signup']);
  }
}
