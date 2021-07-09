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
import { HeaderOptionsComponent } from './viwer-read-import/header-options.component';
import { tokenInterceptor } from '@app/token.interceptor';
import { errorInterceptor } from '@app/error.interceptor';
import { SharedComponentsModule } from '@app/shared/modules/shared-components.module';
import { EditComponent } from './editLpViewer/edit.component';
import { UndoRedoComponent } from './UndoRedo/undo-redo.component';
import { DragDroppDirective } from '../../directives/drag-dropp.directive';
import { SearchReplaceComponent } from './search_filter_replace/search-filter-replace.component';
import { ResizableModule } from 'angular-resizable-element';

@NgModule({
  declarations: [
    LpViewerComponent,
    ViwerImportComponent,
    ViwerReadImportComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent,
    EditComponent,
    UndoRedoComponent,
    DragDroppDirective,
    SearchReplaceComponent,
  ],
  imports: [
    SharedComponentsModule,
    PerfectScrollbarModule,
    ResizableModule,
    RouterModule.forChild([{ path: '', component: LpViewerComponent }]),
  ],
  exports: [RouterModule],
  entryComponents: [
    ViwerImportComponent,
    ViwerReadImportComponent,
    HeaderOptionsComponent,
    UpdatesHeaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [LpViwersService, tokenInterceptor, errorInterceptor],
})
export class LpViewerModule {}
