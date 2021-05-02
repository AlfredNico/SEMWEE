import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@app/shared/services/common.service';
import { LpValidatorService } from '@app/user-spaces/dashbord/services/lp-validator.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-google-maching',
  templateUrl: './google-maching.component.html',
  styleUrls: ['./google-maching.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder], // <-- THIS PART
})
export class GoogleMachingComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() dataSources = { displayColumns: [], hideColumns: [], data: [] };
  @Input() isTabSelected: boolean = false;
  public data: DataTypes = undefined;
  dataView = { displayColumns: [], hideColumns: [], data: [] };
  resultData = {};
  sCallback = (newData: any): void => {
    const v = this;
    v.dataSources = newData;
    if (v.dataSources.data.length > 0) {
      if (v.dataView.data.length > 0) {
        v.dataView = { displayColumns: [], hideColumns: [], data: [] };
        v.displayColumns = [];
        Object.assign(v.dataView, newData);
      }
    }
    v.dataSource.data = v.dataView.data;
    v.dataSource.paginator = v.paginator;
    v.dataSource.sort = v.sort;

    v.dataView.displayColumns.map((key: string, index: number) => {
      v.displayColumns.push(key);
      v.filters.addControl(key, new FormControl(''));
    });

    v.ref.detectChanges();
    v.ref.markForCheck();
  };

  public progressBarValue = 0; //progressBar lenth

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  //generate form controle dynamics
  public filters = this.fb.group([]);
  public search = new FormControl('');

  public displayColumns: string[] = [];

  // filter icon && and tooltips
  public icon = '';
  public active: any = '';

  // rowIndex: number[] = []; // disable matTooltips

  // multipleSelect tables
  isKeyPressed: boolean = false;
  selectedRow: any;
  indexSelectedRow: any;
  selectedItem = true;
  selectedRowsArray = [];
  countGoogle: number = 0;

  // selection toggle
  allSelect: boolean = true;

  //resizable
  mawWidth: number = 0;

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    private lpValidator: LpValidatorService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    if (this.dataSources.data.length > 0) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] };
        this.displayColumns = [];
        // this.dataView.displayColumns = [];
      }

      const value = this.lpValidator.converDataMatching(
        this.dataSources.data,
        this.resultData
      );
      Object.assign(this.dataView, value);
      this.countGoogle = value.data.length;
      this.displayColumns = value.displayColumns;
    }

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: string, index: number) => {
      if (key != 'select') this.filters.addControl(key, new FormControl(''));
      // this.displayColumns.push(key);
    });

    this.checkValid();
    // this.commonServices.hideSpinner();
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    // this.lpValidator.trigger$
    //   .pipe(
    //     tap((res) => {
    //       if (res == true)
    //         this.progressBarValue = this.lpValidator.progressBarValue;
    //     })
    //   )
    //   .subscribe();

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
                  query[property] &&
                  // typeof item[property] === 'string' &&
                  query[property] !== undefined &&
                  item[property] !== undefined
                ) {
                  let i = 0,
                    q = '';
                  Object.entries(query).map((val) => {
                    if (val[1]) {
                      i++;
                      const lower = (val[1] as any).toLowerCase();

                      if (val[0] === 'Valid' && 'yes'.includes(lower)) {
                        if (i == 1) {
                          q = `item["${val[0]}"]===true`;
                        } else {
                          q = `${q} && item["${val[0]}"]===true`;
                        }
                      } else if (val[0] === 'Valid' && 'no'.includes(lower)) {
                        if (i == 1) {
                          q = `item["${val[0]}"]===false`;
                        } else {
                          q = `${q} && item["${val[0]}"]===false`;
                        }
                      } else {
                        if (i == 1) {
                          q = `item["${val[0]}"].toString().toLowerCase().includes("${lower}")`;
                        } else {
                          q = `${q} && item["${val[0]}"].toString().toLowerCase().includes("${lower}")`;
                        }
                      }
                    }
                  });
                  return eval(q);
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

  //Drop item list
  public drop(event: CdkDragDrop<any>) {
    const previousIndex = event.previousIndex - 3;
    const currentIndex = event.currentIndex - 3;
    moveItemInArray(this.displayColumns, previousIndex, currentIndex);

    this.displayColumns.forEach((column, index) => {
      this.dataView.displayColumns[index] = column;
      //création formControl Dynamics
      this.filters.addControl(column, new FormControl(''));
    });
  }

  public checkValid(): void {
    this.lpValidator.searchAllItem(
      this.dataView.data,
      this.resultData,
      this.sCallback
    );
  }

  setAllGoogle(completed: boolean) {
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
      this.countGoogle = this.dataSource.data.length
    else
      this.countGoogle = 0;

    this.dataView.data = this.dataView.data;
    this.dataSource.data = this.dataSource.data;
  }

  public selectRowGoogle(row: any) {
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
    this.countGoogle = 0;
    //save data into indexDB
    this.counterSelected();


  }
  private counterSelected(): void {
    this.countGoogle = 0;
    this.dataSource.data.forEach(s => {
      if (s.select === true) {
        this.countGoogle++
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
        // case this.toLowerCase(column) == 'select':
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
      this.toLowerCase(column).includes('itemtype') ||
      (this.toLowerCase(column).includes('property') && value)
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
      const elem = document.getElementById(`${id}google${index}`);
      if (elem && this.mawWidth <= elem?.offsetWidth)
        this.mawWidth = elem.offsetWidth;
    }
  }

  public isNumberOrString(itemValue: any) {
    if (typeof itemValue === 'number' || Number(itemValue)) return true;
    else return false;
  }

  public clearInput(column: any) {
    this.filters.controls[column].reset('');
  }
}
