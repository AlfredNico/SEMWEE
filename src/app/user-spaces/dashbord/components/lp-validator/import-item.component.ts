import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { LpValidatorService } from '../../services/lp-validator.service';

@Component({
  selector: 'app-import-item',
  template: `
    <div class="w-100">
      <form [formGroup]="form">
        <div fxLayout="column" fxLayoutAlign="space-around center">
            <!-- <div fxLayout="row" fxLayoutAlign="space-around center">
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
            </div> -->
            <div *ngIf="fileName.length > 0 && isExcelFile === true" fxLayout="column">
              <h1> {{ fileName }} </h1>
               <h1> Is uploaded !</h1> 
            </div>

            <div *ngIf="fileName.length > 0 && isExcelFile === false">
              <h1 [style.color]="'red'"> This is not an Excel file  </h1>
            </div>

            <div fxLayout="row" fxLayoutAlign="end center" class="w-100">
              <button type="button" mat-raised-button color="primary" class="m-3" (click)="fileInput.click()">
                  Upload excel
              </button>
              <input #fileInput type="file" (change)="onFileChange($event)" style="display:none;" formControlName="files"/>

              <button mat-raised-button [disabled]="!isExcelFile" (click)="form.valid && onSubmit()">Next</button>
            </div>
        </div>
      </form>
    </div>
  `,
  styles: [
  ]
})
export class ImportItemComponent implements OnInit {

  public form = new FormGroup({
    fileName: new FormControl('', [Validators.required, Validators.pattern(/(.csv)/)]),
    files: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  // read excel file:
  public isExcelFile: boolean = false;
  fileName = '';

  //shared data
  // @Output() uploadFiles = new EventEmitter<any>();
  @Output() uploadFiles = new EventEmitter<any>();

  constructor(private lpValidatorServices: LpValidatorService) { }

  ngOnInit(): void {
  }

  public onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    this.isExcelFile = !!target.files[0]?.name.match(/(.csv)/);
    // this.isExcelFile = !!target.files[0]?.name.match(/(.xls|.xlsx)/);
    const file = event.target.files[0];
    this.fileName = file?.name;

    if (event.target.files.length > 0) {
      this.fileName = event.target.files[0].name;
      this.form.patchValue({
        fileSource: file,
        fileName: file?.name,
      })
    }
  }

  public async onSubmit() {
    if (this.form.valid) {

      try {
        const formData = new FormData();
        formData.append('file', this.form.get('files')?.value);
        const result = await this.lpValidatorServices.sendFile(this.form.get('fileSource')?.value as File);
        console.log(result);
        
        if (result && result.message && result.nameFile) {
          this.lpValidatorServices.getUpload({file: result.nameFile}).pipe(
                map((result) => {
            // this.viewData = result;
                this.uploadFiles.emit(result);
            })
          ).subscribe();
        }
        //   map((result) => {
        //     // this.viewData = result;
        //     this.uploadFiles.emit(result);

        //   })
        // ).subscribe();
        // console.log('result', result);
        // if (result && result.message && result.nameFile) {
        //   const data = await this.lpValidatorServices.getUpload(result.nameFile);
        //   console.log('data', data);
        // }

      } catch (error) {
        console.log('error ', error);

      }
    }

  }

}
