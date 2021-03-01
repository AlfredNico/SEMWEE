import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingModule } from '@app/shared/modules/landing.module';
import { LandingPageModule } from '../shared/modules/landing-page.module';
import { SharedModule } from '../shared/modules/shared.module';
import { CheckComponent } from './components/check/check.component';
import { FilesComponent } from './components/files/files.component';
import { InputComponent } from './components/input/input.component';
import { LayoutComponent } from './components/layout/layout.component';
import { OutputComponent } from './components/output/output.component';



@NgModule({
  declarations: [FilesComponent, LayoutComponent],
  imports: [
    SharedModule,
    LandingPageModule,
    LandingModule,
    RouterModule.forChild([
      { path: '', component: LayoutComponent, children: [
        { path: 'file', component: FilesComponent },
        { path: 'input', component: InputComponent },
        { path: 'check', component: CheckComponent },
        { path: 'output', component: OutputComponent },
        { path: '', redirectTo: 'file', pathMatch: 'full' }
      ] },
    ]),
  ],
  exports: [RouterModule]
})
export class UserSpaceModule { }
