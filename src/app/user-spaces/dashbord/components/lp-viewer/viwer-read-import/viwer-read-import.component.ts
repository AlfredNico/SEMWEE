import { UpdatesHeaderComponent } from './updates-header.component';
import { HeaderOptionsComponent } from './header-options.component';
import { LpViwersService } from './../../../services/lp-viwers.service';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@app/shared/services/common.service';
import { DataSources } from '@app/user-spaces/dashbord/interfaces/data-sources';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss'],
})

export class ViwerReadImportComponent
  implements OnInit, AfterViewInit, OnChanges {
  displayedColumns: string[] = [];
  edidtableColumns: string[] = [];
  dataSource = new MatTableDataSource<DataSources>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input('dataAfterUploaded') dataAfterUploaded: DataSources = undefined;

  public items: any[] = [];

  public tabIndex = 0;

  public undoRedoLabel = 'Undo/Redo 0/0';
  public dataViews: any[] = [];

  constructor(public dialog: MatDialog, private commonService: CommonService, private lpViewer: LpViwersService, public senitizer: DomSanitizer) { }

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {

      const header = JSON.parse(JSON.stringify(this.dataAfterUploaded[0][0]['nameOrigin'].split('"').join(''))).split(',');
      const editableColumns = JSON.parse(JSON.stringify(this.dataAfterUploaded[0][0]['nameUpdate'].split('"').join(''))).split(',');
      const values = this.dataAfterUploaded[1];
      header.unshift('all');
      editableColumns.unshift('all');

      this.displayedColumns = header;
      this.edidtableColumns = editableColumns;
      this.dataSource.data = values;
      this.dataViews = values;
    }
    this.lpViewer.checkInfoSubject$.next();

  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.lpViewer.dataSources$.subscribe((res) => {
      if (res) {
        this.dataSource.data = res;
      }
    });
  }

  public openTablesOptionns() {
    this.dialog
      .open(HeaderOptionsComponent, {
        data: {
          // noHiddenRows: this.displayColumns,
          noHiddenRows: this.displayedColumns,
          hiddenRows: [],
        },
        width: '70%',
      })
      .afterClosed()
      .pipe(
        map((result: any) => {
          if (result) {
            this.displayedColumns = result.noHiddenRows;
          }
        })
      )
      .subscribe();
  }


  public openEditColumn(columnName: string) {
    const index = this.displayedColumns.indexOf(columnName);
    this.dialog
      .open(UpdatesHeaderComponent, {
        data: {
          index,
          idHeader: this.dataAfterUploaded[0][0]['_id'],
          edidtableColumns: this.edidtableColumns
        }
      })
      .afterClosed();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }

  public textFacet(column: any) {
    // this.commonService.showSpinner('table');

<<<<<<< HEAD
    let distances = {};
=======
    let distances = {},
      isExist = false;
>>>>>>> checkout-tables
    this.dataViews.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    });

    const value = Object.entries(distances).map((val: any) => {
      return { ...val, include: false };
    });

    this.lpViewer.itemsObservables$.next({
      type: 'facet',
      isMinimize: false,
      head: column,
      content: value,
    });
    // }
  }

  public textFilter(column: any) {
    this.lpViewer.itemsObservables$.next({
      type: 'filter',
      isMinimize: false,
      head: column,
    });
  }

  public isColumnDisplay(column: any): boolean {
    switch (true) {
      case column.toLowerCase().includes('idproject'):
      case column.toLowerCase().includes('_id'):
      case column.toLowerCase().includes('_v'):
        return true;

      default:
        return false;
    }
  }

  public isValidURL(value: any,): boolean {
    const res = value.match(
      /(http(s)?:\/\/.)?([A-z]\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    console.log(res);

    if (res !== null) {
      return true;
    }
    return false;
  }

  downloadCSV() {
    let csvOptions = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: false,
      noDownload: false,
      headers: [],
    };
    this.displayedColumns.splice(this.displayedColumns.indexOf('all'), 1);
    this.displayedColumns.splice(this.displayedColumns.indexOf('__v'), 1);
    this.displayedColumns.splice(this.displayedColumns.indexOf('_id'), 1);

    const tabnewObject = [];
    this.dataSource.data.forEach((valueObject) => {
      const object = {};
      this.edidtableColumns.forEach((key) => {
        object[key] = valueObject[key];
      });
      tabnewObject.push(object);
    });
    // console.log(tabnewObject);
    // console.log(this.displayedColumns);
    csvOptions.headers = this.displayedColumns; // ity lay ao @ front actuellement
    new AngularCsv(tabnewObject, 'HolidayList', csvOptions);
  }
}
