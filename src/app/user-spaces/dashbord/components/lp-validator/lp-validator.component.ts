import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ConvertUploadFileService } from '../../services/convert-upload-file.service';

@Component({
  selector: 'app-lp-validator',
  templateUrl: './lp-validator.component.html',
  styleUrls: ['./lp-validator.component.scss']
})
export class LpValidatorComponent implements OnInit {

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
