import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { RemoveComponent } from '@app/user-spaces/dashbord/components/projects/dialog/remove.component';
import { LPAllProjects } from '@app/user-spaces/dashbord/interfaces/lp-viewer-projects';
import { LPViewerProjectsService } from '@app/user-spaces/dashbord/services/lp-viewer.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LpdLpdService } from '../LPVi-LPEd/services/lpd-lpd.service';

@Component({
  selector: 'app-lp-viewer-projects',
  templateUrl: './lp-viewer-projects.component.html',
  styleUrls: ['./lp-viewer-projects.component.scss'],
})
export class LPViewerProjectsComponent implements OnInit, AfterViewInit {
  @Input() public allProjects$: Observable<LPAllProjects[]> = new Observable<
    LPAllProjects[]
  >(undefined);
  constructor(
    private lPViewerProjectsService: LPViewerProjectsService,
    public dialog: MatDialog,
    private notifs: NotificationService,
    public triggerServices: TriggerService,
    private router: Router,
    private readonly lpviLped: LpdLpdService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onDeteils(item: LPAllProjects) {}

  onDelete(item: LPAllProjects) {
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

                  this.lPViewerProjectsService.refresh$.next(true);
                  this.triggerServices.trigrer$.next(true);
                }
              });
          }
        })
      )
      .subscribe();
  }

  public navigateURL(_id: any) {
    this.lpviLped.isLoading$.next(true); // enable loading spinner
    this.router.navigate(['user-space/lp-viewer'], {
      queryParams: { idProject: _id },
    });
  }
}
