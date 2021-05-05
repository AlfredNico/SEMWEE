import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LpViewerComponent } from './lp-viewer.component';
import { SharedDirectivesModule } from '@app/shared/modules/shared-directives.module';

@NgModule({
  declarations: [LpViewerComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }]),
  ],
  exports: [RouterModule],
})
export class LpViewerModule {}
