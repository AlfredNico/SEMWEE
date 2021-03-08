import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { UploadFileService } from '@app/user-spaces/services/upload-file.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div>
      <form [formGroup]="form">
        <div fxLayout="column" fxLayoutAlign="space-around center">
            <div fxLayout="row" fxLayoutAlign="space-around center">
              <mat-form-field appearance="outline">
                <mat-label>File name</mat-label>
                <input matInput formControlName="fileName">
                <!-- <mat-error> This is not an Excel file </mat-error> -->
              </mat-form-field>
              <div *ngIf="fileName.length > 0 && isExcelFile === false" [style.color]="'red'">This is not an Excel file </div>
              <button type="button" mat-raised-button color="primary" class="m-3" (click)="fileInput.click()">
                  Upload excel
              </button>
              <input #fileInput type="file" (change)="onFileChange($event)" style="display:none;" formControlName="files"/>
            </div>

            <button mat-raised-button [disabled]="!isExcelFile" (click)="form.valid && onSubmit()">Next</button>
        </div>
      </form>
    </div>
  `,
  styles: [
  ]
})
export class FileUploadComponent implements OnInit {

  public form = new FormGroup({
    fileName: new FormControl('', [Validators.required]),
    files: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  // read excel file:
  public isExcelFile: boolean = false;
  fileName = '';

  //shared data
  @Output() uploadFiles = new EventEmitter<any>();

  constructor(private uploadFileService: UploadFileService) { }

  ngOnInit(): void {
  }

  public onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    this.isExcelFile = !!target.files[0]?.name.match(/(.csv)/);
    // this.isExcelFile = !!target.files[0]?.name.match(/(.xls|.xlsx)/);
    const file = event.target.files[0];

    if (event.target.files.length > 0) {
      this.fileName = event.target.files[0].name;
      this.form.patchValue({
        fileSource: file,
        fileName: file.name,
      })
    }
    console.log(target.files[0]?.name);
  }

  public async onSubmit() {
    if (this.form.valid) {

      this.uploadFiles.emit(this.form.value);

      try {
        const formData = new FormData();
        formData.append('file', this.form.get('files')?.value);
        const result = await this.uploadFileService.sendFile(this.form.get('fileSource')?.value as File);        
        if (result.message) {
          const data = this.uploadFileService.getUpload();
          console.log('result', result);
          console.log('data', data);
        }

      } catch (error) {
        console.log('error ', error);

      }
    }

  }

}
