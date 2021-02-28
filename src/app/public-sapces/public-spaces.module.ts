import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { LandingPageModule } from '../shared/modules/landing-page.module';
import { SharedModule } from '../shared/modules/shared.module';


@NgModule({
  declarations: [
    PublicLayoutComponent
  ],
  imports: [
    SharedModule,
    LandingPageModule,
    RouterModule.forChild([
      { path: '', component: PublicLayoutComponent }
    ])
  ]
})
export class PublicSpacesModule { }
