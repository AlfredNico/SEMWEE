import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { LandingPageModule } from '../shared/modules/landing-page.module';
import { SharedModule } from '../shared/modules/shared.module';
// import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { LandingModule } from '@app/shared/modules/landing.module';
import { InlineSVGModule } from 'ng-inline-svg';


@NgModule({
  declarations: [
    PublicLayoutComponent,
  ],
  imports: [
    SharedModule,
    LandingPageModule,
    LandingModule,
    InlineSVGModule,
    RouterModule.forChild([
      { path: '', component: PublicLayoutComponent }
    ])
  ]
})
export class PublicSpacesModule { }
