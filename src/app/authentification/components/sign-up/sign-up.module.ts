import { NgModule } from '@angular/core';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { SharedModule } from '@app/shared/modules/shared.module';



@NgModule({
  declarations: [SignUpComponent],
  imports: [
    LandingPageModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SignUpComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SignUpModule { }
