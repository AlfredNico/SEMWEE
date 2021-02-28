import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
                <mat-label>Mot de passe</mat-label>
                <input matInput formControlName="username">
                <mat-error *ngIf="getusername.errors && getusername.errors.required">Adresse e-amil est requise</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Mot de passe</mat-label>
                <input matInput formControlName="password">
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
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  get getusername() { return this.loginForm.controls.username; }
  get getpassword() { return this.loginForm.controls.password; }


  ngOnInit(): void {
    this.authService.getAllUsers();
  }

  public onSubmit() {
    this.authService.login(this.loginForm.value);
  }

}
