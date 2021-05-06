import { SharedDirectivesModule } from './../../../../shared/modules/shared-directives.module';
import { IdbService } from './../../../../services/idb.service';
import { PropertyValueService } from './../../services/property-value.service';
import { ItemTypeService } from './../../services/item-type.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { RouterModule } from '@angular/router';
import { LpValidatorComponent } from './lp-validator.component';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';
import { SettingTableComponent } from '@app/shared/components/setting-table/setting-table.component';
import { ImportItemComponent } from './import-item.component';
import { CheckRelevancyComponent } from './check-relevancy.component';
import { InferListComponent } from './infer-list.component';
import { LpValidatorService } from '../../services/lp-validator.service';
import { MatStepperModule } from '@angular/material/stepper';
import { GoogleMachingComponent } from './google-maching/google-maching.component';
import { ResizableModule } from 'angular-resizable-element';
import { TuneItComponent } from './dialog/tune-it.component';

import { DragDropDirective } from '../../directives/drag-drop.directive';
import { ResizableDirective } from '../../directives/resizable.directive';
import { TuniItDirective } from './../../directives/tuni-it.directive';

import { StepperIconDirective } from '../../directives/stepper-icon.directive';
import { HttpCancelService } from '@app/shared/services/http-cancel.service';

@NgModule({
  declarations: [
    /* COMPONENT DECLARATORS */
    LpValidatorComponent,
    TableOptionsComponent,
    SettingTableComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent,
    GoogleMachingComponent,
    TuneItComponent,

    /* DIRECTIRES DECLARATORS */
    DragDropDirective,
    ResizableDirective,
    TuniItDirective,
    StepperIconDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LandingModule,
    MatStepperModule, // stepper module
    LandingPageModule,
    ResizableModule,
    RouterModule.forChild([{ path: '', component: LpValidatorComponent }]),
    SharedDirectivesModule,
  ],
  exports: [RouterModule],
  providers: [
    LpValidatorService,
    ItemTypeService,
    PropertyValueService,
    IdbService,
    HttpCancelService,
  ],
  entryComponents: [
    TableOptionsComponent,
    SettingTableComponent,
    // ImportItemComponent,
    // CheckRelevancyComponent,
    // InferListComponent,
    GoogleMachingComponent,
    TuneItComponent,
  ],
})
export class LpValidatorModule {}
