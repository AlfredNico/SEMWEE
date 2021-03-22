import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DetailsComponent } from '../dialog/details.component';
import { EditComponent } from '../dialog/edit.component';
import { RemoveComponent } from '../dialog/remove.component';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit, AfterViewInit, OnDestroy {


  public projects: BehaviorSubject<Projects[]> = new BehaviorSubject<Projects[]>([]);

  constructor(private projectServices: ProjectsService, public dialog: MatDialog, private common: CommonService, private notifs: NotificationService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    // this.
    this.projectServices.getAllProjects().subscribe(
      lists => {
        this.projects.next(lists);
      }
    )
    
  }

  onDeteils(item: Projects){
    this.dialog.open(DetailsComponent, {
      data: item,
      width: '600px',
    }).afterClosed().pipe(
      tap(() => {
        this.common.showSpinner('root');
      }),
      map(result => {
        console.log(result);

        if (result === true) {
          this.projectServices.getAllProjects().subscribe(
            lists => {
              console.log(lists);
              this.projects.next(lists);
            }
          )
          // console.log(result);
        }
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

              this.projectServices.getAllProjects().subscribe(
                lists => {
                  this.projects.next(lists);
                }
              )
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
          this.projectServices.getAllProjects().subscribe(
            lists => {
              console.log(result);
              this.projects.next(lists);
            }
          )
        }
      })
    ).subscribe();
  }

  ngOnDestroy(){
    this.projects.next(undefined);
  }

}
