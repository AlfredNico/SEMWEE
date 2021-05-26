import { LpEditorService } from './../../../services/lp-editor.service';
import { EditorDialogComponent } from '../editor-dialog.component';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-read-view-file',
  templateUrl: './read-view-file.component.html',
  styleUrls: ['./read-view-file.component.scss']
})
export class ReadViewFileComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // public event: any;

  public items: any[] = [];

  public tabIndex = 0;

  public undoRedoLabel = 'Undo/Redo 0/0';
  @Input('dataAfterUploaded') dataAfterUploaded: any = undefined;
  public dataViews: any[] = [];

  constructor(public dialog: MatDialog, private lpEditor: LpEditorService, public datepipe: DatePipe) { }

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {
      const header = JSON.parse(
        JSON.stringify(
          this.dataAfterUploaded[0][0]['nameOrigin'].split('"').join('')
        )
      ).split(',');
      const editableColumns = JSON.parse(
        JSON.stringify(
          this.dataAfterUploaded[0][0]['nameUpdate'].split('"').join('')
        )
      ).split(',');
      const values = this.dataAfterUploaded[1];
      header.unshift('all');
      editableColumns.unshift('all');

      this.displayedColumns = header;
      // this.dataSource.data = this.checkFilter(values);
      this.dataSource.data = this.dataViews = values;
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }

  public openEditorDialog(element: any, possition: string, isLast: boolean): void {
    const { left, top } = this.getOffset(element);
    const width = element.offsetWidth;


    const dialogRef = this.dialog.open(EditorDialogComponent, {
      backdropClass: 'cdk-overlay-transparent-backdrop',
      width: '250px',
      position: {
        left: (possition === 'left' || isLast === true) ? `${left - 250}px` : `${left + width}px`,
        top: `${top}px`,
      },
      hasBackdrop: true,
    });
  }

  private getOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  public filterColumn(column: any) {
    let distances = {}, isExist = false;
    this.dataSource.data.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    let valu = Object.entries(distances).map((val: any) => {
      return { ...val }
    })

    this.items.map(value => {
      if (value['head'] && value['head'] === column) {
        isExist = true;
        return;
      }
    })

    if (isExist === false) {
      this.items.push({
        head: column,
        content: valu
      });
    }
  }

  public textFacet(column: any) {
    // this.commonService.showSpinner('table');

    let distances = {}, isExist = false;
    this.dataSource.data.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    const value = Object.entries(distances).map((val: any) => {
      return { ...val }
    })

    this.lpEditor.itemsObservables$.next({
      type: 'facet',
      isMinimize: false,
      head: column,
      content: value
    });
    // }
  }

  public textFilter(column: any) {
    this.lpEditor.itemsObservables$.next({
      type: 'filter',
      isMinimize: false,
      head: column,
    });
  }

  /* Convert To Title case */
  public convertToTitlecase(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        item[nameCell] = this.toTitleCase(item[nameCell]);
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Uppercase */
  public convertToUppercase(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        item[nameCell] = (item[nameCell] as string).toUpperCase();
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Lowercase */
  public convertToLowercase(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (typeof (item[nameCell]) === 'string') {
        item[nameCell] = (item[nameCell] as string).toLowerCase();
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Number */
  public convertToNumber(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (Number.isInteger(Number(item[nameCell]))) {
        item[nameCell] = Number(item[nameCell]);
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Date */
  public convertToDate(nameCell: string) {
    this.dataSource.data.forEach(item => {
      console.log(this.dateValidator(item[nameCell]));
      if (this.dateValidator(item[nameCell]) == null) {
        let dateString = item[nameCell];
        let dateObject = new Date();

        if (dateString.indexOf('/') > -1) {
          let dateParts = dateString.split("/");
          dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }
        else if (dateString.indexOf('-') > -1) {
          let dateParts = dateString.split("-");
          dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }

        // // item[nameCell] = this.datepipe.transform(dateObject, 'dd/MM/yyyy');
        item[nameCell] = dateObject;

        console.log(item[nameCell]);
        console.log(typeof (item[nameCell]));

      }
    });

    this.dataSource = this.dataSource;
  }

  /* Convert To Text */
  public convertToText(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (typeof (item[nameCell]) !== 'string') {
        item[nameCell] = (item[nameCell]).toString();
      }
    });

    this.dataSource = this.dataSource;
  }

  /* Convert To Boolean */
  public convertToBoolean(nameCell: string) {
    this.dataSource.data.forEach(item => {
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
    this.dataSource.data.forEach(item => {
      item[nameCell] = null;
    });

    this.dataSource = this.dataSource;
  }

  /* Convert To Empty */
  public convertToEmpty(nameCell: string) {
    this.dataSource.data.forEach(item => {
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


