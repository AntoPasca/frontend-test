import { UserService } from './../service/user-service';
import { Component, OnInit } from '@angular/core';
import { User } from '../dto/User';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  constructor(private userService : UserService , private route : Router) { }

  ngOnInit() {
  }

  registra(form : FormGroup){
    let user : User = new User();
    user = <User> form.value;
    this.userService.registra(user).subscribe(
      data => {
        alert("REGISTRATO");
        console.log("ciao")
      },
      error => {
        console.log(error); 
      }
    )
  }

  backPage(){
    this.route.navigate(['']);
  }
}
