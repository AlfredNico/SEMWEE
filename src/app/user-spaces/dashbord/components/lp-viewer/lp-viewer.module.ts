import { SharedComponentsModule } from './../../../../shared/modules/shared-components.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LpViewerComponent } from './lp-viewer.component';
import { ViwerImportComponent } from './viwer-import/viwer-import.component';
import { ViwerReadImportComponent } from './viwer-read-import/viwer-read-import.component';
import { LpViwersService } from '../../services/lp-viwers.service';

@NgModule({
  declarations: [LpViewerComponent, ViwerImportComponent, ViwerReadImportComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: LpViewerComponent }]),
    SharedComponentsModule,
  ],
  exports: [RouterModule],
  entryComponents: [
    ViwerImportComponent,
    ViwerReadImportComponent
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
