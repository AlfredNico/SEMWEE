import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPwdService } from '@app/authentification/services/forgot-pwd.service';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private forgetPwdService: ForgotPwdService, private nofits: NotificationService) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    try {
      const result = await this.forgetPwdService.forgetPassword(this.form.value);
      if (result && result.message) {
        this.nofits.sucess(result.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

}
