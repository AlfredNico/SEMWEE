import { UndoRedoComponent } from './undo-redo.component';
import { EditorDialogComponent } from './editor-dialog.component';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FluidHeightDirective } from '../../directives/fluid-height.directive';
import { LpEditorComponent } from './lp-editor.component';
import { ReadViewFileComponent } from './read-view-file/read-view-file.component';
import { ImportFileComponent } from './import-file/import-file.component';
import { LpEditorService } from '../../services/lp-editor.service';
import { OpenHeaderOptionsComponent } from './read-view-file/open-header-options.component';
import { SharedComponentsModule } from '@app/shared/modules/shared-components.module';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    LpEditorComponent,
    EditorDialogComponent,
    FluidHeightDirective,
    ImportFileComponent,
    ReadViewFileComponent,
    UndoRedoComponent,
    OpenHeaderOptionsComponent,
  ],
  imports: [
    SharedComponentsModule,
    RouterModule.forChild([{ path: '', component: LpEditorComponent }]),
  ],
  exports: [RouterModule],
  entryComponents: [EditorDialogComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    LpEditorService,
    DatePipe
  ]
})
export class LpEditorModule { }
