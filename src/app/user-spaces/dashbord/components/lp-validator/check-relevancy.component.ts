import { NotificationService } from '@app/services/notification.service';
import { Projects } from './../../interfaces/projects';
import { TuneItService } from './../../services/tune-it.service';
import { TuneIt, TuneItVlaue } from './../../interfaces/tune-it';
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
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingRowsTable } from '@app/models/setting-table';
import { SettingTableComponent } from '@app/shared/components/setting-table/setting-table.component';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';
import { CommonService } from '@app/shared/services/common.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { map } from 'rxjs/operators';
import { TuneItComponent } from './dialog/tune-it.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-check-relevancy',
  templateUrl: './check-relevancy.component.html',
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
export class CheckRelevancyComponent
  implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  @Input() dataInferList: DataTypes;
  public dataView: {
    displayColumns: string[];
    hideColumns: string[];
    data: any[];
  } = { displayColumns: [], hideColumns: [], data: [] };
  public displayColumns: string[] = [];

  //generate Data
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @Output() next = new EventEmitter<void>();

  @Output() dataMatching = new EventEmitter<any>();

  //generate form controle dynamics
  public filters = this.fb.group([]);
  public search = new FormControl('');

  // selection toggle
  allSelect: boolean = true;

  //data after filter
  filterData: any[] = [];
  checklist: string[] = [];

  //Tune it property
  checkTuneItValue: TuneIt<TuneItVlaue>;

  rowIndex: number[] = []; // disable matTooltips

  // multipleSelect tables
  isKeyPressed: boolean = false;
  selectedRow: any;
  indexSelectedRow: any;
  selectedItem = true;
  selectedRowsArray = [];

  //resizable
  mawWidth: number = 0;

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    public dialog: MatDialog,
    private tuneItService: TuneItService,
    private notifs: NotificationService
  ) {}

  ngOnChanges() {
    this.commonServices.showSpinner();

    if (this.dataInferList !== undefined) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] };
        this.displayColumns = [];
        this.rowIndex = [];
        // this.dataView.displayColumns = [];
      }
      Object.assign(this.dataView, this.dataInferList);
    }

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: any, index: number) => {
      //création formControl Dynamics
      this.displayColumns.push(key);
      this.filters.addControl(key, new FormControl(''));
    });
    this.commonServices.hideSpinner();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    //Query search field
    this.filters.valueChanges
      .pipe(
        map((query) => {
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
  public drop(event: CdkDragDrop<string[]>) {
    const previousIndex = event.previousIndex - 3;
    const currentIndex = event.currentIndex - 3;
    moveItemInArray(this.displayColumns, previousIndex, currentIndex);

    this.displayColumns.forEach((column, index) => {
      this.dataView.displayColumns[index] = column;
      //création formControl Dynamics
      this.filters.addControl(column, new FormControl(''));
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
              this.filters.addControl(item, new FormControl(''));
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
          facetLists: this.displayColumns,
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

  setAll(completed: boolean) {
    this.allSelect = completed;
    if (this.dataView.data == null) {
      return;
    }
    this.dataView.data.forEach((t) => (t.select = completed));
  }

  public selectRow(row: any) {
    const index = this.dataView.data.findIndex((x) => x._id === row._id);

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

  dataMachingReady() {
    this.dataMatching.emit(this.dataView);
  }

  async openTuneIt(id: string, row: Projects, event: any, itemSeleted: any) {
    this.commonServices.showSpinner('root');
    const el: HTMLElement = document.getElementById(id);
    // let pos: number = el.offsetTop;
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;
    const postLeft: number = offsetLeft + offsetWidth;
    const { clientX, clientY } = event;

    try {
      const editTuneIt = await this.tuneItService.getTuneIt(row['_id']);
      this.commonServices.hideSpinner();
      this.dialog.open(TuneItComponent, {
        // position: { top: `${clientY}px`, left: `${clientX}px` },
        // width: itemSeleted == 'itemtype' ? '400px' : '',,
        data: { row, itemSeleted, checkTuneIt: editTuneIt },
      });
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw error;
      }
      this.notifs.warn('Server error !');
      this.commonServices.hideSpinner();
    }
  }

  public isColumnDisplay(column: any): boolean {
    switch (true) {
      case this.toLowerCase(column) == '_id':
      case this.toLowerCase(column) == 'id':
      case this.toLowerCase(column) == 'idproduct':
      case this.toLowerCase(column) == '__v':
      case this.toLowerCase(column) == 'select':
      case this.toLowerCase(column) == 'ID':
        return true;
      default:
        return false;
    }
  }
  public toLowerCase(item: string): string {
    return item.toLowerCase();
  }
  isPopTuneIt(column: string, value: string): boolean {
    if (
      this.toLowerCase(column).includes('itemtype') ||
      (this.toLowerCase(column).includes('value') && value)
    )
      return true;
    else return false;
  }

  hideTooltip(event: number) {
    if (!this.rowIndex.includes(event)) this.rowIndex.push(event);
  }

  public getWidth(id: any) {
    this.mawWidth = 0;

    for (let index = 0; index < this.dataView.data.length; index++) {
      const elem = document.getElementById(`${id}${index}`);
      if (elem && this.mawWidth < elem.offsetWidth)
        this.mawWidth = elem.offsetWidth;
    }
  }

  public isNumberOrString(itemValue: any) {
    if (parseInt(itemValue)) return true;
    else return false;
  }
}
