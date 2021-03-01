import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password.component';



@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    LandingPageModule,
    RouterModule.forChild([
      { path: '', component: ForgetPasswordComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ForgetPasswordModule { }
