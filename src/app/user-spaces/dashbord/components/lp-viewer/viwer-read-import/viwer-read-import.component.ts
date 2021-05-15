import { header } from './../../../interfaces/data-sources';
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
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from '@app/shared/services/common.service';
import { DataSources } from '@app/user-spaces/dashbord/interfaces/data-sources';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import value from '*.json';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss']
})
export class ViwerReadImportComponent implements OnInit, AfterViewInit, OnChanges {

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
      
      this.displayedColumns = this.dataAfterUploaded.columns;
      this.edidtableColumns = this.dataAfterUploaded.editableColumns;
      this.dataSource.data = this.dataAfterUploaded.data;
      this.dataViews = this.dataAfterUploaded.data;
      
      console.log(this.edidtableColumns);
    }
    this.lpViewer.checkInfoSubject$.next();

  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.lpViewer.dataSources$.subscribe(res => {
      if (res) {
        this.dataSource.data = res;
      }
    })
  }

  public openTablesOptionns() {
    this.dialog
      .open(HeaderOptionsComponent, {
        data: {
          // noHiddenRows: this.displayColumns,
          noHiddenRows: this.displayedColumns,
          hiddenRows: []
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
          edidtableColumns: this.edidtableColumns
        }
      })
      .afterClosed()
    // .pipe(
    //   map((result: any) => {
    //     if (result) {
    //       this.displayedColumns = this.displayedColumns;
    //       // this.dataSource.data = [];
    //     }
    //   })
    // )
    // .subscribe();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }


  public textFacet(column: any) {
    // this.commonService.showSpinner('table');

    let distances = {}, isExist = false;
    this.dataSource.data.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    const value = Object.entries(distances).map((val: any) => {
      return { ...val, include: false }
    })

    // this.items.map(value => {
    //   if (value['head'] && value['head'] === column && value['type'] === column) {
    //     isExist = true;
    //     return;
    //   }
    // })

    // if (isExist === false) {
    // this.items.push({
    //   type: 'facet',
    //   isMinimize: false,
    //   head: column,
    //   content: value
    // });
    this.lpViewer.itemsObservables$.next({
      type: 'facet',
      isMinimize: false,
      head: column,
      content: value
    });
    // }
  }

  public textFilter(column: any) {
    // this.items.push({
    //   type: 'filter',
    //   isMinimize: false,
    //   head: column,
    // });
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

}
