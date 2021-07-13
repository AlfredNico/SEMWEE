import { LpViwersService } from './../../../services/lp-viwers.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viwer-import',
  template: `
    <h3 class="card-title align-items-start" fxLayout="column">
      <span class="fw-500 text-dark ftp fs-18 space">Import File</span>
    </h3>
    <div class="w-100 bg-white" style="padding: 4em 3em;">
      <div
        [formGroup]="form"
        class="p-5"
        fxLayout="column"
        fxLayoutAlign="space-around start"
      >
        <div
          class="uploaded_file w-100"
          fxLayout="column"
          fxLayoutAlign="space-around center"
          appDragDropp
          (fileDropped)="convertFile($event)"
        >
          <img
            src="assets/images/cloud.png"
            height="50"
            width="50"
            style="margin: 1em;"
          />
          <div for="file" class="py-2">
            Locate one or more files on your computer to upload
          </div>

          <div fxLayout="row" fxLayoutAlign="space-around center" class="w-100">
            <button
              mat-raised-button
              color="accent"
              (click)="fileInput.click()"
            >
              {{ file ? file.name : 'Or Select File to Upload' }}
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
        </div>
          <div>
            If you don't know what to upload, you can read documentation in your
            <a href="google.com" style="color:red !important">Help Center</a>, or you can
            <a download href="../assets/csv/sémwee.csv" style="color:red !important">donwload our items list sample</a>
          </div>
      </div>
    </div>
  `,
  styles: [
    `
      .uploaded_file {
        padding: 10px;
        border: dashed 3px #40425d;
        margin: 10px 0;
        border-radius: 12px;
        background: #ffffff;
      }
      .space {
        padding: 16px 0px 0px 40px;
        margin: 0 !important;
      }
    `,
  ],
})
export class ViwerImportComponent implements OnInit {
  public form = new FormGroup({
    fileSource: new FormControl('', [Validators.required]),
  });

  file: File | null | undefined;
  fileDropped: any;

  @Output() dataImported = new EventEmitter<any>(null);
  private data: {
    header: string[];
    contentCsv: any[];
  } = {
      header: [],
      contentCsv: [],
    };
  @Input() user: User = undefined;
  private ProjectName: string = '';

  csvContent: string;
  parsedCsv: string[][];
  sizeFile: any;

  constructor(
    private lpViewerService: LpViwersService,
    private readonly lpviLped: LpdLpdService,
    private readonly nofits: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lpviLped.isLoading$.next(false); // disable loading spinner
  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  convertFile(event: any) {
    const file = event.target ? event.target.files[0] : event[0];
    if (file && (file?.name as string).includes('.csv')) {
      this.sizeFile = file.size;
      this.file = file;

      this.ProjectName = file['name'].replace('.csv', '');

      this.readFileContent(file)
        .then((csvContent) => {
          try {
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

            this.data.header = [...new Set([...header])].filter(
              (item) => item != undefined && item != ''
            );

            this.data.header.unshift('all');
            this.data.contentCsv = csv;
            this.onSubmit();
          } catch (e) {
            console.log(e);
          }
        })
        .catch((error) => console.log(error));
    } else this.nofits.warn('This is no csv file !');
  }

  private processCsv(content) {
    return content.split('\n');
  }

  private readFileContent(file) {
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
      this.lpViewerService.sendProjectNames(value).subscribe((idProject) => {
        if (idProject) {
          this.dataImported.emit({
            idProject: idProject['idProject'],
            data: this.data,
          });
        }
      });
    }
  }
}
