import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { EditComponent } from './edit.component';

@Component({
  selector: 'app-details',
  template: `
    <div fxLayout="column" *ngIf="data">
      <h3 mat-dialog-title>Details project</h3>
      <div mat-dialog-content class="w-100">
        <div class="w-100" style="text-align: center;">
          <img [src]="image_url" alt="image project" heigth="80" width="130" />
        </div>

        <div>
          Project name: <span>{{ data.name_project }} </span>
        </div>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-raised-button tabindex="-1" mat-dialog-close>Close</button>
        <button
          mat-raised-button
          tabindex="-1"
          color="accent"
          mat-dialog-close
          (click)="onEdit(data)"
        >
          Edit
        </button>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class DetailsComponent implements OnInit {
  public image_url: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Projects,
    public dialog: MatDialog
  ) {
    this.image_url = environment.baseUrlImg + this.data.image_project;
  }

  ngOnInit(): void {
    this.data.name_project;
  }

  onEdit(item: Projects) {
    this.dialog.open(EditComponent, {
      data: item,
      width: '600px',
    });
  }
}
