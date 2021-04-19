import { query } from '@angular/animations';
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

@Component({
  selector: 'app-infer-list',
  templateUrl: './infer-list.component.html',
  styles: [
    `
      .datatable:not(.table) {
        display: revert;
      }
      .drag_n_drop {
        cursor: move !important;
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder], // <-- THIS PART
})
export class InferListComponent
  implements OnInit, AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {
  @Input() data: DataTypes;
  public dataView: DataTypes = {
    displayColumns: [],
    hideColumns: [],
    data: [],
  };
  public displayColumns: string[] = ['select'];

  //generate Data
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

  //data after filter
  filterData: any[] = [];
  checklist: string[] = [];
  selectedOptions: string[] = [];
  // @Output() uploadFiles = new EventEmitter<any>();
  @Output() dataInferListReady = new EventEmitter<any>();

  // filter icon && and tooltips
  public icon = '';
  public active: any = '';

  rowIndex: number[] = [];

  // multipleSelect tables
  isKeyPressed: boolean = false;
  selectedRow: any;
  indexSelectedRow: any;
  selectedItem = true;
  selectedRowsArray = [];

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
    this.commonServices.showSpinner('root');
    if (this.data !== undefined) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] }; // initialize dataSources
        this.displayColumns = ['select']; //display columns tables
        this.checklist = []; // initialize setting uptions
        this.selectedOptions = []; // initialize list items selected on options
        this.rowIndex = [];
      }
      Object.assign(this.dataView, this.data);
    }

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: string, index: number) => {
      if (key != 'select') {
        //création formControl Dynamics
        this.displayColumns.push(key);
        this.filters.addControl(key, new FormControl(''));
      }

      if (
        !key.includes('Value') &&
        !key.includes('select') &&
        key.includes('Facet')
      ) {
        this.selectedOptions.push(key);
        if (
          this.checklist.length < 5 &&
          key.includes('Facet') &&
          !key.includes('Value')
        ) {
          this.checklist.push(key);
        }
      }
    });
    this.commonServices.hideSpinner();
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
                          `item["${val[0]}"].toLowerCase().includes("${lower}")`;
                      } else {
                        s =
                          s +
                          `&& item["${val[0]}"].toLowerCase().includes("${lower}")`;
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
        },
        width: '600px',
      })
      .afterClosed()
      .pipe(
        map((result: string[]) => {
          this.checklist = result;
        })
      )
      .subscribe();
  }

  async tableReady() {
    this.commonServices.isLoading$.next(true);
    this.commonServices.showSpinner('root');

    const header = [
      'select',
      'ID',
      'category',
      'subcategory',
      'subcategory_2',
      'Facet_1',
      'Facet_1_Value',
      'Facet_2',
      'Facet_2_Value',
      'Facet_3',
      'Facet_3_Value',
      'Facet_4',
      'Facet_4_Value',
      'Facet_5',
      'Facet_5_Value',
    ];

    let tabIndex = 0;

    this.dataView.data.forEach((value: any, currentIndex: number) => {
      let i = 5;
      let object: any = {
        select: '',
        ID: '',
        Category: '',
        Subcategory: '',
        Subcategory_2: '',
        Facet_1: '',
        Facet_1_Value: '',
        Facet_2: '',
        Facet_2_Value: '',
        Facet_3: '',
        Facet_3_Value: '',
        Facet_4: '',
        Facet_4_Value: '',
        Facet_5: '',
        Facet_5_Value: '',
        email: this.user.email,
      };

      Object.keys(value).forEach((key: string, index: number) => {
        // if (value['select'] === true) {
        if (!key.includes('Facet') && !key.includes('Value')) {
          // object[header[i]] = value[key];
          object[key] = value[key];
          this.filterData[currentIndex] = { ...object };
        } else if (
          key.includes('Facet') &&
          !key.includes('Value') &&
          this.checklist.includes(key)
        ) {
          const keyIndex = header.indexOf(key);
          object[header[i]] = value[key];
          i++;
          object[header[i]] = value[`${key}_Value`];
          this.filterData[currentIndex] = { ...object };
          i++;
        }
        // }
      });

      // if (value['select'] === true) {
      //   tabIndex++;
      // }
      // tabIndex++;
    });

    try {
      const result = await this.lpValidatorServices.postInferList(
        this.filterData
      );

      if (result && result.data) {
        this.dataInferListReady.emit(result);
      } else {
        this.notifs.warn('Server is not responding');
      }
      this.commonServices.isLoading$.next(false);
      this.commonServices.hideSpinner();
    } catch (error) {
      this.commonServices.isLoading$.next(false);
      this.commonServices.hideSpinner();
      throw error;
    }
  }

  setAll(completed: boolean) {
    this.allSelect = completed;
    if (this.dataView.data == null) {
      return;
    }
    this.dataView.data.forEach((t) => (t.select = completed));
  }

  public selectRow(row: any) {
    let index = this.dataView.data.findIndex((x) => x.ID == row.ID);

    if (this.isKeyPressed == true && this.indexSelectedRow) {
      if (this.indexSelectedRow > index)
        this.dataView.data.forEach((t, i) => {
          if (this.indexSelectedRow >= i && i >= index) {
            this.selectedRowsArray.push(this.dataView.data[i]);
            return (t.select = this.selectedItem);
          }
        });
      else
        this.dataView.data.forEach((t, i) => {
          if (this.indexSelectedRow <= i && i <= index) {
            this.selectedRowsArray.push(this.dataView.data[i]);
            return (t.select = this.selectedItem);
          }
        });
    } else {
      this.selectedRowsArray = [];
      this.dataView.data[index] = {
        ...row,
        select: row['select'] == true ? false : true,
      };
      this.selectedRowsArray.push(this.dataView.data[index]);
    }

    this.selectedRow = row;
    this.indexSelectedRow = index;
    this.selectedItem = this.dataView.data[this.indexSelectedRow]['select'];
    this.dataSource.data = this.dataView.data;
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
    if (event.keyCode === 17 || event.ctrlKey) this.isKeyPressed = true;
    else this.isKeyPressed = false;
  }

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

  hideTooltip(event: number) {
    if (!this.rowIndex.includes(event)) this.rowIndex.push(event);
  }

  public getWidth(id: any) {
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

  public isValidURL(colum: string): boolean {
    if (colum === 'ID') {
      const res = colum.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    }
    return false;
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
// }
