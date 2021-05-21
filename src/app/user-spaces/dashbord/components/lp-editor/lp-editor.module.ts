import { UndoRedoComponent } from './undo-redo.component';
import { FacetFilterComponent } from './facet-filter.component';
import { EditorDialogComponent } from './editor-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FluidHeightDirective } from '../../directives/fluid-height.directive';
import { LpEditorComponent } from './lp-editor.component';
import { ReadViewFileComponent } from './read-view-file/read-view-file.component';
import { ImportFileComponent } from './import-file/import-file.component';
import { PreviewFileComponent } from './preview-file/preview-file.component';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { LpEditorService } from '../../services/lp-editor.service';
import { SharedDirectivesModule } from '@app/shared/modules/shared-directives.module';
import { OpenHeaderOptionsComponent } from './read-view-file/open-header-options.component';

@NgModule({
  declarations: [LpEditorComponent, EditorDialogComponent, FluidHeightDirective, ImportFileComponent, PreviewFileComponent, ReadViewFileComponent, FacetFilterComponent, UndoRedoComponent, OpenHeaderOptionsComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    RouterModule.forChild([{ path: '', component: PreviewFileComponent }]),
  ],
  exports: [RouterModule],
  entryComponents: [EditorDialogComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    LpEditorService
  ]
})
export class LpEditorModule { }
