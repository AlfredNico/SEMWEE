import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingPageModule } from '../../../shared/modules/landing-page.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { SignInComponent } from './sign-in.component';
import { AuthService } from '../../services/auth.service';



@NgModule({
  declarations: [SignInComponent],
  imports: [
    LandingPageModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SignInComponent }
    ])
  ],
  exports: [RouterModule],
  providers: [
    AuthService
  ]

})
export class AuthModule { }
