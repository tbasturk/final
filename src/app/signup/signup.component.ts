import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(public router: Router, private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.signUpForm.controls; }

  register() {
    const signUp = {
      username: this.f.username.value,
      password: this.f.password.value
    };
    // ch
    this.http.post('http://161.35.59.8/api/signup', signUp)
      .subscribe((res: any) => {
        console.log('testing');
        if (res && res.success) {
          this.router.navigate(['/login']);
        }
      }, (error: any) => {
        console.log(error);
        document.getElementById('message').innerHTML = error.error.err;
        document.getElementById('message').style.visibility = 'visible';
      });
  }
}
