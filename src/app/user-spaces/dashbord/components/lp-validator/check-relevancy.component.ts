import { IdbService } from './../../../../services/idb.service';
import { PropertyValueService } from './../../services/property-value.service';
import { ItemTypeService } from './../../services/item-type.service';
import { NotificationService } from '@app/services/notification.service';
import { Projects } from './../../interfaces/projects';
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
      .mat-button, .mat-icon-button, .mat-stroked-button, .mat-flat-button {min-width: auto;}

      .mat-form-field-appearance-outline .mat-form-field-infix {
  padding: 1em 0 1em 0 !important;
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

  // filter icon && and tooltips
  public icon = '';
  public active: any = '';

  //idProduit
  @Input() idProjet: string = '';

  // multipleSelect tables
  isKeyPressed: boolean = false;
  selectedRow: any;
  indexSelectedRow: any;
  selectedItem = true;
  selectedRowsArray = [];
  countRevelancy: number = 0;

  //resizable
  mawWidth: number = 0;

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    public dialog: MatDialog,
    private itemService: ItemTypeService,
    private propertyService: PropertyValueService,
    private notifs: NotificationService,
    private idb: IdbService
  ) { }

  ngOnChanges() {
    if (this.dataInferList !== undefined) {
      if (this.dataView.data.length > 0) {
        this.commonServices.showSpinner('root');
        this.dataView = { displayColumns: [], hideColumns: [], data: [] };
        this.displayColumns = [];
      }
      Object.assign(this.dataView, this.dataInferList);
      this.countRevelancy = this.dataInferList.data.length;
      this.displayColumns = this.dataInferList.displayColumns;
    }

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: any, index: number) => {
      if (key != 'select') this.filters.addControl(key, new FormControl(''));
      //création formControl Dynamics
      // this.displayColumns.push(key);
    });
    this.commonServices.hideSpinner();
    // this.commonServices.isLoading$.next(false);
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    //Query search field
    this.filters.valueChanges
      .pipe(
        map((query) => {
          this.dataSource.data = this.dataView.data.filter((item: any) => {
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

          this.counterSelected();
        })
      )
      .subscribe();

    //Search field
    this.search.valueChanges
      .pipe(
        map((query) => {
          this.counterSelected();
          this.dataSource.filter = query;
        })
      )
      .subscribe();

  }

  public ngAfterViewChecked(): void { }

  onClick(item: any) { }

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

  setAllRelevency(completed: boolean) {
    this.selectedRowsArray = [];
    this.allSelect = completed;
    if (this.dataSource.data == null) {
      return;
    }
    this.dataSource.data.forEach((t: any) => {
      const _id = this.dataView.data.findIndex((x: any) => x._id == t._id);
      this.dataView.data[_id] = { ...t, select: this.selectedItem };

      t.select = completed
    });

    if (completed === true)
      this.countRevelancy = this.dataSource.data.length
    else
      this.countRevelancy = 0;

    this.dataView.data = this.dataView.data;
    this.dataSource.data = this.dataSource.data;

    this.idb.updateItems('checkRevelancy', this.dataView.data, this.idProjet);
  }

  public selectRowRelevency(row: any) {
    const index = this.dataSource.data.findIndex((x) => x._id == row._id);

    if (this.isKeyPressed == true && this.indexSelectedRow) {

      if (this.indexSelectedRow > index) {
        this.dataSource.data.forEach((t: any, i: number) => {

          if (this.indexSelectedRow >= i && index <= i) {
            this.dataSource.data[i] = { ...t, select: this.selectedItem };
            const _id = this.dataView.data.findIndex((x: any) => x._id == t._id);
            this.dataView.data[_id] = { ...t, select: this.selectedItem };
            this.selectedRowsArray.push(this.dataSource.data[i]['_id']);
          }
        });
      }
      else {
        this.dataSource.data.forEach((t: any, i: number) => {
          if (index >= i && this.indexSelectedRow <= i) {
            this.dataSource.data[i] = { ...t, select: this.selectedItem };
            const _id = this.dataView.data.findIndex((x: any) => x._id == t._id);
            this.dataView.data[_id] = { ...t, select: this.selectedItem };
            this.selectedRowsArray.push(this.dataSource.data[i]['_id']);
          }
        });
      }
    } else {
      this.selectedRowsArray = [];
      this.dataSource.data[index] = {
        ...this.dataSource.data[index],
        select: row['select'] == true ? false : true,
      };
      const _id = this.dataView.data.findIndex((x: any) => x._id == row._id);
      this.dataView.data[_id] = {
        ...this.dataSource.data[index],
        select: row['select'] == true ? false : true,
      };
      this.selectedRowsArray.push(this.dataSource.data[index]['_id']);
    }

    this.dataSource.data = this.dataSource.data;
    this.dataView.data = this.dataView.data;

    this.selectedRow = row;
    this.indexSelectedRow = this.indexSelectedRow ? this.indexSelectedRow : index;
    this.selectedItem = this.dataSource.data[this.indexSelectedRow]['select'];
    this.indexSelectedRow = index;
    this.countRevelancy = 0;
    //save data into indexDB
    this.counterSelected();
    this.idb.updateItems('checkRevelancy', this.dataView.data, this.idProjet);


  }
  private counterSelected(): void {
    this.countRevelancy = 0;
    this.dataSource.data.forEach(s => {
      if (s.select === true) {
        this.countRevelancy++
      }
    })
  }

  isRowSelected(row: any) {
    if (this.selectedRowsArray.indexOf(row['_id']) != -1) {
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
    this.isKeyPressed = false
  }

  @HostListener('window:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 17 || event.keyCode === 16 || event.ctrlKey) {
      this.isKeyPressed = true
    }
  }

  dataMachingReady() {
    const value: DataTypes = {
      displayColumns: this.dataView.displayColumns,
      hideColumns: this.dataView.hideColumns,
      data: this.dataSource.data,
    }
    this.dataMatching.emit(value);
    // this.dataMatching.emit(this.dataView);
  }

  async openTuneIt(id: string, row: Projects, event: any, itemSeleted: string) {
    this.commonServices.showSpinner('root');
    const el: HTMLElement = document.getElementById(id);
    // let pos: number = el.offsetTop;
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;
    const postLeft: number = offsetLeft + offsetWidth;
    const { clientX, clientY } = event;
    let indexRow: any[] = [];

    this.dataView.data.forEach((element, index) => {
      if (
        (element[itemSeleted.match(/Item[^]*Type$/)?.toString()] ||
          element['_1st_Property'] ||
          element['_2st_Property'] ||
          element['_3st_Property'] ||
          element['_4st_Property'] ||
          element['_5st_Property']) === row[itemSeleted]
      ) {
        indexRow.push(index);
      }
    });

    let val: any = '';
    // const index = this.dataView.data.findIndex((x) => x._id === row._id);

    try {
      if (this.toLowerCase(itemSeleted).match(/item[^]*type$/))
        val = await this.itemService.getItemType(row['_id']);
      else
        val = await this.propertyService.getPropertyValue(
          row['_id'],
          itemSeleted
        );

      this.commonServices.hideSpinner();
      this.dialog
        .open(TuneItComponent, {
          // position: { top: `${clientY}px`, left: `${clientX}px` },
          // width: itemSeleted == 'itemtype' ? '400px' : '',,
          data: { row, itemSeleted, checkTuneIt: val },
        })
        .afterClosed()
        .pipe(
          map((result: any) => {
            if (result) {
              indexRow.forEach((index) => {
                const data = this.dataView.data[index];
                const val = (data[itemSeleted] = result['Editspelling']);
                const newVla = {
                  ...data,
                  val,
                };

                this.dataView.data[index] = newVla;
              });

              this.idb.addItems(
                'checkRevelancy',
                this.dataView.data,
                this.idProjet
              );
            }
          })
        )
        .subscribe();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw error;
      }
      this.notifs.warn('Server error !');
      this.commonServices.hideSpinner();
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

  public isColumnDisplay(column: any): boolean {
    switch (true) {
      case this.toLowerCase(column) == '_id':
      // case this.toLowerCase(column) == 'id':
      case this.toLowerCase(column) == 'idproduct':
      case this.toLowerCase(column) == '__v':
      case this.toLowerCase(column) == 'select':
        // case this.toLowerCase(column) == 'ID':
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
      this.toLowerCase(column).match(/item[^]*type$/) ||
      (this.toLowerCase(column).match(/property$/) && value)
    )
      return true;
    else return false;
  }

  // hideTooltip(event: number) {
  //   if (!this.rowIndex.includes(event)) this.rowIndex.push(event);
  // }

  public getWidth(id: any) {
    this.mawWidth = 0;

    for (let index = 0; index < this.dataView.data.length; index++) {
      const elem = document.getElementById(`${id}revelancy${index}`);
      if (elem && this.mawWidth <= elem?.offsetWidth)
        this.mawWidth = elem.offsetWidth;
    }
  }

  public isNumberOrString(itemValue: any): boolean {
    if (typeof itemValue === 'number' || Number(itemValue)) return true;
    else return false;
  }

  public clearInput(column: any): void {
    this.filters.controls[column].reset('');
  }
}
