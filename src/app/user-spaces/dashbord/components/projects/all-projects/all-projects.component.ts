import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { map, tap } from 'rxjs/operators';
import { DetailsComponent } from '../dialog/details.component';
import { EditComponent } from '../dialog/edit.component';
import { RemoveComponent } from '../dialog/remove.component';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit, AfterViewInit {


  public projectLists: Projects[] = [];

  constructor(private projectServices: ProjectsService, public dialog: MatDialog, private common: CommonService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    // this.
    this.projectServices.getAllProjects().subscribe(
      lists => {
        this.projectLists = lists;
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
          console.log(result);
        }
      })
    ).subscribe();
  }

  onEdit(item: Projects) {
    this.dialog.open(EditComponent, {
      data: item,
      width: '600px',
    }).afterClosed().pipe(
      map((result: Projects) => {
        console.log(result);
      })
    ).subscribe();
  }

}
