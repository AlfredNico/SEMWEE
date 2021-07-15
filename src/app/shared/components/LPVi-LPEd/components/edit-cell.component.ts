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

  constructor() {}

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

  allDataIsAnumber(value:any[],nameCells : string){
    let test = true;
    let i = 0;
    while (test && value.length > i) {
      
       if (!(/^[0-9]+[\.,]?[0-9]*$/.test(value[i][nameCells]))) {
       test = false; 
        }
      i++;  
    }
    return test;
  }
  /* Convert To Number */
  public convertToNumber(nameCell: string) {
    let test = this.allDataIsAnumber(this.dataViews, nameCell)

    if (test){
        this.dataViews.forEach((item) => {
          const replace = typeof (item[nameCell]) === "string" ? item[nameCell].replace(',', '.') : item[nameCell];
          const parsed = parseFloat(replace);
            if (!isNaN(parsed)) {
              item[nameCell] = parsed;
              this.numberCount++;
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
    const reg2 =
      /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
    const reg1 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])$/;
    const regex2 = new RegExp('[-\\/ ]');

    this.dataViews.forEach((item) => {
      if (reg1.exec(item[nameCell])) {
        const tab = item[nameCell].split(regex2);
        item[nameCell] = moment(
          `${tab[0]}-${tab[1]}-${tab[2]}`,
          'YYYY-MM-DD',
          true
        ).format();
        this.numberCount++;
      }
      // .format('DD'/MM/YYYY);
      else if (reg2.exec(item[nameCell])) {
        const tab = item[nameCell].split(regex2);
        item[nameCell] = moment(
          `${tab[0]}-${tab[1]}-${tab[2]}`,
          'DD-MM-YYYY',
          true
        ).format();
        this.numberCount++;
      }
    });
    // this.dataSource = this.dataViews.slice(0,10);
    
    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toDate()`;
    this.toggleEdit(names);
  }

  /* Convert To Text */
  public convertToText(nameCell: string) {
    this.dataViews.forEach((item) => {
      if (typeof item[nameCell] !== 'string') {
        item[nameCell] = item[nameCell].toString();
        this.numberCount++;
      }
    });
    // this.dataSource = this.dataViews.slice(0,10);

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

    const names = `Update on ${this
      .numberCount++} cells in column ${nameCell}: value.toNull()`;
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

  public toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (str: string) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    );
  }

  public toggleEdit(namesHistorique) {
    const tab = [false, '', namesHistorique];
    this.toggleChanges.emit(tab);
    this.numberCount = 0;
  }
}
