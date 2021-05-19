import { CommonService } from './../../../../../shared/services/common.service';
import { LpViwersService } from './../../../services/lp-viwers.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, Subscription } from 'rxjs';
import { Upload } from '@app/user-spaces/dashbord/interfaces/upload';
import { User } from '@app/classes/users';
import { Users } from '@app/models/users';

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
        <input hidden type="file" id="file" name="file" class="py-2" formControlName="fileSource" #fileInput (change)="convertFile($event)" />
      </div>
      <button type="submit" mat-raised-button (click)="form.valid && onSubmit()">
        Next
        <mat-icon aria-label="close icon">double_arrow</mat-icon>
      </button>
    </div>
  `,
})
export class ViwerImportComponent implements OnInit {

  public form = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  file: File | null | undefined;

  @Output() dataImported = new EventEmitter<any>(null);
  private data: { header: string[], content: any[] } = { header: [], content: [] };
  @Input() user: User = undefined;
  private ProjectName: string = '';

  //////////////
  csvContent: string;
  parsedCsv: string[][];

  constructor(private lpViewerService: LpViwersService, private readonly common: CommonService) { }

  ngOnInit(): void { }

  processCsv(content) {
    return content.split('\n');
  }

  convertFile(event: any) {
    const file = event.target.files[0];
    this.file = event.target.files[0];

    this.ProjectName = event.target.files[0]['name'].replace('.csv', '');
    this.readFileContent(file).then(csvContent => {
      const csv = [];
      const csvSeparator = ';';
      const lines = this.processCsv(csvContent);
      lines.forEach((element) => {
        const cols: string[] = element.split(csvSeparator);
        csv.push(cols);
      });
      this.parsedCsv = csv;
      this.parsedCsv.pop();
      const header = this.parsedCsv.shift().toString().split(',');
      const content = this.parsedCsv.map(value => value.reduce((tdObj, td, index) => {
        tdObj[header[index]] = td;
        tdObj['start'] = false;
        tdObj['flag'] = false;
        return tdObj;
      }, {}));

      this.data.header = header;
      this.data.header.unshift('all');
      this.data.content = content;
      this.onSubmit();

    }).catch(error => console.log(error))
  }

  readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  public onSubmit() {
    if (this.file) {
      const value = {
        idUser: this.user._id,
        ProjectName: this.ProjectName
      };
      this.lpViewerService.sendProjectNames(value).subscribe(idProject => {
        if (idProject) {
          this.dataImported.emit({ idProject: idProject['idProject'], data: this.data });
          this.lpViewerService.sendFiles({
            idProject: idProject['idProject'],
            file: this.file
          }).subscribe();
        }
      })
    }
  }

}
