import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@app/shared/services/common.service';
import { CheckUserInfoService } from '@app/user-spaces/dashbord/services/check-user-info.service';
import { LpValidatorService } from '@app/user-spaces/dashbord/services/lp-validator.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';

@Component({
  selector: 'app-google-maching',
  templateUrl: './google-maching.component.html',
  styleUrls: ['./google-maching.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder] // <-- THIS PART
})
export class GoogleMachingComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() dataSources = { displayColumns: [], hideColumns: [], data: [] };
  @Input() isTabSelected: boolean = false;
  public data: DataTypes = undefined;
  dataView = { displayColumns: [], hideColumns: [], data: [] };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  //generate form controle dynamics
  public filters = this.fb.group([]);
  public search = new FormControl('');

  public displayColumns: string[] = [];
  columnAdd: string[] = ['Valid', 'Popular Search Queries', 'Website Browser'];

  constructor(private fb: FormBuilder, private commonServices: CommonService, private lpValidator: LpValidatorService) {

  }

  ngOnChanges() {
    this.commonServices.showSpinner();
    if (this.dataSources.data.length > 0) {
      if (this.dataView.data.length > 0) {
        this.dataView = { displayColumns: [], hideColumns: [], data: [] };
        this.displayColumns = [];
        // this.dataView.displayColumns = [];
      }
      Object.assign(this.dataView, this.lpValidator.converDataMatching(this.dataSources.data));
    }

    // console.log(this.dataView);


    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataView.displayColumns.map((key: string, index: number) => {
      this.displayColumns.push(key);
      this.filters.addControl(key, new FormControl(''));
    })
    this.commonServices.hideSpinner();
  }

  ngOnInit(): void {
    console.log('2', this.dataView)
  }

  ngAfterViewInit() {

    console.log('2', this.dataView)
  }

  //Deop item list
  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.displayColumns, event.previousIndex, event.currentIndex);
    this.displayColumns.forEach((column, index) => {
      this.dataView.displayColumns[index] = column;
      //création formControl Dynamics
      this.filters.addControl(column, new FormControl(''));
    });
  }



}
