import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@app/classes/users';
import { ReCapchaService } from '@app/services/re-capcha.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  // template: ``,
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    recaptcha: ['', Validators.required]
  });
  public readonly stayOn = this.fb.control(false);


  constructor(private authService: AuthService, private fb: FormBuilder,
    private cookie: CookieService, private router: Router, public recaptcha: ReCapchaService) { }

  get getusername() { return this.loginForm.controls.username; }
  get getpassword() { return this.loginForm.controls.password; }


  ngOnInit(): void {
    this.authService.getAllUsers();
  }

  public async onSubmit() {
    const { username, password }: { [key: string]: any } = this.loginForm.controls;

    try {
      const user = await this.authService.login({ username: username.value, password: password.value });
      if (user) {
        if (this.stayOn.value === true) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        this.router.navigateByUrl('/espace-user');
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    }
  }

}
