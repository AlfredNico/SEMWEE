import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ConvertUploadFileService } from '../../services/convert-upload-file.service';

@Component({
  selector: 'app-stepper-file',
  template: `
      <mat-horizontal-stepper labelPosition="bottom" linear #stepper>
          <mat-step label="Import Items" completed="false">
              <ng-template matStepperIcon="home ">
                  <mat-icon>home</mat-icon>
              </ng-template>
              <app-file-upload (uploadFiles)="UploadFileReady()"></app-file-upload>
          </mat-step>
          <mat-step label="Infer List Pages" state="text_snippet" completed="false">
              <app-filter-data></app-filter-data>
              <!-- <app-files></app-files> -->
          </mat-step>
          <mat-step label="Check Relevancy" state="download_done" completed="false">
              <ng-template matStepLabel>Done</ng-template>
              <app-filter-data></app-filter-data>
          </mat-step>
      </mat-horizontal-stepper>
  `,
  styles: [
  ]
})
export class StepperFileComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;

  //Access content on cheild
  // @ViewChild(FileUploadComponent, { static: false }) fileUpload!: FileUploadComponent;
  constructor(private uploadDataServices: ConvertUploadFileService) { }

  ngOnInit(): void {
  }

  // Upload file ok
  public UploadFileReady() {
    // this.stepper.selected.editable = false;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

}
