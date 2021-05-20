import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { RemoveComponent } from '@app/user-spaces/dashbord/components/projects/dialog/remove.component';
import { LPViewerProjects } from '@app/user-spaces/dashbord/interfaces/lp-viewer-projects';
import { LPViewerProjectsService } from '@app/user-spaces/dashbord/services/lp-viewer.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-lp-viewer-projects',
  templateUrl: './lp-viewer-projects.component.html',
  styleUrls: ['./lp-viewer-projects.component.scss'],
})
export class LPViewerProjectsComponent implements OnInit, AfterViewInit {
  @Input() public allProjects$: Observable<LPViewerProjects[]> = new Observable<
    LPViewerProjects[]
  >(undefined);
  constructor(
    private lPViewerProjectsService: LPViewerProjectsService,
    public dialog: MatDialog,
    private notifs: NotificationService,
    public triggerServices: TriggerService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  onDeteils(item: LPViewerProjects) {
    // this.dialog
    //   .open(DetailsComponent, {
    //     data: item,
    //     width: '60%',
    //   })
    //   .afterClosed()
    //   .pipe(
    //     map(() => {
    //       this.common.hideSpinner('root');
    //     })
    //   )
    //   .subscribe();
  }

  onDelete(item: LPViewerProjects) {
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
            this.lPViewerProjectsService
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

  onEdit(item: LPViewerProjects) {
    // this.dialog
    //   .open(EditComponent, {
    //     data: item,
    //     width: '75%',
    //     autoFocus: false,
    //   })
    //   .afterClosed()
    //   .pipe(
    //     map((result: boolean) => {
    //       if (result === true) {
    //         this.projectServices.refresh$.next(true);
    //         this.triggerServices.trigrer$.next(true);
    //       }
    //     })
    //   )
    //   .subscribe();
  }

  public navigateURL(_id: any) {
    // this.common.isLoading$.next(true);
    // this.router.navigate(['/user-space/lp-viewer', _id]);
    this.router.navigate(['user-space/lp-viewer'], {
      queryParams: { idProject: _id }
    });
  }
}
