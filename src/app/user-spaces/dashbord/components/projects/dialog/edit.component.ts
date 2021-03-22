import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

@Component({
  selector: 'app-edit',
  template: `
    <div fxLayout="column" *ngIf="data">
        <h3 mat-dialog-title>Edit project</h3>
        <div mat-dialog-content [formGroup]="form">

            <div fxLayout="column" fxLayoutAlign="center center">
                <img mat-card-image style="height: 100px;
                width: 100px;" [src]="data.image_project" alt="project images">
                <input type="file" accept="image/*" #file (change)="onImageChanged($event)" style="display:none;" />
                <button mat-raised-button type="button" (click)="file.click()">Change</button>
            </div>

            <mat-form-field appearance="outline" class="w-100 my-1 mx-1">
                <mat-label>Project name</mat-label>
                <input matInput placeholder="project name ..." formControlName="nameProject">
                <mat-error *ngIf="form.get('nameProject')?.touched && form.get('nameProject')?.errors?.required">Project name is required</mat-error>
                <mat-error *ngIf="form.get('nameProject')?.max">Maximum length name is 40 words</mat-error>
            </mat-form-field>

            <div fxLayout="row" fxLayoutAlign="space-between center">
                <mat-form-field appearance="outline" class="w-100 my-1 mx-1">
                    <mat-label>Number of items</mat-label>
                    <input matInput type="number" placeholder="Number of items ..." formControlName="number_of_item">
                    <mat-error *ngIf="form.get('number_of_item')?.touched && form.get('number_of_item')?.errors?.required">Number of items is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 my-1 mx-1">
                    <mat-label>Number of inferred list pages</mat-label>
                    <input matInput type="number" placeholder="project name ..." formControlName="numberPLI">
                    <mat-error *ngIf="form.get('numberPLI')?.touched && form.get('numberPLI')?.errors?.required">Number of inferred list pages is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 my-1 mx-1">
                    <mat-label>Number of validated list pages</mat-label>
                    <input matInput type="number" placeholder="project name ..." formControlName="numberLPVa">
                    <mat-error *ngIf="form.get('numberLPVa')?.touched && form.get('numberLPVa')?.errors?.required">Number of validated list pages is required</mat-error>
                </mat-form-field>
            </div>

        </div>
        <div mat-dialog-actions align='end'>
              <button mat-raised-button tabindex="-1"  [mat-dialog-close]="false">Close</button>
              <button mat-raised-button tabindex="-1" color="primary" (click)="onSubmit()">Edit</button>
        </div>
    </div>
  `,
  styleUrls: []
})
export class EditComponent implements OnInit {

  public image_url: any = "https://material.angular.io/assets/img/examples/shiba2.jpg";
  image_project!: File;

  // public project!: Projects;

  form = this.fb.group({
    nameProject: ['', [Validators.required, Validators.max(4)]],
    // image_project: new FormControl(null, [Validators.required]),
    number_of_item: ['', Validators.required],
    numberPLI: ['', Validators.required],
    numberLPVa: ['', Validators.required],
    user_id: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Projects, public dialogRef: MatDialogRef<EditComponent>, private projetctService: ProjectsService, private notifs: NotificationService) {
    // this.project = this.data;
    console.log(this.data)
    this.form.patchValue({
      ...this.data
    })
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.dialogRef.close(this.form.value);
  }

  onSubmit() {

    console.log(this.form.value)

    if (this.form.valid) {

      if (this.image_project instanceof File) {
        this.projetctService.uploadFiles(this.image_project).subscribe(
          async (file: any) => {
            if (file && file.message) {
              console.log(this.form.value);
              console.log(this.form.get('image_project').value);

              const value = { '_id': this.data._id, ...this.form.value, 'image_project': file.message };
              this.projetctService.editProjects(
                value
              ).subscribe(result => {
                this.notifs.sucess(result.message);
                this.dialogRef.close(true);
              })
            }
          }
        )
      } else {
        const value = { '_id': this.data._id, ...this.form.value };
        this.projetctService.editProjects(value).subscribe(result => {
          this.notifs.sucess(result.message);
          this.dialogRef.close(true);
        })
      }
    }
  }

  onImageChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0] as any;
      reader.onload = (event: any) => {
        this.image_url = event.target.result;

      }
      reader.readAsDataURL(event.target.files[0]);

      // this.form.patchValue({
      //   image_project: file,
      // });
      this.image_project = file;

    }
  }

}
