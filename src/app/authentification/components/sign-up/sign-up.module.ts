import { NgModule } from '@angular/core';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SignUpComponent],
  imports: [
    LandingPageModule,
    SharedModule,
    NgbProgressbarModule, //ProgressBar module
    RouterModule.forChild([
      { path: '', component: SignUpComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SignUpModule { }
