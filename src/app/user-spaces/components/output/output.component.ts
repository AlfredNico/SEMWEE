import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { FileUploadComponent } from './file-upload.component';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;

  //Access content on cheild
  // @ViewChild(FileUploadComponent, { static: false }) fileUpload!: FileUploadComponent;
  constructor() { }

  ngOnInit(): void {
  }

  // Upload file ok
  public UploadFileReady() {
    // this.stepper.selected.editable = false;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

}
