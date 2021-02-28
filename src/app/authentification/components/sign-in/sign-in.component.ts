import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  template: `
      <div class="login-content">
        <mat-card>
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
            </mat-card-content>

            <mat-card-actions fxLayout="row" fxLayoutAlign="center center">
              <button mat-stroked-button color="accent">Se connecter</button>
            </mat-card-actions>
          </form>
        </mat-card> 
      </div>
      
  `,
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private fb: FormBuilder,
    private notifs: NotificationService, private router: Router) { }

  get getusername() { return this.loginForm.controls.username; }
  get getpassword() { return this.loginForm.controls.password; }


  ngOnInit(): void {
    this.authService.getAllUsers();
  }

  public async onSubmit() {
    try {
      const user = await this.authService.login(this.loginForm.value);
      if (user) {
        this.router.navigateByUrl('/');
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    }
  }

}
