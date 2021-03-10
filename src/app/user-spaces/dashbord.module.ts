import { NgModule } from '@angular/core';
import { DashbordComponent } from './dashbord/dashbord.component';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { SettingTableComponent } from '../shared/components/setting-table/setting-table.component';
import { ConvertUploadFileService } from './dashbord/services/convert-upload-file.service';
import { LpValidatorComponent } from './dashbord/components/lp-validator/lp-validator.component';
import { ImportItemComponent } from './dashbord/components/lp-validator/import-item.component';
import { CheckRelevancyComponent } from './dashbord/components/lp-validator/check-relevancy.component';
import { InferListComponent } from './dashbord/components/lp-validator/infer-list.component';
import { LpValidatorService } from './dashbord/services/lp-validator.service';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';



@NgModule({
  declarations: [
    DashbordComponent,
    SideMenuComponent,
    LpValidatorComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent,
    SettingTableComponent,
    TableOptionsComponent
  ],
  imports: [
    LandingPageModule,
    LandingModule,
    SharedModule,
    MatStepperModule, // stepper module
    RouterModule.forChild([
      {
        path: '', component: DashbordComponent, children: [
          { path: 'lp-validator', component: LpValidatorComponent },
          { path: '', redirectTo: 'lp-validator', pathMatch: 'full' }
        ]
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    LpValidatorService,
    ConvertUploadFileService
  ],
  entryComponents: [
    TableOptionsComponent,
    SettingTableComponent,
    ImportItemComponent,
    CheckRelevancyComponent,
    InferListComponent
  ]

})
export class DashbordModule { }
