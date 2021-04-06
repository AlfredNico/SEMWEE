import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { DetailsComponent } from '@app/user-spaces/dashbord/components/projects/dialog/details.component';
import { EditComponent } from '@app/user-spaces/dashbord/components/projects/dialog/edit.component';
import { RemoveComponent } from '@app/user-spaces/dashbord/components/projects/dialog/remove.component';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  template: `
    <div
      class="w-100"
      fxLayout="row"
      fxLayoutAlign="space-between center"
      *ngFor="let project of allProjects$ | async"
    >
      <div class="d-flex align-items-center mb-10">
        <!--begin::Symbol-->
        <div class="symbol symbol-40 symbol-light-primary mr-5">
          <app-avatar [projects]="project"></app-avatar>
        </div>
        <!--end::Symbol-->
        <!--begin::Text-->
        <div class="d-flex flex-column font-weight-bold mx-5">
          <a
            (click)="triggerServices.switchUrl$.next(true)"
            [routerLink]="['/user-space/lp-validator', project._id]"
            class="text-dark text-hover-primary mb-1 font-size-lg"
            >{{ project.name_project }}</a
          >
          <span class="text-muted"
            >created at {{ project.created_project | date: 'medium' }}</span
          >
        </div>
        <!--end::Text-->
      </div>
      <button
        mat-icon-button
        [style.backgroundColor]="'#e1f0ff'"
        [matMenuTriggerFor]="menu"
        class="mr-5"
      >
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu" xPosition="before">
        <button mat-menu-item (click)="onEdit(project)">
          <mat-icon color="primary">edit</mat-icon> Edit
        </button>
        <button mat-menu-item (click)="onDelete(project)">
          <mat-icon color="warn">delete</mat-icon> Remove
        </button>
        <button mat-menu-item (click)="onDeteils(project)">
          <mat-icon>list</mat-icon> view in detail
        </button>
      </mat-menu>
    </div>
  `,
  styles: [],
})
export class ProjectsComponent implements OnInit {
  @Input() public allProjects$: Observable<Projects[]> = new Observable<
    Projects[]
  >(undefined);
  constructor(
    private projectServices: ProjectsService,
    public dialog: MatDialog,
    private common: CommonService,
    private notifs: NotificationService,
    public triggerServices: TriggerService
  ) {}

  ngOnInit(): void {}

  onDeteils(item: Projects) {
    this.dialog
      .open(DetailsComponent, {
        data: item,
        width: '600px',
      })
      .afterClosed()
      .pipe(
        tap(() => {
          this.common.showSpinner('root');
        }),
        map((result) => {}),
        tap(() => {
          this.common.hideSpinner();
        })
      )
      .subscribe();
  }

  onDelete(item: Projects) {
    this.dialog
      .open(RemoveComponent, {
        data: {
          message: 'Are you sure to delete this project ?',
        },
        width: '600px',
      })
      .afterClosed()
      .pipe(
        map((result) => {
          if (result === true) {
            this.projectServices
              .deleteProjects(item._id)
              .subscribe((result) => {
                if (result && result.message) {
                  this.notifs.sucess(result.message);

                  this.projectServices.refresh$.next(true);
                  this.triggerServices.trigrer$.next(true);
                }
              });
          }
        })
      )
      .subscribe();
  }

  onEdit(item: Projects) {
    this.dialog
      .open(EditComponent, {
        data: item,
        width: '65%',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        map((result: boolean) => {
          if (result === true) {
            this.projectServices.refresh$.next(true);
            this.triggerServices.trigrer$.next(true);
          }
        })
      )
      .subscribe();
  }
}
