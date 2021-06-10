import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { LpdLpdService } from '../components/LPVi-LPEd/services/lpd-lpd.service';
import { FacetFilterComponent } from '../components/LPVi-LPEd/components/facet-filter.component';
import { TimeLineComponent } from '../components/LPVi-LPEd/components/time-line.component';
import { DateFilterComponent } from '../components/LPVi-LPEd/components/date-filter.component';


@NgModule({
  declarations: [
    EditCellComponent,
    NumericFacetComponent,
    InputFilterComponent,
    SearchFilterComponent,
    FacetFilterComponent,
    TimeLineComponent,
    DateFilterComponent
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
    FacetFilterComponent,
    TimeLineComponent,
    DateFilterComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    // LpdLpdService
  ]
})
export class SharedComponentsModule { }
