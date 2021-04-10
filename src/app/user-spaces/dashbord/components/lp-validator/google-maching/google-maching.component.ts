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
  columnAdd: string[] = ['Valid', 'Popular Search Queries', 'Website Browser'];

  rowIndex: number[] = []; // disable matTooltips

  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    private lpValidator: LpValidatorService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    this.commonServices.showSpinner();
    if (this.dataSources.data.length > 0) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] };
        this.displayColumns = [];
        this.rowIndex = [];
        // this.dataView.displayColumns = [];
      }
      const value = this.lpValidator.converDataMatching(
        this.dataSources.data,
        this.resultData
      );
      Object.assign(this.dataView, value);
    }

    // console.log(this.dataView);

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: string, index: number) => {
      this.displayColumns.push(key);
      this.filters.addControl(key, new FormControl(''));
    });
    this.checkValid();
    this.commonServices.hideSpinner();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.lpValidator.trigger$
      .pipe(
        tap((res) => {
          if (res == true)
            this.progressBarValue = this.lpValidator.progressBarValue;
        })
      )
      .subscribe();

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

  //Drop item list
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

  public checkValid(): void {
    this.lpValidator.searchAllItem(
      this.dataView.data,
      this.resultData,
      this.sCallback
    );
  }

  public isColumnDisplay(column: any): boolean{
    switch(true){
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
