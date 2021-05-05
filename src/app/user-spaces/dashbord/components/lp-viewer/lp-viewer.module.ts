import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LpViewerComponent } from './lp-viewer.component';
import { StylePaginatorDirective } from '../../directives/style-paginator.directive';
import { SharedDirectivesModule } from '@app/shared/modules/shared-directives.module';

@NgModule({
  declarations: [LpViewerComponent, StylePaginatorDirective],
  imports: [
    CommonModule,
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }]),
  ],
  exports: [RouterModule],
})
export class LpViewerModule {}
