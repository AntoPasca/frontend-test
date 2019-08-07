import { UserService } from './../service/user-service';
import { Component, OnInit } from '@angular/core';
import { User } from '../dto/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  registerForm : FormGroup;
  submitted = false;
  success = false;
  error = false;

  constructor(private userService : UserService , private route : Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nome : ['', Validators.required],
      cognome : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      username : ['', Validators.required],
      password : ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.registerForm.controls; }

  registra(){
    this.success = false;
    this.error = false;
    this.submitted = true;
    if(this.registerForm.invalid){
      return
    }
    let user : User = new User();
    user = <User> this.registerForm.value;
    this.userService.registra(user).subscribe(
      (data : String) => {
        console.log('id: ',data);
        this.success = true;
        // this.route.navigate(['']);
      },
      err => {
        let error = JSON.parse(err.error);
        if(error.message == 'ERRREG'){
          this.error = true;
        }
        console.log(err); 
      }
    )
  }

  backPage(){
    this.route.navigate(['']);
  }
}
