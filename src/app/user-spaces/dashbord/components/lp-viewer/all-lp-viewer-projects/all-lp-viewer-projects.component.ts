import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table/table-data-source';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
import { LPAllProjects } from '@app/user-spaces/dashbord/interfaces/lp-viewer-projects';
import { LPViewerProjectsService } from '@app/user-spaces/dashbord/services/lp-viewer.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LPedAllProjectsComponent } from '../../lp-editor/lped-all-projects/lped-all-projects.component';

@Component({
  selector: 'app-all-lp-viewer-projects',
  templateUrl: './all-lp-viewer-projects.component.html',
  styleUrls: ['./all-lp-viewer-projects.component.scss'],
})
export class AllLPViewerProjectsComponent implements OnInit, AfterViewInit {
  public allProjects$: Observable<LPAllProjects[]>;
  private user!: User;
  pageOfItems: Array<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private LPViewerProjectsService: LPViewerProjectsService,
    public dialog: MatDialog,
    private notifs: NotificationService,
    private auth: AuthService,
    private router: Router,
    private readonly lpviLped: LpdLpdService
  ) {
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void {
    this.allProjects$ = this.LPViewerProjectsService.refresh$.pipe(
      switchMap((_) =>
        this.LPViewerProjectsService.getAllProjects(this.user._id)
      )
    );
  }

  ngAfterViewInit() {
    this.allProjects$.subscribe(
      (result: any[]) => {
        if (result && result.length == 0) {
          this.router.navigateByUrl('/user-space/lp-viewer');
        }
        this.lpviLped.isLoading$.next(false); // disable loading spinner
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.notifs.warn(error.message);
        }
        this.router.navigateByUrl('/user-space/lp-viewer');
        this.lpviLped.isLoading$.next(false); // disable loading spinner
      }
    );
  }
}
