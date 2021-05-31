import { UpdatesHeaderComponent } from './viwer-read-import/updates-header.component';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
import { tokenInterceptor } from '@app/token.interceptor';
import { errorInterceptor } from '@app/error.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditComponent } from './editLpViewer/edit.component';
import { UndoRedoComponent } from '../lp-viewer/UndoRedo/undo-redo.component';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    LpViewerComponent,
    ViwerImportComponent,
    ViwerReadImportComponent,
    FacetFilterComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent,
    EditComponent,
    UndoRedoComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    LandingModule,
    MatStepperModule, // stepper module
    LandingPageModule,
    MatListModule,
    MatDialogModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }]),
  ],
  exports: [RouterModule],
  entryComponents: [
    ViwerImportComponent,
    ViwerReadImportComponent,
    FacetFilterComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    // NO_ERRORS_SCHEMA
  ],
  providers: [LpViwersService, tokenInterceptor, errorInterceptor],
})
export class LpViewerModule {}
