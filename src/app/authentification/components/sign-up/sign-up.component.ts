import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { SignUpService } from '@app/authentification/services/sign-up.service';
import { Users } from '@app/models/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { CustomValidationService } from '@app/shared/services/custom-validation.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  hide = true;
  submitted = false;

  registrationForm = this.fb.group(
    {
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        Validators.compose([
          Validators.required,
          this.custumValidator.patternValidator(),
        ]),
      ],
      confirm_password: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    },
    {
      validator: this.custumValidator.MatchPassword(
        'password',
        'confirm_password'
      ),
    }
  );

  private image!: string;
  private currentFile!: File;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private custumValidator: CustomValidationService,
    private signUp: SignUpService,
    private notifs: NotificationService,
    private common: CommonService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  async onSubmit() {
    this.common.showSpinner('root');
    this.submitted = true;
    this.image = '';
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      this.common.hideSpinner();
      return;
    }
    try {
      const value = this.registrationForm.value as Users;
      const result = await this.signUp.sign_up(value);
      if (result && result.message) {
        // const { email } = result.user;
        this.notifs.sucess(result.message);
        // this.auth.login({email})
        this.router.navigateByUrl('sign-in');
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log('error', error);
      }
    }
    this.common.hideSpinner();
  }
}
