import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LpValidatorService } from '../../services/lp-validator.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div>
      <form [formGroup]="form">
        <div fxLayout="column" fxLayoutAlign="space-around center">
            <div fxLayout="row" fxLayoutAlign="space-around center">
              <mat-form-field appearance="outline">
                <mat-label>File name</mat-label>
                <input matInput formControlName="fileName" readonly="true">
                <mat-error *ngIf="form.get('fileName')?.errors?.pattern"> This is not an Excel file </mat-error>
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
export class FileUploadComponent implements OnInit, OnDestroy {

  public form = new FormGroup({
    fileName: new FormControl('', [Validators.required, Validators.pattern(/(.csv)/)]),
    files: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  // read excel file:
  public isExcelFile: boolean = false;
  fileName = '';

  //shared data
  @Output() uploadFiles = new EventEmitter<any>();
  public uploadFileData: any[] = [];
  public subscription = new Subscription();

  constructor(private lpValidatorServices: LpValidatorService) { }

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
        // this.subscription = this.lpValidatorServices.sendFile(this.form.get('fileSource')?.value as File).subscribe(
        //   (value: any) => {
        //     console.log('value', value);
        //     this.uploadFileData = value;
        //     // return value;
        //   }
        // );

        console.log('sub', this.subscription);

        // console.log('result', result);
        // if (result && result.message && result.nameFile) {
        //   const data = await this.lpValidatorServices.getUpload(result.nameFile);
        //   console.log('data', data);
        // }

      } catch (error) {
        console.log('error ', error);

      }
    }else{
      console.log('form not valid');
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
