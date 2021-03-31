import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { SettingRowsTable } from '@app/models/setting-table';
import { Users } from '@app/models/users';
import { SettingTableComponent } from '@app/shared/components/setting-table/setting-table.component';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';
import { CommonService } from '@app/shared/services/common.service';
import { map } from 'rxjs/operators';
import { LpValidatorService } from '../../services/lp-validator.service';
import {
  ResizeEvent
} from 'angular-resizable-element';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-infer-list',
  templateUrl: './infer-list.component.html',
  styles: [`
    .datatable:not(.table) {
      display: revert;
    }
    .drag_n_drop {
      cursor: move;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder] // <-- THIS PART
})
export class InferListComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {

  @Input() data: DataTypes;
  public dataView: DataTypes = { displayColumns: [], hideColumns: [], data: [] };
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

  constructor(private fb: FormBuilder, private commonServices: CommonService, public dialog: MatDialog, private lpValidatorServices: LpValidatorService, private auth: AuthService, private notifs: NotificationService) {
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnChanges() {

    this.commonServices.showSpinner('root');
    if (this.data !== undefined) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] };
        this.displayColumns = [];
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

      if (!key.includes('Value') && !key.includes('select') && key.includes('Facet')) {
        this.selectedOptions.push(key);
        if (this.checklist.length < 5 && key.includes('Facet') && !key.includes('Value')) {
          this.checklist.push(key);
        }
      }
    })
    this.commonServices.hideSpinner();

    // this.dataView.displayColumns.forEach((item: string, index: number) => {
    //   if (index < 14 && item.includes('Facet') && !item.includes('Value')) {
    //     this.checklist.push(item);
    //   }
    // });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //Query search field
    this.filters.valueChanges.pipe(
      map(query => {
        let data = this.dataView.data.filter((item: any) => {
          if (Object.values(query).every(x => (x === null || x === ''))) {
            return this.dataView.data;
          } else {
            return Object.keys(item).some(property => {
              if (query[property] != "" && typeof item[property] === 'string' && (query[property] !== undefined && item[property] !== undefined)) {
                return item[property].toLowerCase().includes(query[property].toLowerCase())
              }
            }
            )
          }
        }
        );
        this.dataSource.data = data;
      })
    ).subscribe();

    //Search field
    this.search.valueChanges.pipe(
      map(query => {
        this.dataSource.filter = query;
      })
    ).subscribe();
  }

  public ngAfterViewChecked(): void { }

  onClick(item: any) {
  }

  //Deop item list
  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.displayColumns, event.previousIndex, event.currentIndex);
    this.displayColumns.forEach((column, index) => {
      this.dataView.displayColumns[index] = column;
      //création formControl Dynamics
      if (column != 'select') {
        this.filters.addControl(column, new FormControl(''));
      }
    });
  }

  tableOpons() {
    this.dialog.open(TableOptionsComponent, {
      data: {
        noHiddenRows: this.displayColumns,
        hiddenRows: this.dataView.hideColumns
      },
      width: '70%',
    }).afterClosed().pipe(
      // tap(() => {
      //   this.common.showSpinner('root');
      // }),
      map((result: SettingRowsTable) => {
        if (result) {
          this.displayColumns = result.noHiddenRows;
          this.dataView.displayColumns = result.noHiddenRows;

          result.noHiddenRows?.map(async item => {
            //création formControl Dynamics
            if (item != 'select') {
              this.filters.addControl(item, new FormControl(''));
            }
          });
        }
      }),
    ).subscribe();
  }

  openSettingTable() {
    this.dialog.open(SettingTableComponent, {
      data: {
        selectedOptions: this.selectedOptions,
        checklist: this.checklist,
      },
      width: '600px',
    }).afterClosed().pipe(
      map((result: string[]) => {
        this.checklist = result;
      })
    ).subscribe();
  }

  async tableReady() {
    this.commonServices.isLoading$.next(true);
    this.commonServices.showSpinner('root');

    const header = ['select', "ID", 'Category', 'Subcategory', 'Subcategory_2', 'Facet_1', 'Facet_1_Value', 'Facet_2', 'Facet_2_Value', 'Facet_3', 'Facet_3_Value', 'Facet_4', 'Facet_4_Value', 'Facet_5', 'Facet_5_Value'];

    let tabIndex = 0;

    this.dataView.data.forEach((value: any, currentIndex: number) => {
      let i = 5;
      let object: any = { 'select': '', 'ID': '', 'Category': '', 'Subcategory': '', 'Subcategory_2': '', 'Facet_1': '', 'Facet_1_Value': '', 'Facet_2': '', 'Facet_2_Value': '', 'Facet_3': '', 'Facet_3_Value': '', 'Facet_4': '', 'Facet_4_Value': '', 'Facet_5': '', 'Facet_5_Value': '', 'email': this.user.email };

      Object.keys(value).forEach((key: string, index: number) => {
        if (value['select'] === true) {
          if (!key.includes('Facet') && !key.includes('Value')) {
            // object[header[i]] = value[key];
            object[key] = value[key];
            this.filterData[tabIndex] = { ...object };

          } else if (key.includes('Facet') && !key.includes('Value') && this.checklist.includes(key)) {
            const keyIndex = header.indexOf(key);
            object[header[i]] = value[key];
            i++;
            object[header[i]] = value[`${key}_Value`];
            this.filterData[tabIndex] = { ...object };
            i++;
          }
        }
      })

      if (value['select'] === true) {
        tabIndex++;
      }
    })


    try {
      const result = await this.lpValidatorServices.postInferList(this.filterData);

      if (result && result.data) {
        this.dataInferListReady.emit(result);
      }
      this.notifs.warn('Server is not responding');
      this.commonServices.isLoading$.next(false);
      this.commonServices.hideSpinner();
      // console.log(this.filterData);
    } catch (error) {
      // console.log(this.filterData);
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
    this.dataView.data.forEach(t => t.select = completed);
  }

  public selectRow(row: any) {
    // let data, indexData;
    // this.allSelect = this.dataView.data.includes(t => t.select === false);
    let index = this.dataView.data.findIndex(x => x.ID == row.ID);
    this.dataView.data[index] = { ...row, 'select': row['select'] == true ? false : true };

    this.dataSource.data = this.dataView.data;
  }

  someComplete(): boolean {
    if (this.dataView.data == null) {
      return false;
    }
    return this.dataView.data.filter(t => t.select).length > 0 && !this.allSelect;
  }

  updateAllComplete() {
    this.allSelect = this.dataView.data != null && this.dataView.data.every(t => t.select);
  }

  ngOnDestroy() {
    this.dataView = { displayColumns: ['select'], hideColumns: [], data: [] };
    this.dataSource.data = [];
  }



  onResizeEnd(event: ResizeEvent, columnName): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName('mat-column-' + columnName);
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }

}
