import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LpValidatorService } from '../../services/lp-validator.service';

@Component({
  selector: 'app-import-item',
  template: `
    <div class="w-100">
      <form [formGroup]="form">
        <div fxLayout="column" fxLayoutAlign="space-around center">
            <div *ngIf="fileName.length > 0 && isExcelFile === true" fxLayout="column">
              <h1> {{ fileName }} </h1>
               <h1> Is uploaded !</h1> 
            </div>

            <div *ngIf="fileName.length > 0 && isExcelFile === false">
              <h1 [style.color]="'red'"> This is not an Excel file  </h1>
            </div>

            <div fxLayout="row" fxLayoutAlign="end center" class="w-100">
              <button type="button" mat-raised-button color="primary" class="m-3" (click)="fileInput.click()">
                  Upload csv
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
export class ImportItemComponent implements OnInit, OnDestroy {

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

  //subscription
  public subscription$ = new Subscription();

  constructor(private lpValidatorServices: LpValidatorService, private common: CommonService) { }

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
      this.common.showSpinner('root');

      try {
        // const formData = new FormData();
        // formData.append('file', this.form.get('files')?.value);
        const result = await this.lpValidatorServices.getUpload(this.form.get('fileSource')?.value as File);

        if (result && result.data) {
          this.uploadFiles.emit(result);
        } else {
          this.common.hideSpinner();
        }
      } catch (error) {
        console.log('error ', error);

      }
    }

  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}