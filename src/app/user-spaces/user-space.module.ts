import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { LandingModule } from '@app/shared/modules/landing.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { LandingPageModule } from '../shared/modules/landing-page.module';
// import { CheckComponent } from './components/check/check.component';
// import { FilesComponent } from './components/files/files.component';
// import { InputComponent } from './components/input/input.component';
// import { LayoutComponent } from './components/layout/layout.component';
// import { OutputComponent } from './components/output/output.component';
// import { SettingTableComponent } from '../shared/components/setting-table/setting-table.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ProjectsService } from './dashbord/services/projects.service';

@NgModule({
  declarations: [
    // FilesComponent,
    // LayoutComponent,
    // InputComponent,
    // CheckComponent,
    // OutputComponent,
    SideMenuComponent,
    // SettingTableComponent,
  ],
  imports: [
    LandingPageModule,
    LandingModule,
    SharedModule,
    MatStepperModule, // stepper module
    // RouterModule.forChild([
    //   {
    //     path: '',
    //     component: LayoutComponent,
    //     children: [
    //       { path: 'file', component: FilesComponent },
    //       { path: 'input', component: InputComponent },
    //       { path: 'check', component: CheckComponent },
    //       { path: 'output', component: OutputComponent },
    //       { path: '', redirectTo: 'file', pathMatch: 'full' },
    //     ],
    //   },
    // ]),
  ],
  exports: [RouterModule],
  providers: [ProjectsService],
})
export class UserSpaceModule {}
