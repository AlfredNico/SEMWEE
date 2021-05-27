import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LandingPageModule } from './landing-page.module';
import { SharedDirectivesModule } from './shared-directives.module';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';
import { LandingModule } from './landing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { EditCellComponent } from '../components/lp-editor-viewer/edit-cell.component';
import { NumericFacetComponent } from '../components/lp-editor-viewer/numeric-facet.component';
import { InputFilterComponent } from '../components/lp-editor-viewer/input-filter.component';
import { SearchFilterComponent } from '../components/lp-editor-viewer/search-filter.component';
import { FacetFilterComponent } from '../components/lp-editor-viewer/facet-filter.component';


@NgModule({
  declarations: [
    EditCellComponent,
    NumericFacetComponent,
    InputFilterComponent,
    SearchFilterComponent,
    FacetFilterComponent
  ],
  imports: [
    SharedModule,
    LandingPageModule,
    LandingModule,
    SharedDirectivesModule,
    CommonModule,
    NgxSliderModule
  ],
  exports: [
    CommonModule,
    SharedModule,
    LandingModule,
    LandingPageModule,
    SharedDirectivesModule,
    NgxSliderModule,

    /* Shared components */
    NumericFacetComponent,
    EditCellComponent,
    InputFilterComponent,
    SearchFilterComponent,
    FacetFilterComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    NumericFacetComponent
  ]
})
export class SharedComponentsModule { }
