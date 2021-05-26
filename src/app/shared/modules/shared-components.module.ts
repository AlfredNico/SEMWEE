import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LandingPageModule } from './landing-page.module';
import { SharedDirectivesModule } from './shared-directives.module';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';
import { EditCellComponent } from '../components/edit-cell/edit-cell.component';
import { LandingModule } from './landing.module';
import { NumericFacetComponent } from '../components/numeric-facet/numeric-facet.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


@NgModule({
  declarations: [
    EditCellComponent,
    // NumericFacetComponent
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
    NgxSliderModule
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
