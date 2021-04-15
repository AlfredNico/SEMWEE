import { AddOrEditComponent } from './add-or-edit/add-or-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedModule } from '@app/shared/modules/shared.module';

@NgModule({
  declarations: [AddOrEditComponent],
  imports: [CommonModule, LandingModule, SharedModule, LandingPageModule],
  exports: [
    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    AddOrEditComponent,
  ],
})
export class ProjectsModule {}
