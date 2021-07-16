import { ProjectsModule } from './../../projects/projects.module';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { AllLPViewerProjectsComponent } from './all-lp-viewer-projects.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { LPViewerProjectsService } from '@app/user-spaces/dashbord/services/lp-viewer.service';
import { LPViewerProjectsComponent } from '@app/shared/components/lp-viewer-projects/lp-viewer-projects.component';
import { AvatarModule } from '@app/shared/modules/avatar.module';
import { FormatFileSizePipe } from '@app/user-spaces/dashbord/pipe/format-filesize.pipe';

@NgModule({
  declarations: [
    AllLPViewerProjectsComponent,
    LPViewerProjectsComponent,
    FormatFileSizePipe,
  ],
  imports: [
    CommonModule,
    LandingModule,
    SharedModule,
    LandingPageModule,
    ProjectsModule,
    AvatarModule,
    RouterModule.forChild([
      { path: '', component: AllLPViewerProjectsComponent },
    ]),
  ],
  exports: [RouterModule],
  providers: [LPViewerProjectsService],
  entryComponents: [LPViewerProjectsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AllLPViewerProjectsModule {}
