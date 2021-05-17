import { UpdatesHeaderComponent } from './viwer-read-import/updates-header.component';
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
import { HeaderOptionsComponent } from './viwer-read-import/header-options.component';
import { LandingModule } from '@app/shared/modules/landing.module';
import { MatStepperModule } from '@angular/material/stepper';
@NgModule({
  declarations: [LpViewerComponent, ViwerImportComponent, ViwerReadImportComponent, FacetFilterComponent, HeaderOptionsComponent, UpdatesHeaderComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    LandingModule,
    MatStepperModule, // stepper module
    LandingPageModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }])
  ],
  exports: [RouterModule],
  entryComponents: [
    ViwerImportComponent,
    ViwerReadImportComponent,
    FacetFilterComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent
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
