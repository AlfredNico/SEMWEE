import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password.component';
import { SharedModule } from '@app/shared/modules/shared.module';



@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    LandingPageModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ForgetPasswordComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ForgetPasswordModule { }
