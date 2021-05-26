import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { LPAllProjects } from '@app/user-spaces/dashbord/interfaces/lp-viewer-projects';
import { LpEditorService } from '@app/user-spaces/dashbord/services/lp-editor.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { RemoveComponent } from '../../projects/dialog/remove.component';

@Component({
  selector: 'app-lped-all-projects',
  templateUrl: './lped-all-projects.component.html',
  styleUrls: ['./lped-all-projects.component.scss']
})
export class LPedAllProjectsComponent implements OnInit {
  @Input() public allProjects$: Observable<LPAllProjects[]> = new Observable<
    LPAllProjects[]
  >(undefined);
  private user!: User;

  constructor(
    private lpEditor: LpEditorService,
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
    this.allProjects$ = this.lpEditor.refresh$.pipe(
      tap(() => {
        this.triggerServices.trigrer$.next(true);
      }),
      switchMap((_) => this.lpEditor.getAllProjects(this.user._id))
    );
  }

  ngAfterViewInit() {
    // this.common.showSpinner('root');
    this.allProjects$.subscribe(
      (result: any[]) => {
        if (result && result.length == 0) {
          this.router.navigateByUrl('/user-space/lp-editor');
        }
        this.common.hideSpinner();
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.notifs.warn(error.message);
        }
        this.router.navigateByUrl('/user-space/lp-editor');
        // this.common.hideSpinner();
      }
    );
  }

  onDelete(item: any) {
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

            this.lpEditor
              .deleteOneProjects(item._id)
              .subscribe((result) => {
                if (result && result.message) {
                  this.notifs.sucess(result.message);

                  this.lpEditor.refresh$.next(true);
                  this.triggerServices.trigrer$.next(true);
                }
              });
          }
        })
      )
      .subscribe();
  }

  public navigateURL(_id: any) {
    this.router.navigate(['user-space/lp-editor'], {
      queryParams: { idProject: _id }
    });
  }
}
