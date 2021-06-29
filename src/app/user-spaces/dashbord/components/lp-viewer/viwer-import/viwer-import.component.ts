import { CommonService } from './../../../../../shared/services/common.service';
import { LpViwersService } from './../../../services/lp-viwers.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
// import { Converter } from 'csvtojson';
import * as csv from 'csvtojson';
import { InstructionService } from '@app/services/instruction.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viwer-import',
  template: `
    <h3 class="card-title align-items-start" fxLayout="column">
            <span class="fw-500 text-dark ftp fs-18 space"
              >Import File</span>
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
        </div>
      </div>
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
      .space {
        padding: 16px 0px 0px 40px;
        margin: 0!important;
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
  private data: { header: string[]; content: any[]; name: any[] } = {
    header: [],
    content: [],
    name: [],
  };
  @Input() user: User = undefined;
  private ProjectName: string = '';

  //////////////
  csvContent: string;
  parsedCsv: string[][];
  sizeFile: any;
  headerRegex = ["id", "category", "category", "subcategory", "facet", "path", "name", "full title", "short title", "main heading", "meta description", "rel canonical tag", "meta name robots index", "meta name robots follow", "x-robots-tag index", "x-robots-tag follow", "x-robots-tag canonical", "meta keywords", "description", "tags", "price", "currency", "available", "main image", "main image alt", "custom"];
  acceptHeader: boolean = true;
  lastIndex: number;
  exit: boolean = false;

  constructor(
    private lpViewerService: LpViwersService,
    private readonly common: CommonService,
    private readonly nofits: NotificationService,
    private readonly instr: InstructionService,
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {}

  processCsv(content) {
    return content.split('\n');
  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  convertFile(event: any) {
    const file = event.target ? event.target.files[0] : event[0];
    if ((file['name'] as string).includes('.csv')) {
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

            let ind = 0;

            for(let i=0; i < header.length-1; i++) {
              
              if(!(/\s/g.test(header[i]))) {
                console.log('header[i].toLowerCase()', header[i].toLowerCase());
                console.log('this.headerRegex[ind]', this.headerRegex[ind]);

                this.acceptHeader = header[i].toLowerCase() == this.headerRegex[ind] ? true : false;
                if(!this.acceptHeader) {
                  this.instr.infoIterropt('The file\'s process has stopped because the header '+header[i]+' doesn\'t follow the recommendation. For more help, see the documentation');
                  this.exit = true;
                }
              } else {
                this.lastIndex = i;

                console.log('-----------------this.headerRegex[ind]', this.headerRegex[ind])

                let prevRegex = this.headerRegex[ind];
                let initNumber = prevRegex == "category" ? 2 : 1;
                let word = header[i].split(" ");

                if(word[0].toLowerCase() == "custom") {

                  for(let k = this.lastIndex; k < header.length; k++) {

                    this.acceptHeader = false;

                    console.log("3- Custom")
                    console.log('k', k)
                    console.log('header.length', header.length)
                    console.log("prevRegex ---------- initNumber", prevRegex+" ------------ "+initNumber)
                    
                    
                    
                    console.log("header[k].toLowerCase()", "-"+header[k].toLowerCase()+"-")

                    console.log('comp 1', "-"+prevRegex+" data name "+initNumber+"-");

                    console.log('comp 2', "-"+prevRegex+" data "+initNumber+"-");

                    if(header[k].toLowerCase() == prevRegex+" data name "+initNumber || header[k].toLowerCase() == prevRegex+" data "+initNumber){
                      console.log('Not false');
                    }
                    

                    if(header[k].toLowerCase() == (prevRegex+" data name "+initNumber).toString()) {

                      this.acceptHeader = true;
                      console.log("Comparaison -- DATA NAME --", header[k].toLowerCase() == prevRegex+" data name "+initNumber);
                      

                    } else if(header[k].toLowerCase() == (prevRegex+" data "+initNumber).toString()) {
                      // console.log("prevRegex initNumber", prevRegex+" data "+initNumber)
                      console.log("Comparaison -- DATA --", header[k].toLowerCase() == prevRegex+" data "+initNumber);
                      this.acceptHeader = true;
                      initNumber++;
                    }

                    // else if(header[k].toLowerCase() == "")

                    console.log("this.acceptHeader", this.acceptHeader);

                     if(!this.acceptHeader) {
                      this.instr.infoIterropt('The file\'s process has stopped because the header '+header[k]+' doesn\'t follow the recommendation. For more help, see the documentation');
                      this.exit = true;
                    }else if(header[k+1] == "" || header[k+1] == null){
                      console.log('ok');
                      this.exit = true;
                    }
                    // if(!this.acceptHeader) {
                    //   i=k-1;
                    //   break;
                    // }
                  }

                }
                else if(!(Number.isInteger(Number(word[1])))) {

                  this.acceptHeader = false;

                  console.log("2- Split text")
                  console.log("header[i].toLowerCase()", header[i].toLowerCase())

                  this.acceptHeader = header[i].toLowerCase() == prevRegex ? true : false;
                  if(!this.acceptHeader) {
                    this.instr.infoIterropt('The file\'s process has stopped because the header '+header[i]+' doesn\'t follow the recommendation. For more help, see the documentation');
                    this.exit = true;
                  }

                } else {
                  for(let k = this.lastIndex; k < header.length; k++) {

                    this.acceptHeader = false;

                    console.log("4- ")
                  console.log("header[i].toLowerCase()", header[i].toLowerCase())
                    
                    if((prevRegex == "facet") && (header[k].toLowerCase() == prevRegex+" "+initNumber)) this.acceptHeader = true;
                    else if(header[k].toLowerCase() == prevRegex+" "+initNumber) {
                      this.acceptHeader = true;
                      initNumber++;
                    }
                    else if(header[k].toLowerCase() == prevRegex+" "+initNumber+" value") {
                      this.acceptHeader = true;
                      initNumber++;
                    }
                    
                    if(!this.acceptHeader) {
                      i=k-1;
                      break;
                    }
                  }
                }

                
              }
              if(this.headerRegex.length === ind) {
                this.instr.infoIterropt('The file\'s process has stopped because the header '+header[i+1]+' doesn\'t follow the recommendation. For more help, see the documentation');
                this.exit = true;
              }
              ind++;

              if(this.exit == true) {
                  this.reload();
                  throw "exit";
              }
            }

            const content = this.parsedCsv.map((value) =>
              value.reduce((tdObj, td, index) => {
                tdObj[header[index]] = td;
                tdObj['start'] = false;
                tdObj['flag'] = false;
                return tdObj;
              }, {})
            );

            this.data.header = [...new Set([...header])].filter(
              (item) => item != undefined && item != ''
            );
            this.data.header.unshift('all');
            this.data.content = content;
            this.onSubmit();

          } catch(e) {
            console.log(e);
          }
          
        })
        .catch((error) => console.log(error));
    } else this.nofits.warn('This is no csv file !');
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
      this.lpViewerService.sendProjectNames(value).subscribe((idProject) => {
        if (idProject) {
          this.data.name = [
            {
              idName: 0,
              name: 'Create project',
              idProject: idProject['idProject'],
            },
          ];
          this.dataImported.emit({
            idProject: idProject['idProject'],
            data: this.data,
            idHeader: 0,
          });
          this.lpViewerService
            .sendFiles(
              {
                namehistory: 'Create project',
                idProject: idProject['idProject'],
                fileData: this.data.content,
                idHeader: 0,
              },
              -1
            )
            .subscribe();
        }
      });
    }
  }
}
