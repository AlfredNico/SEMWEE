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
    <!-- fxLayoutAlign="space-around space-between center" -->
    <div class="w-100 bg-white" style="padding: 4em 3em;">
      <form [formGroup]="form">
        <div
          class="w-100"
          *ngIf="
            fileName !== undefined &&
            fileName?.length > 0 &&
            isExcelFile === true
          "
          fxLayout="row"
          fxLayoutAlign="space-around center"
        >
          <div style="width: 100%;text-align: center;">
            <h1>{{ fileName }}</h1>
            <h1>Is Uploaded !</h1>
          </div>
          <img class="img_uploaded" src="assets/images/items.png" />
        </div>

        <div *ngIf="fileName?.length >= 0 && isExcelFile === false">
          <div
            class="uploaded_file w-100"
            fxLayout="column"
            fxLayoutAlign="space-around center"
            appDragDrop
            (fileDropped)="onFileChange($event)"
          >
            <img
              src="assets/images/cloud.png"
              height="50"
              width="50"
              style="margin: 1em;"
            />
            <div>
              Locate one or more files on your computer to upload:
            </div>

            <div
              fxLayout="row"
              fxLayoutAlign="space-around center"
              class="w-100"
            >
              <button
                type="button"
                mat-raised-button
                color="accent"
                class="m-3"
                (click)="fileInput.click()"
              >
                Select
              </button>
              <input
                #fileInput
                type="file"
                (change)="onFileChange($event)"
                hidden
              />
            </div>
            <!-- (change)="onFileChange($event)" -->

            <div
              *ngIf="
                fileName !== undefined &&
                fileName?.length > 0 &&
                isExcelFile === false
              "
              [style.color]="'red'"
            >
              This is not an Excel file
            </div>
          </div>

          <div>
            If you don't know what to upload, you can read documentation in your
            <a href="google.com">Help Center</a>, or you can
            <a href="google.com">donwload our items list sample</a>
          </div>
        </div>

        <button
        mat-raised-button
        style="margin: 25px 10px 0 0;"
        color="warn"
        *ngIf="
          fileName !== undefined &&
          fileName?.length > 0 &&
          isExcelFile === true
        "
        (click)="removeUpload()"
      >
        Remove upload
      </button>
      <button
        style="margin: 25px 0 0 10px"
        mat-raised-button
        color="accent"
        (click)="form.valid && onSubmit()"
      >
        <span>Next</span>
      </button>
    </form>
  </div>
  `,
  styles: [
    `
      /* .img_uploaded {
        position: absolute;
      } */
      .uploaded_file {
        padding: 10px;
        border: dashed 3px #40425d;
        margin: 10px 0;
        border-radius: 12px;
        background: #ffffff;
      }
    `,
  ],
})
export class ViwerImportComponent implements OnInit, OnDestroy {

  public form = new FormGroup({
    fileName: new FormControl('', [
      Validators.required,
      Validators.pattern(/(.csv)/),
    ]),
    fileSource: new FormControl('', [Validators.required]),
  });

  // read excel file:
  public isExcelFile: boolean = false;
  fileName = '';
  fileDropped: any;
  // file: File | null | undefined;

  @Output() importFile = new EventEmitter<any>();
  @Input() user: User = undefined;

  // Check if next step is true
  @Input() isNextStep: boolean;

  @Input() idProjet: string;

  private subscription$: Subscription | undefined

  csvContent: string;
  parsedCsv: string[][];

  constructor(
    private lpViewerService: LpViwersService, 
    private readonly common: CommonService
  ) { }

  ngOnInit(): void { }

  // onFileInput(files: FileList | null): void {
  //   if (files) {
  //     this.file = files.item(0);
  //   }
  // }

  public onFileChange(event: any) {
    const target: DataTransfer = event.target
      ? <DataTransfer>event.target
      : undefined;

    this.isExcelFile = event.target
      ? !!target.files[0]?.name.match(/(.csv)/)
      : !!event[0]?.name.match(/(.csv)/);

    const file = event.target ? event.target.files[0] : event[0];
    this.fileName = event.target ? event.target.files[0]?.name : event[0]?.name;
    if (event.length > 0 || event.target.files.length > 0) {
      this.form.patchValue({
        fileSource: file,
        fileName: file?.name,
      });

      // Read CSV file
      // const fileToRead = file;
      // const fileReader = new FileReader();
      // fileReader.onload = this.onFileLoad;
      // fileReader.readAsText(fileToRead, 'UTF-8');
    }
  }

  onSubmit() {
    // this.common.showSpinner('table', true, '');
    this.lpViewerService.isLoading$.next(true);
    // if (this.file) {

    // try {
      this.subscription$ = this.lpViewerService
      .upload(this.form.get('fileSource')?.value as File, this.user._id)
      .subscribe(
        res => {
            if (res) {
              this.importFile.emit(res);
              this.lpViewerService.isLoading$.next(false);
            }
            this.lpViewerService.isLoading$.next(false);
          }),
        error => {
          this.lpViewerService.isLoading$.next(false);
          console.warn(error)
        }
      // this.common.hideSpinner();
    // }

    // }
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe()
  }

  removeUpload() {
    this.fileName = '';
    this.isExcelFile = false;
    this.form.patchValue({
      fileSource: '',
      fileName: '',
    });
  }

}