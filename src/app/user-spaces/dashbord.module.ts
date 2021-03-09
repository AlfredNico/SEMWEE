import { NgModule } from '@angular/core';
import { StepperFileComponent } from './dashbord/components/stepper-file/stepper-file.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { FileUploadComponent } from './dashbord/components/stepper-file/file-upload.component';
import { FilterDataComponent } from './dashbord/components/stepper-file/filter-data.component';
import { SettingTableComponent } from '../shared/components/setting-table/setting-table.component';
import { UploadFileService } from './dashbord/services/upload-file.service';
import { ConvertUploadFileService } from './dashbord/services/convert-upload-file.service';



@NgModule({
  declarations: [
    StepperFileComponent,
    DashbordComponent,
    SideMenuComponent,
    FileUploadComponent,
    FilterDataComponent,
    SettingTableComponent
  ],
  imports: [
    LandingPageModule,
    LandingModule,
    SharedModule,
    MatStepperModule, // stepper module
    RouterModule.forChild([
      {
        path: '', component: DashbordComponent, children: [
          { path: 'file-upload', component: StepperFileComponent },
          { path: '', redirectTo: 'file-upload', pathMatch: 'full' }
        ]
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    UploadFileService,
    ConvertUploadFileService
  ]
})
export class DashbordModule { }
