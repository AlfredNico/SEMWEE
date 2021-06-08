import { UpdatesHeaderComponent } from './viwer-read-import/updates-header.component';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { LpViewerComponent } from './lp-viewer.component';
import { ViwerImportComponent } from './viwer-import/viwer-import.component';
import { ViwerReadImportComponent } from './viwer-read-import/viwer-read-import.component';
import { LpViwersService } from '../../services/lp-viwers.service';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedDirectivesModule } from '@app/shared/modules/shared-directives.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { HeaderOptionsComponent } from './viwer-read-import/header-options.component';
import { LandingModule } from '@app/shared/modules/landing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { tokenInterceptor } from '@app/token.interceptor';
import { errorInterceptor } from '@app/error.interceptor';
import { SharedComponentsModule } from '@app/shared/modules/shared-components.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { EditComponent } from './editLpViewer/edit.component';
import { UndoRedoComponent } from './UndoRedo/undo-redo.component';
// import { FacetFilterComponent } from '@app/shared/components/LPVi-LPEd/components/facet-filter.component';

@NgModule({
  declarations: [
    LpViewerComponent,
    ViwerImportComponent,
    ViwerReadImportComponent,
    // FacetFilterComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent,
    EditComponent,
    UndoRedoComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    LandingPageModule,
    LandingModule,
    NgxSliderModule,
    SharedDirectivesModule,
    MatStepperModule, // stepper module
    SharedComponentsModule,
    PerfectScrollbarModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }]),
  ],
  exports: [RouterModule],
  entryComponents: [
    ViwerImportComponent,
    ViwerReadImportComponent,
    // FacetFilterComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    // NO_ERRORS_SCHEMA
  ],
  providers: [LpViwersService, tokenInterceptor, errorInterceptor],
})
export class LpViewerModule { }
