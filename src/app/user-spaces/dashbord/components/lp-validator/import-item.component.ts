import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { LpValidatorService } from '../../services/lp-validator.service';

@Component({
  selector: 'app-import-item',
  template: `
    <div class="w-100">
      <form [formGroup]="form">
        <div
          *ngIf="
            fileName !== undefined &&
            fileName?.length > 0 &&
            isExcelFile === true
          "
          fxLayout="column"
          fxLayoutAlign="space-around center"
        >
          <h1>{{ fileName }}</h1>
          <h1>Is uploaded !</h1>
        </div>

        <div *ngIf="fileName?.length >= 0 && isExcelFile === false">
          <div
            class="uploaded_file w-100"
            fxLayout="column"
            fxLayoutAlign="space-around center"
            appDragDrop
            (fileDropped)="onFileChange($event)"
          >
            <img src="assets/images/cloud.png" height="50" width="50" />
            <div>
              Drap and drop your item to start list page validation process
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
                Or Select File to Upload
              </button>
              <input
                #fileInput
                type="file"
                (change)="onFileChange($event)"
                hidden
              />
            </div>

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
          style="margin: 25px 0 5px;"
          mat-raised-button
          color="accent"
          (click)="form.valid && onSubmit()"
        >
          Display Items
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .uploaded_file {
        padding: 10px;
        border: dashed 3px #40425d;
        margin: 10px 0;
        border-radius: 12px;
      }
    `,
  ],
})
export class ImportItemComponent implements OnInit, OnDestroy {
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
  //shared data
  // @Output() uploadFiles = new EventEmitter<any>();
  @Output() uploadFiles = new EventEmitter<any>();

  @Input() idProjet: string;

  //subscription
  public subscription$ = new Subscription();

  constructor(
    private lpValidatorServices: LpValidatorService,
    private common: CommonService,
    private notifs: NotificationService
  ) {}

  ngOnInit(): void {}

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
    }
  }

  public async onSubmit() {
    this.common.isLoading$.next(true);
    this.common.showSpinner('root');

    try {
      const result = await this.lpValidatorServices.getUpload(
        this.idProjet,
        this.form.get('fileSource')?.value as File
      );
      if (result) {
        this.uploadFiles.emit(result);
      } else {
        this.notifs.warn('Server is not responding');
      }
      this.common.hideSpinner();
      this.common.isLoading$.next(false);
    } catch (error) {
      this.notifs.warn('Server is not responding');
      console.log('error ', error);
      this.common.hideSpinner();
      this.common.isLoading$.next(false);
      throw error;
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
