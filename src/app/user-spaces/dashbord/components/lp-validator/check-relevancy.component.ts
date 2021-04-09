import { TuneIt, TuneItVlaue } from './../../interfaces/tune-it';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
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

  rowIndex: number[] = [];// disable matTooltips

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    public dialog: MatDialog
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

    this.dataView.displayColumns.map((key: string, index: number) => {
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
                  return item[property]
                    .toLowerCase()
                    .includes(query[property].toLowerCase());
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

  dataMachingReady() {
    this.dataMatching.emit(this.dataView);
  }

  openTuneIt(id: string, row: any, event: any, itemSeleted: any) {
    const el: HTMLElement = document.getElementById(id);
    // let pos: number = el.offsetTop;
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el;
    const postLeft: number = offsetLeft + offsetWidth;
    const { clientX, clientY } = event;
    const item = itemSeleted == 'itemtype' ? true : false;

    this.dialog.open(TuneItComponent, {
      // position: { top: `${clientY}px`, left: `${clientX}px` },
      // width: itemSeleted == 'itemtype' ? '400px' : '',,
      data: { row, item, checkTuneItValue: this.checkTuneItValue },
    });
  }

   public isColumnDisplay(column: any): boolean{
    if (this.toLowerCase(column).includes('_id')
      || this.toLowerCase(column).includes('id')
      || this.toLowerCase(column).includes('idproduct')
      || this.toLowerCase(column).includes('select')
      || this.toLowerCase(column).includes('_v')) return true;
    else false;
  }

  public toLowerCase(item: string): string{
    return item.toLowerCase();
  }
  isPopTuneIt(column: string, value: string):boolean{
    if (this.toLowerCase(column).includes('itemtype')
    || (this.toLowerCase(column).includes('property') && value)) return true;
    else return false;
  }

  hideTooltip(event: number){
    if (!this.rowIndex.includes(event))
      this.rowIndex.push(event);
  }
}
