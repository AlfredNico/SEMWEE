import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    LandingPageModule,
    SharedModule,
    NgbProgressbarModule, //ProgressBar module
    RouterModule.forChild([
      { path: '', component: ForgetPasswordComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ForgetPasswordModule { }
