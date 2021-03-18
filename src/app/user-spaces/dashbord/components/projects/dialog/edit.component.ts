import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';

@Component({
  selector: 'app-edit',
  template: `
    <div fxLayout="column">
        <h3 mat-dialog-title>Edit project</h3>
        <div mat-dialog-content>

        </div>
        <div mat-dialog-actions align='end'>
            <button mat-raised-button tabindex="-1"  [mat-dialog-close]="false">Close</button>
             <button mat-raised-button tabindex="-1" color="primary">Edit</button>
        </div>
    </div>
  `,
  styleUrls: []
})
export class EditComponent implements OnInit {

  public project!: Projects;
  constructor(@Inject(MAT_DIALOG_DATA) private data: Projects, public dialogRef: MatDialogRef<EditComponent>) {
    this.project = this.data;
   }

  ngOnInit(): void {
  }

  onClick(): void {
    this.dialogRef.close(this.project);
  }

}
