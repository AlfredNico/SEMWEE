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
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
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
    public triggerServices: TriggerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onDeteils(item: Projects) {
    this.dialog
      .open(DetailsComponent, {
        data: item,
        width: '60%',
      })
      .afterClosed()
      .pipe(
        map(() => {
          this.common.hideSpinner('root');
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
        width: '75%',
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

  public navigateURL(_id: any){
    this.common.isLoading$.next(true);
    this.router.navigate(['/user-space/lp-validator', _id]);
  }
}
