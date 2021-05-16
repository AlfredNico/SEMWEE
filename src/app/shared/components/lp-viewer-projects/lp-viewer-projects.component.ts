import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { LPViewerProjects } from '@app/user-spaces/dashbord/interfaces/lp-viewer-projects';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lp-viewer-projects',
  templateUrl: './lp-viewer-projects.component.html',
  styleUrls: ['./lp-viewer-projects.component.scss'],
})
export class LPViewerProjectsComponent implements OnInit {
  @Input() public allProjects$: Observable<LPViewerProjects[]> = new Observable<
    LPViewerProjects[]
  >(undefined);
  constructor(
    private LpViwersService: LpViwersService,
    public dialog: MatDialog,
    private common: CommonService,
    private notifs: NotificationService,
    public triggerServices: TriggerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
    // this.dialog
    //   .open(RemoveComponent, {
    //     data: {
    //       message: 'Are you sure to delete this project ?',
    //     },
    //     width: '600px',
    //   })
    //   .afterClosed()
    //   .pipe(
    //     map((result) => {
    //       if (result === true) {
    //         this.projectServices
    //           .deleteProjects(item._id)
    //           .subscribe((result) => {
    //             if (result && result.message) {
    //               this.notifs.sucess(result.message);
    //             }
    //           });
    //       }
    //     })
    //   )
    //   .subscribe();
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

  public navigateURL(_id: any){
    this.common.isLoading$.next(true);
    this.router.navigate(['/user-space/lp-viewer', _id]);
  }
}
