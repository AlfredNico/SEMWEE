import { ProjectsModule } from './../projects.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { AllProjectsComponent } from './all-projects.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { RemoveComponent } from '../dialog/remove.component';
import { EditComponent } from '../dialog/edit.component';
import { DetailsComponent } from '../dialog/details.component';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { ProjectsComponent } from '@app/shared/components/projects/projects.component';
import { AvatarModule } from '@app/shared/modules/avatar.module';

@NgModule({
  declarations: [
    AllProjectsComponent,
    RemoveComponent,
    EditComponent,
    DetailsComponent,
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    ProjectsModule,
    AvatarModule,
    RouterModule.forChild([{ path: '', component: AllProjectsComponent }]),
  ],
  exports: [RouterModule],
  providers: [ProjectsService],
  entryComponents: [
    RemoveComponent,
    EditComponent,
    DetailsComponent,
    ProjectsComponent,
  ],
})
export class AllProjectsModule {}
