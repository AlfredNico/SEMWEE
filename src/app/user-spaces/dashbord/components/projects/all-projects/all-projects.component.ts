import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { AsideComponent } from '@app/pages/_layout/components/aside/aside.component';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { UpdatesUserInfoService } from '@app/user-spaces/dashbord/services/updates-user-info.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, tap, takeUntil, retry, switchMap } from 'rxjs/operators';
import { DetailsComponent } from '../dialog/details.component';
import { EditComponent } from '../dialog/edit.component';
import { RemoveComponent } from '../dialog/remove.component';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit, AfterViewInit, OnDestroy {


  // public projects: Subject<Projects[]> = new Subject<Projects[]>();
  public projects: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(undefined);
  public allProjects$: Observable<Projects[]>;

  // refresh$ = new BehaviorSubject<boolean>(true);

  private user!: User;

  constructor(private projectServices: ProjectsService, public dialog: MatDialog, private common: CommonService, private notifs: NotificationService, private auth: AuthService, private triggerServices: TriggerService, private router: Router) {
    this.user = this.auth.currentUserSubject.value;

  }

  ngOnInit(): void {
    // this.getAllProject();
    this.allProjects$ = this.projectServices.refresh$.pipe(
      tap(() => {
        this.triggerServices.trigrer$.next(true);
      }),
      switchMap(_ => this.projectServices.getAllProjects(this.user._id))
    )
  }

  ngAfterViewInit() {
    this.allProjects$.subscribe(
      (result: any[]) => {
        if (result && result.length == 0) {
          this.router.navigateByUrl('/user-space/new-project');
        }
      }
    )
  }

  onDeteils(item: Projects) {
    this.dialog.open(DetailsComponent, {
      data: item,
      width: '600px',
    }).afterClosed().pipe(
      tap(() => {
        this.common.showSpinner('root');
      }),
      map(result => {
      }),
      tap(() => {
        this.common.hideSpinner();
      }),
    ).subscribe();
  }

  onDelete(item: Projects) {
    this.dialog.open(RemoveComponent, {
      data: {
        message: 'Are you sure to delete this project ?',
      },
      width: '600px',
    }).afterClosed().pipe(
      map(result => {
        if (result === true) {
          this.projectServices.deleteProjects(item._id).subscribe(result => {
            if (result && result.message) {
              this.notifs.sucess(result.message);

              // this.getAllProject();
              this.projectServices.refresh$.next(true);
              this.triggerServices.trigrer$.next(true);
            }
          })
        }
      })
    ).subscribe();
  }

  onEdit(item: Projects) {
    this.dialog.open(EditComponent, {
      data: item,
      width: '65%',
    }).afterClosed().pipe(
      map((result: boolean) => {
        if (result === true) {
          // this.getAllProject();
          this.projectServices.refresh$.next(true);
          this.triggerServices.trigrer$.next(true);
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {

  }

}
