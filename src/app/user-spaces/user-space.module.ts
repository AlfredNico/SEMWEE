import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingPageModule } from '../shared/modules/landing-page.module';
import { SharedModule } from '../shared/modules/shared.module';
import { HomePageComponent } from './components/home-page/home-page.component';



@NgModule({
  declarations: [HomePageComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    RouterModule.forChild([
      { path: '', component: HomePageComponent }
    ]),
  ],
  exports: [RouterModule]
})
export class UserSpaceModule { }
