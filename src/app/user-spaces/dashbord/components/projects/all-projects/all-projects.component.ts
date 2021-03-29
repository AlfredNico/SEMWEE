import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { UpdatesUserInfoService } from '@app/user-spaces/dashbord/services/updates-user-info.service';
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
  private trigger: Subject<Projects[]> = new Subject();
  public allProjects$: Observable<Projects[]>;

  refresh$ = new BehaviorSubject<boolean>(true);

  private user!: User;

  constructor(private projectServices: ProjectsService, public dialog: MatDialog, private common: CommonService, private notifs: NotificationService, private updatesUserService: UpdatesUserInfoService, private auth: AuthService) { 
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void {
    // this.getAllProject();
    this.allProjects$ = this.refresh$.pipe(
      switchMap(_ => this.projectServices.getAllProjects(this.user._id))
    )
  }

  ngAfterViewInit() {
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
              console.log(result)
              this.notifs.sucess(result.message);

              // this.getAllProject();
              this.refresh$.next(false);
            }
          })
        }
      })
    ).subscribe();
  }

  onEdit(item: Projects) {
    this.dialog.open(EditComponent, {
      data: item,
      width: '600px',
    }).afterClosed().pipe(
      map((result: boolean) => {
        if (result === true) {
          // this.getAllProject();
          this.refresh$.next(false);
        }
      })
    ).subscribe();
  }

  // private getAllProject(){
  //   this.allProjects$ =this.refresh$.pipe(
  //     switchMap(_ => this.projectServices.getAllProjects())
  //   )
  // }

  ngOnDestroy() {

  }

}