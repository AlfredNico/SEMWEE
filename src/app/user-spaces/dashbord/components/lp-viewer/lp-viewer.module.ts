import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LpViewerComponent } from './lp-viewer.component';
import { ViwerImportComponent } from './viwer-import/viwer-import.component';
import { ViwerReadImportComponent } from './viwer-read-import/viwer-read-import.component';
import { LpViwersService } from '../../services/lp-viwers.service';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedDirectivesModule } from '@app/shared/modules/shared-directives.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { FacetFilterComponent } from './facet-filter.component';

@NgModule({
  declarations: [LpViewerComponent, ViwerImportComponent, ViwerReadImportComponent, FacetFilterComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }])
  ],
  exports: [RouterModule],
  entryComponents: [
    ViwerImportComponent,
    ViwerReadImportComponent,
    FacetFilterComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    LpViwersService
  ]
})
export class LpViewerModule { }
