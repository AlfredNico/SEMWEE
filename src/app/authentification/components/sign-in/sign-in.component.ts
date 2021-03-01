import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCapchaService } from '@app/services/re-capcha.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  template: `
       <div class="login-content">
        <mat-card class="w-75 p-0" fxLayout="row" fxLayoutAlign="center center">
          <!-- <div class="w-100 h-100 m-0 p-0">-->
            <img class="h-100 w-100" [src]="'./assets/images/bg_image.jpeg'" alt="images layout"/>
            <!-- <div class="left-layout h-100 w-100"></div> -->
         <!--  </div>-->
          <div class="w-100 p-5">
            <mat-card-header class="w-100" fxLayout="row" fxLayoutAlign="center center">
              <mat-card-title class="py-2">Se connecter</mat-card-title>
            </mat-card-header>

          <form [formGroup]="loginForm" #form="ngForm" (ngSubmit)="form.valid && onSubmit()" class="login-form">
            <mat-card-content>
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Adresse e-mail</mat-label>
                <input matInput type="email" formControlName="username">
                <mat-error *ngIf="getusername.errors && getusername.errors.required">Adresse e-amil est requise</mat-error>
                <mat-error *ngIf="getusername.errors && getusername.errors.email">Adresse e-amil invalide</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Mot de passe</mat-label>
                <input matInput type="password" formControlName="password" autocomplete="off">
                <mat-icon matSuffix>visibility_off</mat-icon>
                <mat-error *ngIf="getpassword.errors && getpassword.errors.required">Mot de passe requis</mat-error>
              </mat-form-field>

              <div fxLayout="row" fxLayoutAlign="space-between center">
                <mat-checkbox>Rester connecter</mat-checkbox>
                <div>
                  <a [routerLink]="['/']"> Mot de passe oublié</a>
                </div>
              </div>

              <div fxLayout="row" fxLayoutAlign="center center">
                <ngx-recaptcha2 #captchaElem 
                  [siteKey]="recaptcha.siteKey"
                  [size]="recaptcha.size"
                  formControlName="recaptcha">
                </ngx-recaptcha2>
              </div>

            </mat-card-content>

            <mat-card-actions fxLayout="row" fxLayoutAlign="center center" class="m-0 p-0">
              <button mat-stroked-button color="accent">Se connecter</button>
            </mat-card-actions>
          </form>
          </div>
        </mat-card> 
      </div> 
  `,
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    recaptcha: ['', Validators.required]
  });

  constructor(private authService: AuthService, private fb: FormBuilder,
    private cookie: CookieService,private router: Router, public recaptcha: ReCapchaService) { }

  get getusername() { return this.loginForm.controls.username; }
  get getpassword() { return this.loginForm.controls.password; }


  ngOnInit(): void {
    this.authService.getAllUsers();
  }

  public async onSubmit() {
    const { username, password }: { [key: string]: any } = this.loginForm.controls;
    
    try {
      const user = await this.authService.login({ username: username.value, password: password.value});
      if (user) {
        this.cookie.set('id', JSON.stringify(user.id), 0.2, '/', 'semewee', true, 'Strict');
        this.cookie.set('semewee', user.token, 0.2, '/', 'semewee', true, 'Strict');
        this.cookie.set('firstName', user.firstName, 0.2, '/', 'semewee', true, 'Strict');
        this.cookie.set('lastName', user.lastName, 0.2, '/', 'semewee', true, 'Strict');
        this.cookie.set('password', user.password, 0.2, '/', 'semewee', true, 'Strict');
        this.cookie.set('password', user.username, 0.2, '/', 'semewee', true, 'Strict');

        this.router.navigateByUrl('/espace-user');
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    }
  }

}
