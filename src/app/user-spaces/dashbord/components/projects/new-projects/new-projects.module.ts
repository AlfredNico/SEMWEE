import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { NewProjectsComponent } from './new-projects.component';

import { SharedModule } from '@app/shared/modules/shared.module';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';


@NgModule({
  declarations: [
    NewProjectsComponent
  ],
  imports: [
    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    RouterModule.forChild([
      { path: '', component: NewProjectsComponent }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ProjectsService
  ]

})
export class NewProjectsModule { }
