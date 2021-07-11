import { ProjectsModule } from './../projects.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewProjectsComponent } from './new-projects.component';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    NewProjectsComponent,
  ],
  imports: [
    ProjectsModule,
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
