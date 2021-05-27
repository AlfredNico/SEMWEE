import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LandingPageModule } from './landing-page.module';
import { SharedDirectivesModule } from './shared-directives.module';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';
import { LandingModule } from './landing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NumericFacetComponent } from '../components/lp-edit-viwer/numeric-facet.component';
import { EditCellComponent } from '../components/lp-edit-viwer/edit-cell.component';


@NgModule({
  declarations: [
    EditCellComponent,
    NumericFacetComponent
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
    EditCellComponent
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
