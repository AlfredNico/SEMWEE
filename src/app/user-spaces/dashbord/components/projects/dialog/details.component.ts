import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { map } from 'rxjs/operators';
import { EditComponent } from './edit.component';

@Component({
  selector: 'app-details',
  template: `
    <div fxLayout="column" *ngIf="data">
        <h3 mat-dialog-title>Details project</h3>
        <div mat-dialog-content>
          <img [src]="data.image_project" alt="image project" heigth="50" width="100">

          <div>
            <p>
              Project name: <span> data.nameProject </span>
            </p>
          </div>
        </div>
        <div mat-dialog-actions align='end'>
            <button mat-raised-button tabindex="-1" mat-dialog-close>Close</button>
             <button mat-raised-button tabindex="-1" color="primary"  mat-dialog-close (click)="onEdit(data)">Edit</button>
        </div>
    </div>
  `,
  styleUrls: []
})
export class DetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Projects, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.data.nameProject
  }

  onEdit(item: Projects) {
    this.dialog.open(EditComponent, {
      data: item,
      width: '600px',
    });
  }

}
