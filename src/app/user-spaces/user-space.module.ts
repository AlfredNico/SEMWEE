import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { LandingModule } from '@app/shared/modules/landing.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { LandingPageModule } from '../shared/modules/landing-page.module';
import { CheckComponent } from './components/check/check.component';
import { FilesComponent } from './components/files/files.component';
import { InputComponent } from './components/input/input.component';
import { LayoutComponent } from './components/layout/layout.component';
import { OutputComponent } from './components/output/output.component';
import { SettingTableComponent } from './components/setting-table/setting-table.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FileUploadComponent } from './components/output/file-upload.component';
import { FilterDataComponent } from './components/output/filter-data.component';


@NgModule({
  declarations: [FilesComponent, LayoutComponent, InputComponent, CheckComponent, OutputComponent, SideMenuComponent, SettingTableComponent, FileUploadComponent, FilterDataComponent, FilterDataComponent],
  imports: [
    LandingPageModule,
    LandingModule,
    SharedModule,
    MatStepperModule, // stepper module
    RouterModule.forChild([
      {
        path: '', component: LayoutComponent, children: [
          { path: 'file', component: FilesComponent },
          { path: 'input', component: InputComponent },
          { path: 'check', component: CheckComponent },
          { path: 'output', component: OutputComponent },
          { path: '', redirectTo: 'file', pathMatch: 'full' }
        ]
      },
    ]),
  ],
  exports: [RouterModule]
})
export class UserSpaceModule { }
