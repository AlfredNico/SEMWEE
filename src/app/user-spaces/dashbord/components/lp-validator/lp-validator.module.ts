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



@NgModule({
  declarations: [
    LpValidatorComponent,
    TableOptionsComponent,
    SettingTableComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LandingModule,
    MatStepperModule, // stepper module
    LandingPageModule,
    RouterModule.forChild([
      { path: '', component: LpValidatorComponent }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
    LpValidatorService,
  ],
  entryComponents: [
    TableOptionsComponent,
    SettingTableComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent
  ]
})
export class LpValidatorModule { }
