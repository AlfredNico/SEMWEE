import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCapchaService } from '@app/services/re-capcha.service';
import { CommonService } from '@app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  // template: ``,
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {
  hide = true;
  @ViewChild('recaptch', { static: true }) public recaptch: ElementRef;
  // element = this.document.getElemenetById('main-wrapper');
  public tentativePwd = 0;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    recaptcha: ['']
  });
  public readonly stayOn = this.fb.control(false);


  constructor(private authService: AuthService, private fb: FormBuilder,
    private cookie: CookieService, private router: Router, private renderer: Renderer2, public recaptcha: ReCapchaService, private common: CommonService) { }

  get getemail() { return this.loginForm.controls.email; }
  get getpassword() { return this.loginForm.controls.password; }


  ngOnInit(): void {
    // this.authService.getAllUsers();
    this.recaptch.nativeElement.style.display = 'none';
    // this.renderer.addClass(this.recaptch.nativeElement, 'hidecaptcha-badge');
  }

  ngAfterViewInit(): void {
  }



  public async onSubmit() {
    this.common.showSpinner('root');

    const { email, password }: { [key: string]: any } = this.loginForm.controls;
    try {
      const user = await this.authService.login({ email: email.value, password: password.value });

      console.log(user);

      if (user && user.token) {
        console.log(user)
        if (this.stayOn.value === true) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.common.hideSpinner();
        this.router.navigateByUrl('/user-space');
      } else if (user === undefined) {
        this.common.hideSpinner();
        
        if (this.tentativePwd >= 2) {
          this.recaptch.nativeElement.style.display = 'block';
          this.loginForm.controls['recaptcha'].setValidators([Validators.required]);
          // this.loginForm.controls['recaptcha'].clearValidators();
          this.loginForm.controls['recaptcha'].updateValueAndValidity();
        }
        this.tentativePwd++;
      }


    } catch (error) {
      this.common.hideSpinner();
      if (error instanceof HttpErrorResponse) {
      }
      console.log('error ', error);
      throw error;
    }
  }

}
