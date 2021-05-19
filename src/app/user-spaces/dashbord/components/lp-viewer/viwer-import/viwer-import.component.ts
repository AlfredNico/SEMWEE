import { CommonService } from './../../../../../shared/services/common.service';
import { LpViwersService } from './../../../services/lp-viwers.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Upload } from '@app/user-spaces/dashbord/interfaces/upload';
import { User } from '@app/classes/users';

@Component({
  selector: 'app-viwer-import',
  template: `
    <div [formGroup]="form" class="p-5" fxLayout="column" fxLayoutAlign="space-around start">

      <div fxLayout="row" fxLayoutAlign="space-around center" fxLayoutGap="20px">
        <mat-label for="file" class="py-2">
          Locate one or more files on your computer to upload:
        </mat-label>
        <button mat-raised-button (click)="fileInput.click()">
          {{ file ? file.name : 'Select' }}
        </button>
        <input hidden type="file" id="file" name="file" class="py-2" formControlName="fileSource" #fileInput (change)="onFileInput(fileInput.files)" />
      </div>
      <button type="submit" mat-raised-button (click)="form.valid && onSubmit()">
        Next
        <mat-icon aria-label="close icon">double_arrow</mat-icon>
      </button>
    </div>
  `,
})
export class ViwerImportComponent implements OnInit, OnDestroy {

  public form = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  file: File | null | undefined;

  @Output() importFile = new EventEmitter<any>();
  @Input() user: User = undefined;

  private subscription$: Subscription | undefined;

  //////////////
  csvContent: string;
  parsedCsv: string[][];

  private dataFileImport: { header: string[], content: any[] } = undefined;

  constructor(private lpViewerService: LpViwersService, private readonly common: CommonService) { }

  ngOnInit(): void {
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);

      // Read CSV file
      const fileToRead = this.file;
      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;
      fileReader.readAsText(fileToRead, 'UTF-8');
    }

  }

  public onSubmit() {
    // this.common.showSpinner('table', true, '');
    // this.lpViewerService.isLoading$.next(true);
    if (this.file) {
      this.lpViewerService.upload(this.file, this.user._id);
      this.importFile.emit(this.dataFileImport);

      // .subscribe(
      //   res => {
      //     if (res) {
      //       this.importFile.emit(res);
      //       this.lpViewerService.isLoading$.next(false);
      //     }
      //     this.lpViewerService.isLoading$.next(false);
      //   }),
      // error => {
      //   console.warn(error);
      // }
    }
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe()
  }

  private onFileLoad(fileLoadedEvent): void {
    console.log('file', fileLoadedEvent);
    const csvSeparator = ';';
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;

    const txt = textFromFileLoaded;
    const csv = [];
    const lines = txt.split('\n');
    lines.forEach((element) => {
      const cols: string[] = element.split(csvSeparator);
      csv.push(cols);
    });
    this.parsedCsv = csv;
    // this.dataFileImport = {
    //   header: this.parsedCsv[0],
    //   content: this.parsedCsv.shift()
    // };

    const header = this.parsedCsv.shift();
    const content = this.parsedCsv.map(value => value.reduce((tdObj, td, index) => {
      tdObj[header[index]] = td;
      return tdObj;
    }, {}));

    this.dataFileImport = {
      header: header,
      content: content
    }

    // const content = this.parsedCsv.map(value => {
    //   console.log('value=', value)
    // });

    // console.log('header=', header);
    // console.log('content=', content);
    // console.log(this.dataFileImport);
    if (this.dataFileImport !== undefined) {
      // console.log('dd', this.dataFileImport);
      this.importFile.emit(this.dataFileImport);
    }




    // this.onSubmit();

    // demo output as alert
    // var output: string = '';
    // csv.forEach((row) => {
    //   output += '\n';
    //   var colNo = 0;
    //   row.forEach((col) => {
    //     if (colNo > 0) output += '; ';
    //     output += col;
    //     colNo++;
    //   });
    // });
    // console.log('output', this.parsedCsv[0]);
  }

}
