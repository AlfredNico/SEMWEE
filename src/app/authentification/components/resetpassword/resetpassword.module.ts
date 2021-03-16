import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { ResetpasswordComponent } from './resetpassword.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ResetpasswordComponent],
  imports: [
    LandingPageModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ResetpasswordComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ResetpasswordModule { }
