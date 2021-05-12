import { UndoRedoComponent } from './../../user-spaces/dashbord/components/lp-editor/undo-redo.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LandingPageModule } from './landing-page.module';
import { SharedDirectivesModule } from './shared-directives.module';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';
import { FacetFilterComponent } from '@app/user-spaces/dashbord/components/lp-editor/facet-filter.component';




@NgModule({
  declarations: [FacetFilterComponent, UndoRedoComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    SharedModule,
    LandingPageModule,
    SharedDirectivesModule,
    FacetFilterComponent, UndoRedoComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedComponentsModule { }
