import { LpViwersService } from './../../../../user-spaces/dashbord/services/lp-viwers.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-cell',
  template: `
    <button mat-menu-item (click)="convertToTitlecase(column)">
      To TitleCase
    </button>
    <button mat-menu-item (click)="convertToUppercase(column)">
      To Uppercase
    </button>
    <button mat-menu-item (click)="convertToLowercase(column)">
      To Lowercase
    </button>
    <mat-divider></mat-divider>
    <button mat-menu-item (click)="convertToNumber(column)">To Number</button>
    <button mat-menu-item (click)="convertToDate(column)">To Date</button>
    <button mat-menu-item (click)="convertToDateToIso(column)">Format ISO (Date)</button>
    <button mat-menu-item (click)="convertToText(column)">To Text</button>
    <button mat-menu-item (click)="convertToBoolean(column)">To Boolean</button>
    <mat-divider></mat-divider>
    <button mat-menu-item (click)="convertToNull(column)">To Null</button>
    <button mat-menu-item (click)="convertToEmpty(column)">To Empty</button>
  `,
  styles: [],
})
export class EditCellComponent implements OnInit {
  @Input('dataSource') dataSource: any[] = [];
  @Input('dataViews') dataViews: any[] = [];
  @Input('columnName') column: string = undefined;
  @Output() toggleChanges = new EventEmitter<any[]>();
  public numberCount: number = 0;

  constructor(private lpViwersService: LpViwersService) {}

  ngOnInit(): void {}

  /* Convert To Title case */
  public convertToTitlecase(nameCell: string) {
    this.dataViews.forEach((item) => {
      if (typeof item[nameCell] === 'string') {
        item[nameCell] = this.toTitleCase(item[nameCell]);
        this.numberCount++;
      }
    });

    // this.dataSource = this.dataViews.slice(0,10);

    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toTitlecase()`;
    this.toggleEdit(names);
  }

  /* Convert To Uppercase */
  public convertToUppercase(nameCell: string) {
    this.dataViews.forEach((item) => {
      if (typeof item[nameCell] === 'string') {
        item[nameCell] = (item[nameCell] as string).toUpperCase();
        this.numberCount++;
      }
    });
    // this.dataSource = this.dataViews.slice(0,10);
    
    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toUppercase()`;
    this.toggleEdit(names);
  }

  /* Convert To Lowercase */
  public convertToLowercase(nameCell: string) {
    this.dataViews.forEach((item) => {
      if (typeof item[nameCell] === 'string') {
        item[nameCell] = (item[nameCell] as string).toLowerCase();
        this.numberCount++;
      }
    });

    // this.dataSource = this.dataViews.slice(0,10);

    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toLowercase()`;
    this.toggleEdit(names);
  }

  allDataIsAnumberorDate(value:any[],nameCells : string, type : string){
    let test = true;
    let i = 0;
    if(type === "number"){
      while (test && value.length > i) { 
        
         if (!(/^[0-9]+[\.,]?[0-9]*$/.test(value[i][nameCells]))) {
         test = false; 
          }
        i++;  
      }
    }else{
        const regex1 =/^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/;
        const regex3 =/^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
       while (test && value.length > i) { 
         if (!regex1.test(value[i][nameCells]) && !regex3.test(value[i][nameCells])) {
         test = false; 
          }
        i++;  
      }
    }
    return test;
  }
  /* Convert To Number */
  public convertToNumber(nameCell: string) {
    let test = this.allDataIsAnumberorDate(this.dataViews, nameCell, "number")
    if (test){
        this.dataViews.forEach((item) => {
          const replace = typeof (item[nameCell]) === "string" ? item[nameCell].replace(',', '.') : item[nameCell];
          if(typeof (item[nameCell]) === "string" ){
            const parsed = parseFloat(replace);
            if (!isNaN(parsed)) {
              item[nameCell] = parsed;
              this.numberCount++;
            } 
          }
          
        });
        const names = `Update on ${this.numberCount++} cells in column ${nameCell}: value.toNumber()`;
        this.toggleEdit(names);
    }else{
        alert("there is a value which is not valid number in the data")
    }
    
  }

  /* Convert To Date */

  public convertToDate(nameCell: string) {
    let test = this.allDataIsAnumberorDate(this.dataViews, nameCell, "date")
    const regex3 =
      /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
       const regex1 =
      /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/;
    if(test){
      const regex2 = new RegExp('[-]');
      this.dataViews.forEach((item) => {
            const tab = item[nameCell].split(regex2);
        if(regex1.test(item[nameCell])){
          console.log("regex 1")
            item[nameCell] = moment(
              `${tab[0]}-${tab[1]}-${tab[2]}`,
              'YYYY-MM-DD',
              true
            ).format();
        this.numberCount++;
        }
      });
      const names = `Update on ${this.numberCount++} cells in column ${nameCell}: value.toDate()`;
      this.toggleEdit(names);
    }else{
      alert("There is a date that is not in iso format");
    }
  }

  /* Convert To Text */
  public convertToText(nameCell: string) {
     const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    this.dataViews.forEach((item) => {
      if (
          regex3.exec(item[nameCell]) &&
          item[nameCell].split('T')[0] === item[nameCell].split('T')[0]
        ) {
          const regex2 = new RegExp('[-\\/ ]');
          const tab = item[nameCell].split(regex2);
          const tab1 = tab[2].toString().split('T');
          item[nameCell] = moment(
          `${tab[0]}-${tab[1]}-${tab1[0]}`,
          'YYYY-MM-DD',
          true
        ).format('YYYY-MM-DD');
         this.numberCount++;
        }else{
             item[nameCell] = item[nameCell].toString();
             this.numberCount++;
        
      }
      
    });
    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toText()`;
    this.toggleEdit(names);
  }

  /* Convert To Boolean */
  public convertToBoolean(nameCell: string) {
    this.dataViews.forEach((item) => {
      if (typeof item[nameCell] === 'string') {
        if (item[nameCell].toLowerCase() === 'true') {
          item[nameCell] = true;
          this.numberCount++;
        } else if (item[nameCell].toLowerCase() === 'false') {
          item[nameCell] = false;
          this.numberCount++;
        }
      }
    });

    // this.dataSource = this.dataViews.slice(0,10);

    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toBoolean()`;
    this.toggleEdit(names);
  }

  /* Convert To Null */
  public convertToNull(nameCell: string) {
    this.dataViews.forEach((item) => {
      item[nameCell] = null;
      this.numberCount++;
    });

    // this.dataSource = this.dataViews.slice(0,10);

    const names = `Update on ${this.numberCount++} cells in column ${nameCell}: value.toNull()`;
    this.toggleEdit(names);
  }

  /* Convert To Empty */
  public convertToEmpty(nameCell: string) {
    this.dataViews.forEach((item) => {
      item[nameCell] = '';
      this.numberCount++;
    });

    // this.dataSource = this.dataViews.slice(0,10);

    
    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toEmpty()`;
    this.toggleEdit(names);
  }

  convertToDateToIso(nameCells : string){
     const regex1 =/^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
     this.dataViews.forEach((item) => {
        const regex2 = new RegExp('[-\\/]');
        if(regex1.test(item[nameCells])){
          const tab = item[nameCells].split(regex2);
          item[nameCells] = moment(
              `${tab[2]}-${tab[1]}-${tab[0]}`,
              'YYYY-MM-DD',
              true
            ).format('YYYY-MM-DD');
          }
    });
  }

  public toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (str: string) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    );
  }

  public toggleEdit(namesHistorique) {
    this.lpViwersService.isloadingHistory.next(true)
    const tab = [false, '', namesHistorique];
    this.toggleChanges.emit(tab);
    this.numberCount = 0;
  }
}
