import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { LandingPageModule } from './landing-page.module';
import { SharedDirectivesModule } from './shared-directives.module';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';
import { LandingModule } from './landing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { EditCellComponent } from '../components/LPVi-LPEd/components/edit-cell.component';
import { InputFilterComponent } from '../components/LPVi-LPEd/components/input-filter.component';
import { NumericFacetComponent } from '../components/LPVi-LPEd/components/numeric-facet.component';
import { SearchFilterComponent } from '../components/LPVi-LPEd/components/search-filter.component';
import { FacetFilterComponent } from '../components/LPVi-LPEd/components/facet-filter.component';
import { TimeLineComponent } from '../components/LPVi-LPEd/components/time-line.component';

import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { PulsingSkeletonComponent } from '../components/LPVi-LPEd/components/pulsing-skeleton.component';
import { ResizableModule } from 'angular-resizable-element';

@NgModule({
  declarations: [
    EditCellComponent,
    NumericFacetComponent,
    InputFilterComponent,
    SearchFilterComponent,
    FacetFilterComponent,
    TimeLineComponent,
    PulsingSkeletonComponent,
  ],
  imports: [
    MatStepperModule, // stepper module
    HttpClientModule,
    SharedModule,
    LandingPageModule,
    LandingModule,
    SharedDirectivesModule,
    CommonModule,
    NgxSliderModule,
    ResizableModule,
  ],
  exports: [
    MatStepperModule, // stepper module
    HttpClientModule,
    CommonModule,
    SharedModule,
    LandingModule,
    LandingPageModule,
    SharedDirectivesModule,
    NgxSliderModule,
    ResizableModule,

    /* Shared components */
    NumericFacetComponent,
    EditCellComponent,
    InputFilterComponent,
    SearchFilterComponent,
    FacetFilterComponent,
    TimeLineComponent,
    PulsingSkeletonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedComponentsModule { }
