import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-cell',
  template: `
    <!-- <button mat-menu-item [matMenuTriggerFor]="editCell">Edit Cell</button>
    <mat-menu #editCell="matMenu"> -->
    <button mat-menu-item (click)="convertToTitlecase(column)">To titleCase</button>
    <button mat-menu-item (click)="convertToUppercase(column)">To uppercase</button>
    <button mat-menu-item (click)="convertToLowercase(column)">To lowercase</button>
    <mat-divider></mat-divider>
    <button mat-menu-item (click)="convertToNumber(column)">To Number</button>
    <button mat-menu-item (click)="convertToDate(column)">To date</button>
    <button mat-menu-item (click)="convertToText(column)">To text</button>
    <!-- </mat-menu> -->
  `,
  styles: []
})
export class EditCellComponent implements OnInit {

  @Input('dataSource') dataSource: any[] = [];
  @Input('columnName') column: string = undefined;
  constructor() { }

  ngOnInit(): void {
  }


  /* Convert To Title case */
  public convertToTitlecase(nameCell: string) {
    this.dataSource.forEach(item => {
      if (item[nameCell][1] === 'text') {
        item[nameCell][0] = this.toTitleCase(item[nameCell][0]);
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Uppercase */
  public convertToUppercase(nameCell: string) {
    this.dataSource.forEach(item => {
      if (item[nameCell][1] === 'text') {
        item[nameCell][0] = (item[nameCell][0] as string).toUpperCase();
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Lowercase */
  public convertToLowercase(nameCell: string) {
    this.dataSource.forEach(item => {
      if (item[nameCell][1] === 'text') {
        item[nameCell][0] = (item[nameCell][0] as string).toLowerCase();
      }
    });
    this.dataSource = this.dataSource;
  }
  /* Convert To Number */
  public convertToNumber(nameCell: string) {
    this.dataSource.forEach(item => {
      if (Number.isInteger(Number(item[nameCell][0]))) {
        item[nameCell][0] = Number(item[nameCell][0])
        item[nameCell][1] = 'number'
      }
    });
    this.dataSource = this.dataSource;
  }
  /* Convert To Date */
  public convertToDate(nameCell: string) {
    this.dataSource.forEach(item => {
      console.log('item', item[nameCell])
    });
  }
  /* Convert To Text */
  public convertToText(nameCell: string) {
    this.dataSource.forEach(item => {
      console.log('item', item[nameCell])
    });
  }

  private toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (txt: string) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

}
