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
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FormBuilder } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { getCustomPaginatorIntl } from './custom-paginator.component';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getCustomPaginatorIntl() }
  ]
})
export class ViwerReadImportComponent
  implements OnInit, AfterViewInit, OnChanges {

  displayedColumns: string[] = [];
  edidtableColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('idProject') idProject = undefined;
  @Input('filtersData') filtersData: {
    items: any;
    facetQueries: any;
    searchQueries: any;
  } = undefined;
  @Input('dataAfterUploaded') dataAfterUploaded: any = undefined;
  @Input('inputFilters') inputFilters: any = undefined;

  public tabIndex = 0;

  // filter icon && and tooltips
  public icon = '';
  public active: any = '';

  public undoRedoLabel = 'Undo/Redo 0/0';
  public dataViews: any[] = [];
  // public formGroup = new FormGroup({});
  public formGroup = this.fb.group({});

  public items: any[] = [];
   private isFiltered: boolean = false;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    // private lpViewer: LpViwersService,
    public senitizer: DomSanitizer,
    private readonly lpviLped: LpdLpdService,
  ) { }

  ngOnChanges(): void {
     if (this.dataAfterUploaded != undefined) {
      if (Object.keys(this.dataAfterUploaded).length === 4) {
        this.displayedColumns = this.dataAfterUploaded['headerOrigin'];
        this.dataViews = this.dataAfterUploaded['data'];

        Object.values(this.lpviLped.permaLink).map(x => {
          if (Array.isArray(x) === true)
            if ((x as any[]).length != 0 )
              this.isFiltered = true;
          else if (Object.keys(x).length !== 0)
            this.isFiltered = true;
        });

        if(this.isFiltered == true)
          this.dataSource.data = this.lpviLped.permaLink['data'];
        else this.dataSource.data = this.dataViews;

      } else if (Object.keys(this.dataAfterUploaded).length === 2){
        this.displayedColumns = this.dataAfterUploaded['header'];
        this.dataSource.data = this.dataViews = this.dataAfterUploaded['content'];
      }
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.lpviLped.dataSources$.subscribe(data => {
      if (data)
        this.dataSource.data = data;
    })
  }

  // public openTablesOptionns() {
  //   this.dialog
  //     .open(HeaderOptionsComponent, {
  //       data: {
  //         // noHiddenRows: this.displayColumns,
  //         noHiddenRows: this.displayedColumns,
  //         hiddenRows: [],
  //       },
  //       width: '70%',
  //     })
  //     .afterClosed()
  //     .pipe(
  //       map((result: any) => {
  //         if (result) {
  //           this.displayedColumns = result.noHiddenRows;
  //           this.lpViewer.putDisplayColums(
  //             this.idProject,
  //             JSON.stringify(this.displayedColumns)
  //           );
  //         }
  //       })
  //     )
  //     .subscribe();
  // }

  public openEditColumn(columnName: string) {
    const index = this.displayedColumns.indexOf(columnName);
    this.dialog
      .open(UpdatesHeaderComponent, {
        data: {
          index,
          idHeader: this.dataAfterUploaded[0][0]['_id'],
          edidtableColumns: this.edidtableColumns,
        },
      })
      .afterClosed();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }

  // --------------------------------------------------------------------------- //
  sortData($e: any) {
    $e.direction === 'asc'
      ? (this.icon = 'asc')
      : $e.direction === 'desc'
        ? (this.icon = 'desc')
        : (this.icon = '');
    this.active = $e.active;
  }
  // --------------------------------------------------------------------------- //

  // public textFacet(column: any) {
  //   let distances = {};
  //   // isExist = false;
  //   this.dataViews.map((item: any) => {
  //     distances[item[column]] = (distances[item[column]] || 0) + 1;
  //   });

  //   const value = Object.entries(distances).map((val: any) => {
  //     return { ...val, include: false };
  //   });

  //   this.lpViewer.itemsObservables$.next({
  //     type: 'facet',
  //     isMinimize: false,
  //     head: column,
  //     content: value,
  //   });
  //   // }
  // }

  // public textFilter(column: any) {
  //   this.lpViewer.itemsObservables$.next({
  //     type: 'filter',
  //     isMinimize: false,
  //     head: column,
  //   });
  // }

  // public numericFacter(column: any) {
  //   let value = {};
  //   let minValue = 100000, maxValue = 0;
  //   this.dataViews.map((item: any) => {
  //     if (Number.isInteger(Number(item[column])) === true) {
  //       if (Number(item[column]) >= maxValue) maxValue = item[column]
  //       if (Number(item[column]) <= minValue) minValue = item[column];
  //     }
  //   });
  //   const options: Options = {
  //     floor: minValue,
  //     ceil: maxValue,
  //     hidePointerLabels: true,
  //     hideLimitLabels: true,
  //     draggableRange: true,
  //     showSelectionBar: true,
  //   };


  //   this.lpViewer.itemsObservables$.next({
  //     type: 'numeric',
  //     isMinimize: false,
  //     head: column,
  //     minValue: minValue,
  //     maxValue: maxValue,
  //     options: options
  //   });
  // }

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

  public isValidURL(value: any): boolean {
    const res = value.match(
      /(http(s)?:\/\/.)?([A-z]\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );

    if (res !== null) return true;
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
    csvOptions.headers = this.displayedColumns; // ity lay ao @ front actuellement
    new AngularCsv(tabnewObject, 'HolidayList', csvOptions);
  }

  // private checkFilter(val: any[]): any[] {
  //   if (this.filtersData !== undefined) {
  //     const length1 = this.filtersData['facetQueries']?.length;
  //     const length2 = this.filtersData['searchQueries']?.length;

  //     const dataFilter = val.filter((x: any, i: number) => {
  //       switch (true) {
  //         case length1 > 0 && length2 > 0:
  //           return (
  //             this.filtersData['facetQueries'][i] &&
  //             this.filtersData['searchQueries'][i]
  //           );

  //         case length1 === 0 && length2 > 0:
  //           return this.filtersData['searchQueries'][i];

  //         case length1 > 0 && length2 === 0:
  //           return this.filtersData['facetQueries'][i];

  //         case length1 === 0 && length2 === 0:
  //           return true;
  //       }
  //     });
  //     return dataFilter;
  //   } else return val;
  // }

  public openButton() {
    console.log('open button');
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

  public searchFacet(column: any) {
    let distances = {}, isExist = false;
    this.dataViews.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    const value = Object.entries(distances).map((val: any) => {
      return { ...val, include: false };
    });

    this.lpviLped.itemsObservables$.next({
      type: 'search',
      isMinimize: false,
      head: column,
      content: value
    });
  }

  public inputFilter(column: any) {
    this.lpviLped.itemsObservables$.next({
      type: 'input',
      isMinimize: false,
      head: column,
      value: ''
    });
  }

  public numericFacter(column: any) {
    let minValue = 100000, maxValue = 0;
    this.dataViews.map((item: any) => {
      if (Number.isInteger(Number(item[column])) === true) {
        if (Number(item[column]) >= maxValue) maxValue = Number(item[column])
        if (Number(item[column]) <= minValue) minValue = Number(item[column]);
      }
    });
    const options: Options = {
      floor: minValue,
      ceil: maxValue,
      hidePointerLabels: true,
      hideLimitLabels: true,
      draggableRange: true,
      showSelectionBar: true,
    };


    this.lpviLped.itemsObservables$.next({
      type: 'numeric',
      isMinimize: false,
      head: column,
      minValue: minValue,
      maxValue: maxValue,
      options: options
    });
  }
}
