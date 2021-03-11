import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingRowsTable } from '@app/models/setting-table';
import { SettingTableComponent } from '@app/shared/components/setting-table/setting-table.component';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';
import { CommonService } from '@app/shared/services/common.service';
import { map } from 'rxjs/operators';
import { LpValidatorService } from '../../services/lp-validator.service';

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

    .table-container {
      position: relative;
      max-height: 500px;
      overflow-x: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder] // <-- THIS PART
})
export class InferListComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {

  @Input() data: any[] = [];
  public dataView: { displayColumns: string[], hideColumns: string[], data: any[] } = { displayColumns: ['select'], hideColumns: [], data: [] };
  public displayColumns: string[] = ['select'];

  //generate Data
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  //generate form controle dynamics
  public filters = this.fb.group([]);
  public search = new FormControl('');

  // selection toggle
  allSelect: boolean = true;

  //data after filter
  filterData: any[] = [];
  checklist: string[] = [];
  // @Output() uploadFiles = new EventEmitter<any>();
  @Output() dataInferListReady = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private commonServices: CommonService, public dialog: MatDialog, private lpValidatorServices: LpValidatorService) { }

  ngOnChanges() {
    this.commonServices.showSpinner();
    Object.assign(this.dataView, this.data);

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: string, index: number) => {
      if (key != 'select') {
        //création formControl Dynamics
        this.displayColumns.push(key);
        this.filters.addControl(key, new FormControl(''));
      }
    })
    this.commonServices.hideSpinner();

    this.dataView.displayColumns.forEach((item: string, index: number) => {
      if (index < 14 && item.includes('Facet') && !item.includes('Value')) {
        this.filterData.push(item);
      }
    });
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
      }
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
        facetLists: this.displayColumns,
      },
      width: '600px',
    }).afterClosed().pipe(
      map((result: string[]) => {
        console.log('result', result);
        this.checklist = result;
      })
    ).subscribe();
  }

  async tableReady() {
    const fake_header = ["ID", 'Category', 'Subcategory', 'Subcategory 2', 'Facet 1', 'Facet 1 Value', 'Facet 2', 'Facet 2 Value', 'Facet 3', 'Facet 3 Value', 'Facet 4', 'Facet 4 Value', 'Facet 5', 'Facet 5 Value'];

    const header = ["ID", 'Category', 'Subcategory', 'Subcategory_2', 'Facet_1', 'Facet_1_Value', 'Facet_2', 'Facet_2_Value', 'Facet_3', 'Facet_3_Value', 'Facet_4', 'Facet_4_Value', 'Facet_5', 'Facet_5_Value'];


    console.log(this.checklist);

    if (this.checklist.length > 0) {
      this.dataView.data.forEach((value: any, currentIndex: number) => {

        let i = 0;
        let object: any = { 'ID': '', 'Category': '', 'Subcategory': '', 'Subcategory_2': '', 'Facet_1': '', 'Facet_1_Value': '', 'Facet_2': '', 'Facet_2_Value': '', 'Facet_3': '', 'Facet_3_Value': '', 'Facet_4': '', 'Facet_4_Value': '', 'Facet_5': '', 'Facet_5_Value': '' };
        Object.keys(value).forEach((key: string, index: number) => {
          if (!key.includes('Facet') && !key.includes('Value')) {
            object[header[i]] = value[key];
            this.filterData[currentIndex] = { ...object };
            i++;
          } else if (key.includes('Facet') && this.checklist.includes(key)) {
            // i++;
            // this.checklist.findIndex()
            // const keyIndex = this.checklist.indexOf(key);
            const keyIndex = fake_header.indexOf(key);

            object[header[i]] = value[key];
            i++;
            object[header[i]] = value[fake_header[keyIndex + 1]];
            this.filterData[currentIndex] = { ...object };
            i++;
          }
        })
      })
    }

    // this.dataFilterReady.emit(this.filterData);
    const result = await this.lpValidatorServices.postInferList(this.filterData);
    console.log(result.message);

    if (result && result.message) {
      const value = await this.lpValidatorServices.getInfterList();
      console.log(value);
      this.dataInferListReady.emit(value);
    }
    // console.log(this.filterData);
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
    let index = this.dataView.data.findIndex((x: any) => x.ID === row.ID)
    this.dataView.data[index] = { ...row, 'select': row['select'] === true ? false : true };

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



}
