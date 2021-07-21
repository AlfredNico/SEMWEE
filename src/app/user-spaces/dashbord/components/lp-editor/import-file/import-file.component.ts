import { LpEditorService } from './../../../services/lp-editor.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from '@app/shared/services/common.service';
import { NotificationService } from '@app/services/notification.service';
import { User } from '@app/classes/users';

@Component({
  selector: 'app-import-file',
  template: `
    <div [formGroup]="form" class="p-5" fxLayout="column" fxLayoutAlign="space-around start">
    <div
      [formGroup]="form"
      class="p-5"
      fxLayout="column"
      fxLayoutAlign="space-around start"
    >
      <div
        fxLayout="row"
        fxLayoutAlign="space-around center"
        fxLayoutGap="20px"
      >
        <mat-label for="file" class="py-2">
          Locate one or more files on your computer to upload:
        </mat-label>
        <button mat-raised-button (click)="fileInput.click()">
          {{ file ? file.name : 'Select' }}
        </button>
        <input
          hidden
          type="file"
          id="file"
          name="file"
          class="py-2"
          formControlName="fileSource"
          #fileInput
          (change)="convertFile($event)"
        />
      </div>
      <button
        type="submit"
        mat-raised-button
        (click)="form.valid && onSubmit()"
      >
        Next
        <mat-icon aria-label="close icon">double_arrow</mat-icon>
      </button>
    </div>
  `,
})
export class ImportFileComponent implements OnInit {

  public form = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  file: File | null | undefined;

  @Output() dataImported = new EventEmitter<any>(null);
  private data: { header: string[]; content: any[] } = {
    header: [],
    content: [],
  };
  @Input() user: User = undefined;
  private ProjectName: string = '';

  //////////////
  csvContent: string;
  parsedCsv: string[][];
  sizeFile: any;

  constructor(
    private lpEditor: LpEditorService,
    private readonly common: CommonService,
    private readonly nofits: NotificationService
  ) { }

  ngOnInit(): void { }

  processCsv(content) {
    return content.split('\n');
  }

  convertFile(event: any) {
    if ((event.target.files[0]['name'] as string).includes('.csv')) {
      const file = event.target.files[0];
      this.sizeFile = event.target.files[0].size;
      this.file = event.target.files[0];

      this.ProjectName = event.target.files[0]['name'].replace('.csv', '');
      this.readFileContent(file)
        .then((csvContent) => {
          const csv = [];
          const lines = this.processCsv(csvContent);
          const sep1 = lines[0].split(';').length;
          const sep2 = lines[0].split(',').length;
          const csvSeparator = sep1 > sep2 ? ';' : ',';
          lines.forEach((element) => {
            const cols: string[] = element.split(csvSeparator);
            csv.push(cols);
          });
          this.parsedCsv = csv;
          this.parsedCsv.pop();

          const header = this.parsedCsv.shift().toString().split(',');
          const content = this.parsedCsv.map((value) =>
            value.reduce((tdObj, td, index) => {
              tdObj[header[index]] = td;
              tdObj['start'] = false;
              tdObj['flag'] = false;
              return tdObj;
            }, {})
          );

          this.data.header = [...new Set([...header])].filter(
            item => (item != undefined && item != '')
          );
          this.data.header.unshift('all');
          this.data.content = content;
          this.onSubmit();
        })
        .catch((error) => console.log(error));
    } else {
      this.nofits.warn('This is no csv file !');
    }
  }

  readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  public onSubmit() {
    if (this.file) {
      const value = {
        idUser: this.user._id,
        ProjectName: this.ProjectName,
        sizefile: this.sizeFile,
        headers: this.data.header,
      };

      this.lpEditor.sendProjectNames(value).subscribe((idProject) => {
        if (idProject) {
          this.dataImported.emit({
            idProject: idProject['idProject'],
            data: this.data,
          });
          this.lpEditor
            .sendFiles({
              idProject: idProject['idProject'],
              fileData: this.data.content,
            })
            .subscribe();
        }
      });
    }
  }

}