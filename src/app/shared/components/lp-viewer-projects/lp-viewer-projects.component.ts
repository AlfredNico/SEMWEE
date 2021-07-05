import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { RemoveComponent } from '@app/user-spaces/dashbord/components/projects/dialog/remove.component';
import { LPAllProjects } from '@app/user-spaces/dashbord/interfaces/lp-viewer-projects';
import { Paginator } from '@app/user-spaces/dashbord/interfaces/paginator';
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
export class LPViewerProjectsComponent implements OnChanges {
  @Input() public allProjects$: Observable<LPAllProjects[]> = new Observable<
    LPAllProjects[]
  >(undefined);

  public allProjects: any[] = [];
  public dataSources: any[] = [];
  public paginator: Paginator;

  constructor(
    private lPViewerProjectsService: LPViewerProjectsService,
    public dialog: MatDialog,
    private notifs: NotificationService,
    public triggerServices: TriggerService,
    private router: Router,
    private readonly lpviLped: LpdLpdService
  ) {}

  ngOnChanges(): void {
    this.allProjects$.subscribe((resulat) => {
      this.dataSources = resulat;
      this.allProjects = resulat;
    });

    this.paginator = {
      pageIndex: 0,
      pageSize: 10,
      nextPage: 0,
      previousPageIndex: 1,
      pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    };
  }

  getServerData(event: any) {
    let page = event.pageIndex * event.pageSize;
    const lenghtPage = event.pageSize * (event.pageIndex + 1);
    this.paginator.nextPage = this.paginator.nextPage + event.pageSize;

    this.allProjects = this.dataSources.slice(page, lenghtPage);
    if (this.paginator.pageSize != event.pageSize)
      this.lpviLped.dataPaginator$.next(true);

    this.paginator = {
      ...this.paginator,
      ...event,
    };
  }

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
