import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

@Component({
  selector: 'app-edit',
  template: `
    <div fxLayout="column" *ngIf="data">
      <h1 mat-dialog-title>Edit project</h1>
      <div mat-dialog-content>
        <app-add-or-edit
          [dataSources]="data"
          [userId]="userId"
          [isAddItem]="false"
          (formProject)="onSubmit($event)"
        ></app-add-or-edit>
      </div>
    </div>
  `,
  styles: [
    `
      .mat-form-field-appearance-outline .mat-form-field-infix {
        padding: 0.5em 0 0.7em 0 !important;
      }
      .mat-form-field-infix {
        // padding: 0.5em 0;
        border-top: 0.55em solid transparent !important;
      }
      .upload-button {
        max-height: 2.5em !important;
        margin-left: 0 !important;
        min-width: auto !important;
      }
      .letter {
        width: 70px;
        height: 70px;
        margin: auto 5px;
        font-size: 5vh;
        justify-content: center;
        padding: 26px 22px;
        font-weight: bold;
        border-radius: 50%;
      }
    `,
  ],
})
export class EditComponent implements OnInit {
  image_project!: File;
  private imageLandscape: File;
  private imageSquared: File;

  userId: any;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Projects,
    public dialogRef: MatDialogRef<EditComponent>,
    private projetctService: ProjectsService,
    private notifs: NotificationService,
    private common: CommonService
  ) {
    if (this.data) {
      this.userId = this.data.user_id;
    }
  }

  ngOnInit(): void {}

  onClick(): void {
    this.dialogRef.close(this.form.value);
  }

  async onSubmit(value: {
    form: FormGroup;
    imageLandscape: File;
    imageSquared: File;
  }) {
    this.form = value.form;
    this.imageLandscape = value.imageLandscape;
    this.imageSquared = value.imageSquared;

    this.common.showSpinner('root');
    if (
      this.imageLandscape instanceof File ||
      this.imageSquared instanceof File
    ) {
      try {
        const img1 = this.imageLandscape
          ? await this.projetctService.uploadImages(this.imageLandscape)
          : undefined;
        const img2 = this.imageSquared
          ? await this.projetctService.uploadImages(this.imageSquared)
          : undefined;

        const values = {
          _id: this.data._id,
          ...this.form.value,
          image_project_Landscape: img1 ? img1.img : '',
          image_project_Squared: img2 ? img2.img : '',
        };

        this.projetctService.editProjects(values).subscribe(
          (result) => {
            this.notifs.sucess(result.message);
            this.dialogRef.close(true);
            this.common.hideSpinner();
          },
          (error) => {
            this.common.hideSpinner();
          }
        );
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          console.log(error.message);
          this.notifs.warn(error.message);
        }
        this.common.hideSpinner();
        throw error;
      }
    } else {
      const value = {
        _id: this.data._id,
        ...this.form.value,
        image_project: this.data.image_project,
      };

      this.projetctService.editProjects(value).subscribe((result) => {
        this.notifs.sucess(result.message);
        this.dialogRef.close(true);
        this.common.hideSpinner();
      });
    }
  }
}
