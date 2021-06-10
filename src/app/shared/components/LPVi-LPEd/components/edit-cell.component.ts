import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-cell',
  template: `
    <button mat-menu-item (click)="convertToTitlecase(column)">To TitleCase</button>
    <button mat-menu-item (click)="convertToUppercase(column)">To Uppercase</button>
    <button mat-menu-item (click)="convertToLowercase(column)">To Lowercase</button>
    <mat-divider></mat-divider>
    <button mat-menu-item (click)="convertToNumber(column)">To Number</button>
    <button mat-menu-item (click)="convertToDate(column)">To Date</button>
    <button mat-menu-item (click)="convertToText(column)">To Text</button>
    <button mat-menu-item (click)="convertToBoolean(column)">To Boolean</button>
    <mat-divider></mat-divider>
    <button mat-menu-item (click)="convertToNull(column)">To Null</button>
    <button mat-menu-item (click)="convertToEmpty(column)">To Empty</button>
  `,
  styles: []
})
export class EditCellComponent implements OnInit {

  @Input('dataSource') dataSource: any[] = [];
  @Input('columnName') column: string = undefined;
  constructor() { }

  ngOnInit(): void { }


  /* Convert To Title case */
  public convertToTitlecase(nameCell: string) {
    this.dataSource.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        item[nameCell] = this.toTitleCase(item[nameCell]);
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Uppercase */
  public convertToUppercase(nameCell: string) {
    this.dataSource.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        item[nameCell] = (item[nameCell] as string).toUpperCase();
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Lowercase */
  public convertToLowercase(nameCell: string) {
    this.dataSource.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        item[nameCell] = (item[nameCell] as string).toLowerCase();
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Number */
  public convertToNumber(nameCell: string) {
    this.dataSource.forEach(item => {
      if (Number.isInteger(Number(item[nameCell]))) {
        item[nameCell] = Number(item[nameCell]);
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Date */
  public convertToDate(nameCell: string) {
    const reg2 = /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
    const reg1 = /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])$/;
    const regex3 = /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    const regex2 = new RegExp('[-\\/ ]');

    this.dataSource.forEach((item) => {
      if (reg1.exec(item[nameCell])) {
        const tab = item[nameCell].split(regex2);
        item[nameCell] = moment(
          `${tab[0]}-${tab[1]}-${tab[2]}`,
          'YYYY-MM-DD',
          true
        ).format();
      }

      // .format('DD'/MM/YYYY);
      else if (reg2.exec(item[nameCell])) {
        // item[nameCell] = "Mea"
        this.dataSource.forEach((item) => {
          const tab = item[nameCell].split(regex2);
          item[nameCell] = moment(
            `${tab[0]}-${tab[1]}-${tab[2]}`,
            'DD-MM-YYYY',
            true
          ).format();
        });
      }
    })
  }

  /* Convert To Text */
  public convertToText(nameCell: string) {
    this.dataSource.forEach(item => {
      if (typeof (item[nameCell]) !== 'string') {
        item[nameCell] = (item[nameCell]).toString();
      }
    });

    this.dataSource = this.dataSource;
  }

  /* Convert To Boolean */
  public convertToBoolean(nameCell: string) {
    this.dataSource.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        if (item[nameCell].toLowerCase() === 'true') {
          item[nameCell] = true;
        } else if (item[nameCell].toLowerCase() === 'false') {
          item[nameCell] = false;
        } else {
          item[nameCell] = item[nameCell];
        }

        console.log(typeof (item[nameCell]));
      }
    });

    this.dataSource = this.dataSource;
  }

  /* Convert To Null */
  public convertToNull(nameCell: string) {
    this.dataSource.forEach(item => {
      item[nameCell] = null;
    });

    this.dataSource = this.dataSource;
  }

  /* Convert To Empty */
  public convertToEmpty(nameCell: string) {
    this.dataSource.forEach(item => {
      item[nameCell] = "";
    });

    this.dataSource = this.dataSource;
  }

  public toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (str: string) =>
        str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    );
  }

  public dateValidator(c: any): { [key: string]: boolean } | null {
    if ((c !== undefined && c !== '' && c != null)) {

      var month = null;
      var day = null;
      var year = null;
      var currentTaxYear = Number(new Date().getFullYear());
      if (c.indexOf('/') > -1) {
        var res = c.split("/");
        if (res.length > 1) {
          month = res[1];
          day = res[0]
          year = res[2];
        }
      }
      else if (c.indexOf('-') > -1) {
        var res = c.split("-");
        if (res.length > 1) {
          month = res[1];
          day = res[0]
          year = res[2];
        }
      }
      if (isNaN(month) || isNaN(day) || isNaN(year)) {
        return { 'dateInvalid': true };
      }
      month = Number(month);
      day = Number(day);
      year = Number(year);
      if (month < 1 || month > 12) { // check month range
        return { 'dateInvalid': true };
      }
      if (day < 1 || day > 31) {
        return { 'dateInvalid': true };
      }
      if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
        return { 'dateInvalid': true };
      }
      if (month == 2) {
        var isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
        if (day > 29 || (day === 29 && !isleap)) {
          return { 'dateInvalid': true };
        }
      }
      if (year !== currentTaxYear) {
        return { 'dateYearGreaterThanTaxYear': true };
      }
    }
    return null;
  }

}
