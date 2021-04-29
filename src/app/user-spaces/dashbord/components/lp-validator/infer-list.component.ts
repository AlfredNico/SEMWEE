import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@app/authentification/services/auth.service';
import { SettingRowsTable } from '@app/models/setting-table';
import { Users } from '@app/models/users';
import { SettingTableComponent } from '@app/shared/components/setting-table/setting-table.component';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';
import { CommonService } from '@app/shared/services/common.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { LpValidatorService } from '../../services/lp-validator.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { NotificationService } from '@app/services/notification.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { SemweeDataSource } from '@app/shared/class/semwee-data-source';
import { HttpParams } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-infer-list',
  templateUrl: './infer-list.component.html',
  styles: [
    `
      .datatable:not(.table) {
        display: revert;
      }
      .drag_n_drop {
        cursor: cell !important;
      }

      .Test {
        position: absolute;
        visibility: hidden;
        height: auto;
        width: auto;
        white-space: nowrap; /* Thanks to Herb Caudill comment */
      }
      .active {
        background: #b6e1ff !important;
      }
    ::ng-deep #formTable {
    padding: 0 !important;
    height: 4vh;
    margin: 0 !important;
}

.mat-form-field-appearance-outline .mat-form-field-infix {
  padding: 1em 0 1em 0 !important;
}
    /* ::ng-deep.mat-form-field-appearance-outline .mat-form-field-prefix, .mat-form-field-appearance-outline .mat-form-field-suffix {
        top: .25em; 
        padding: 1.5em 0 .5em;
    }*/
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder],
})
export class InferListComponent
  implements OnInit, AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {
  @Input() data: DataTypes;
  public dataView: DataTypes = {
    displayColumns: [],
    hideColumns: [],
    data: [],
  };
  public displayColumns: string[] = [];

  inferHeigth: number = 0;

  //generate Data , { provide: APP_BASE_HREF, useValue: '' }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  //getUser
  user!: Users;
  //generate form controle dynamics
  public filters = this.fb.group([]);
  public search = new FormControl('');

  // selection toggle
  allSelect: boolean = true;

  //idProduit
  @Input() idProjet: string = '';

  //data after filter
  filterData: any[] = [];
  checklist: string[] = [];
  selectedOptions: string[] = [];
  checked: boolean = true;
  // @Output() uploadFiles = new EventEmitter<any>();
  @Output() dataInferListReady = new EventEmitter<any>();

  // filter icon && and tooltips
  public icon = '';
  public active: any = '';

  // multipleSelect tables
  isKeyPressed: boolean = false;
  selectedRow: any;
  indexSelectedRow: any;
  selectedItem = true;
  selectedRowsArray = [];
  numberSelected: number = 0;

  //resizable
  public mawWidth: number = 0;

  /**
   * subscribe to it and call `next()` to refresh the list in the table.
   * so that we don't have to rewrite the initial subscription for the datasource
   */
  private destroy$ = new Subject<any>();
  private trigger = new BehaviorSubject<any>(null);
  public dataSources = new SemweeDataSource<any>();

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    public dialog: MatDialog,
    private lpValidatorServices: LpValidatorService,
    private auth: AuthService,
    private notifs: NotificationService
  ) {
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnChanges() {
    if (this.data !== undefined) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] }; // initialize dataSources
        this.displayColumns = []; //display columns tables
        this.checklist = []; // initialize setting uptions
        this.selectedOptions = []; // initialize list items selected on options
        this.checked = true;
      }
      
      Object.assign(this.dataView, this.data);
      this.numberSelected = this.dataView.data.length;
      this.displayColumns = this.data.displayColumns;
    }

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: string, index: number) => {
      if (key != 'select') {
        //création formControl Dynamics
        this.filters.addControl(key, new FormControl(''));

        if (!key.includes('Value') && key.includes('Facet')) {
          this.selectedOptions.push(key);
          this.checklist.push(key);
          // if (key.includes('Facet') && !key.includes('Value')) {
          //   this.checklist.push(key);
          // }
        }
      }
    });
    // this.commonServices.hideSpinner();
    // this.commonServices.isLoading$.next(false);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Query search field
    this.filters.valueChanges
      .pipe(
        map((query) => {
          // let httpParams = new HttpParams();
          // Object.entries(query).map((val: any) => {
          //   if (val[1]) {
          //     httpParams = httpParams.append(val[0], val[1]);
          //     // console.log('params', query, '// ', val);
          //   }
          // });
          // console.log('params', query);
          let data = this.dataView.data.filter((item: any) => {
            if (Object.values(query).every((x) => x === null || x === '')) {
              return this.dataView.data;
            } else {
              return Object.keys(item).some((property) => {
                if (
                  query[property] != '' &&
                  typeof item[property] === 'string' &&
                  query[property] !== undefined &&
                  item[property] !== undefined
                ) {
                  let i = 0,
                    s = '';
                  Object.entries(query).map((val) => {
                    if (val[1]) {
                      i++;
                      const lower = (val[1] as any).toLowerCase();
                      if (i == 1) {
                        s =
                          s +
                          `item["${val[0]}"].toString().toLowerCase().includes("${lower}")`;
                      } else {
                        s =
                          s +
                          `&& item["${val[0]}"].toString().toLowerCase().includes("${lower}")`;
                      }
                    }
                  });
                  return eval(s);
                }
              });
            }
          });
          this.dataSource.data = data;
        })
      )
      .subscribe();
    //Search field
    this.search.valueChanges
      .pipe(
        map((query) => {
          this.dataSource.filter = query;
        })
      )
      .subscribe();
  }

  public ngAfterViewChecked(): void {}

  onClick(item: any) {}

  //Deop item list
  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(
      this.displayColumns,
      event.previousIndex,
      event.currentIndex
    );
    this.displayColumns.forEach((column, index) => {
      if (column == 'select') this.dataView.displayColumns[0] = column;
      else this.dataView.displayColumns[index] = column;
      //création formControl Dynamics
      if (column != 'select') {
        this.filters.addControl(column, new FormControl(''));
      }
    });
  }

  tableOpons() {
    this.dialog
      .open(TableOptionsComponent, {
        data: {
          noHiddenRows: this.displayColumns,
          hiddenRows: this.dataView.hideColumns,
        },
        width: '70%',
      })
      .afterClosed()
      .pipe(
        // tap(() => {
        //   this.common.showSpinner('root');
        // }),
        map((result: SettingRowsTable) => {
          if (result) {
            this.displayColumns = result.noHiddenRows;
            this.dataView.displayColumns = result.noHiddenRows;

            result.noHiddenRows?.map(async (item) => {
              //création formControl Dynamics
              if (item != 'select') {
                this.filters.addControl(item, new FormControl(''));
              }
            });
          }
        })
      )
      .subscribe();
  }

  openSettingTable() {
    this.dialog
      .open(SettingTableComponent, {
        data: {
          selectedOptions: this.selectedOptions,
          checklist: this.checklist,
          checked: this.checked
        },
        width: '600px',
      })
      .afterClosed()
      .pipe(
        map((result: any) => {
          this.checklist = result['selected'];
          this.checked = result['checked'];
        })
      )
      .subscribe();
  }

  async tableReady() {
    this.commonServices.isLoading$.next(true);
    this.commonServices.showSpinner('root');
    

    this.dataView.data.forEach((value: any, currentIndex: number) => {
      let object = {};
      let i = 1;
      Object.keys(value).forEach((key: string, index: number) => {
        if (!key.includes('Facet') && !key.includes('Value')) {
          object[key] = value[key];
          this.filterData[currentIndex] = { ...object };
        } else if (
          key.includes('Facet') &&
          !key.includes('Value') &&
          this.checklist.includes(key)
        ) {
          // const keyIndex = this.displayColumns.indexOf(key);
          // object[this.displayColumns[keyIndex]] = value[key];
          // object[this.displayColumns[keyIndex + 1]] = value[`${key}_Value`];
          object[`Facet_${i}`] = value[key];
          object[`Facet_${i}_Value`] = value[`${key}_Value`];
          this.filterData[currentIndex] = { ...object };
          i++;
        }
      });
    });

    try {
      const result = await this.lpValidatorServices.postInferList(
        this.idProjet,
        this.filterData
      );

      if (result && result.data) {
        this.dataInferListReady.emit(result);
      } else {
        this.notifs.warn('Display error');
      }
      this.commonServices.isLoading$.next(false);
      this.commonServices.hideSpinner();
    } catch (error) {
      this.notifs.warn('Display error');
      this.commonServices.isLoading$.next(false);
      this.commonServices.hideSpinner();
      throw error;
    }
  }

  setAll(completed: boolean) {
    this.numberSelected = 0;
    this.allSelect = completed;
    if (this.dataView.data == null) {
      return;
    }
    this.dataView.data.forEach((t) => {
      if(t.select === true ) this.numberSelected++
      t.select = completed
    });
  }

  public selectRow(row: any) {
    const index = this.dataView.data.findIndex((x) => x.ID == row.ID);

    if (this.isKeyPressed == true && this.indexSelectedRow) {
      if (this.indexSelectedRow > index)
        this.dataView.data.forEach((t, i) => {
          if (this.indexSelectedRow >= i && i >= index) {
            this.dataView.data[i] = {
              ...this.dataView.data[i],
              select: this.selectedItem,
            };
            this.selectedRowsArray.push(this.dataView.data[i]);
          }
        });
      else
        this.dataView.data.forEach((t, i) => {
          if (this.indexSelectedRow <= i && i <= index) {
            this.dataView.data[i] = {
              ...this.dataView.data[i],
              select: this.selectedItem,
            };
            this.selectedRowsArray.push(this.dataView.data[i]);
          }
        });
    } else {
      this.selectedRowsArray = [];
      this.dataView.data[index] = {
        ...this.dataView.data[index],
        select: row['select'] == true ? false : true,
      };
      this.selectedRowsArray.push(this.dataView.data[index]);
    }

    this.selectedRow = row;
    this.indexSelectedRow = index;
    this.selectedItem = this.dataView.data[this.indexSelectedRow]['select'];
    this.dataSource.data = this.dataView.data;
    this.numberSelected = 0;
    this.dataView.data.forEach(s => {
      if (s.select === true) {
        this.numberSelected++
      }
    })
  }

  isRowSelected(row: any) {
    if (this.selectedRowsArray.indexOf(row) != -1) {
      return true;
    }
    return false;
  }

  someComplete(): boolean {
    if (this.dataView.data == null) {
      return false;
    }
    return (
      this.dataView.data.filter((t) => t.select).length > 0 && !this.allSelect
    );
  }

  updateAllComplete() {
    this.allSelect =
      this.dataView.data != null && this.dataView.data.every((t) => t.select);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.isKeyPressed = false;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 17 || event.keyCode === 16 || event.ctrlKey) this.isKeyPressed = true;
    else this.isKeyPressed = false;
  }

  // @HostListener('keydown.shift.control', ['$event']) onKeyDown(event: any) {
  //   console.log('handeol');
  // }

  // @HostListener('keydown', ['$event']) onKeyDown(e) {
  //   if (e.shiftKey && e.keyCode == 9) {
  //     console.log('shift and tab');
  //   }
  //   console.log('key', e.keyCode);
  // }

  ngOnDestroy() {
    this.dataView = { displayColumns: ['select'], hideColumns: [], data: [] };
    this.dataSource.data = [];
  }

  public isColumnDisplay(column: any): boolean {
    switch (true) {
      case column.toLowerCase().includes('_id'):
        return true;

      default:
        return false;
    }
  }

  sortData($e: any) {
    $e.direction === 'asc'
      ? (this.icon = 'asc')
      : $e.direction === 'desc'
      ? (this.icon = 'desc')
      : (this.icon = '');
    this.active = $e.active;
  }

  // hideTooltip(event: number) {
  //   if (!this.rowIndex.includes(event)) this.rowIndex.push(event);
  // }

  public getWidth(id: any) {
  console.log('cokes', id)
    this.mawWidth = 0;

    for (let index = 0; index < this.dataView.data.length; index++) {
      const elem = document.getElementById(`${id}infer${index}`);
      if (elem && this.mawWidth < elem?.offsetWidth)
        this.mawWidth = elem.offsetWidth;
    }
  }

  public isNumberOrString(itemValue: any) {
    if (typeof itemValue === 'number' || Number(itemValue)) return true;
    else return false;
  }

  public isValidURL(value: any, colum: string): boolean {
    if (colum === 'ID' || colum === 'idcsv') {
      const res = value.match(
        /(http(s)?:\/\/.)?([A-z]\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    }
    return false;
  }

  onPaginateChange(event) {
    console.log('Current page index: ' + JSON.stringify(event));
  }

  public clearInput(column: any) {
    this.filters.controls[column].reset('');
  }

  transformURL(url: string): string{
    console.log('rul', url)
    return url.toString()
  }
}

// onResizeEnd(event: ResizeEvent, columnName): void {
//   if (event.edges.right) {
//     const cssValue = event.rectangle.width + 'px';
//     const columnElts = document.getElementsByClassName(
//       'mat-column-' + columnName
//     );
//     for (let i = 0; i < columnElts.length; i++) {
//       const currentEl = columnElts[i] as HTMLDivElement;
//       currentEl.style.width = cssValue;
//     }
//   }
// }sle