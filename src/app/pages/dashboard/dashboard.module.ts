import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
// import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    // DashboardsModule,
  ],
  providers: [
    ProjectsService
  ]
})
export class DashboardModule { }
