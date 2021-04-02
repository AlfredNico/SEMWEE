import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { NewProjectsComponent } from './new-projects.component';

import { SharedModule } from '@app/shared/modules/shared.module';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    NewProjectsComponent
  ],
  imports: [
    MatRadioModule, //import radio button

    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    MatAutocompleteModule,
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
