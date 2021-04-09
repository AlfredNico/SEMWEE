import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user/user.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [UserComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    LandingModule,
    RouterModule.forChild([
      { path: '', component: UserComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ProfilesModule { }
