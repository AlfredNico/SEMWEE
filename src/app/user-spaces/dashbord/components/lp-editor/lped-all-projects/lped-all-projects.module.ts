import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LPedAllProjectsComponent } from './lped-all-projects.component';
import { ProjectsModule } from './../../projects/projects.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/modules/shared.module';
import { AvatarModule } from '@app/shared/modules/avatar.module';
import { LpEditorService } from '@app/user-spaces/dashbord/services/lp-editor.service';



@NgModule({
  declarations: [
    LPedAllProjectsComponent
  ],
  imports: [
    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    ProjectsModule,
    AvatarModule,
    RouterModule.forChild([{ path: '', component: LPedAllProjectsComponent }]),
  ],
  exports: [RouterModule],
  providers: [LpEditorService],
  entryComponents: [
    LPedAllProjectsComponent,
  ],
})
export class LPedAllProjectsModule { }
