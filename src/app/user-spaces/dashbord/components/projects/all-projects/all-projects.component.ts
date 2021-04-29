import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
})
export class AllProjectsComponent implements OnInit, AfterViewInit {
  public allProjects$: Observable<Projects[]>;
  private user!: User;

  constructor(
    private projectServices: ProjectsService,
    public dialog: MatDialog,
    private common: CommonService,
    private notifs: NotificationService,
    private auth: AuthService,
    private triggerServices: TriggerService,
    private router: Router
  ) {
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void {
    this.allProjects$ = this.projectServices.refresh$.pipe(
      tap(() => {
        this.triggerServices.trigrer$.next(true);
      }),
      switchMap((_) => this.projectServices.getAllProjects(this.user._id))
    );
  }

  ngAfterViewInit() {
    // this.common.showSpinner('root');
    this.allProjects$.subscribe(
      (result: any[]) => {
        if (result && result.length == 0) {
          this.router.navigateByUrl('/user-space/new-project');
        }
        this.common.hideSpinner();
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.notifs.warn(error.message);
        }
        this.router.navigateByUrl('/user-space/new-project');
        // this.common.hideSpinner();
      }
    );
  }
}
