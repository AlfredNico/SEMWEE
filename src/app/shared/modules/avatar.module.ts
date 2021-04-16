import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarComponent } from '../components/projects/avatar.component';
import { LandingPageModule } from './landing-page.module';
import { LandingModule } from './landing.module';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [AvatarComponent],
  imports: [LandingModule, SharedModule, LandingPageModule, CommonModule],
  exports: [
    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    AvatarComponent,
  ],
})
export class AvatarModule {}
