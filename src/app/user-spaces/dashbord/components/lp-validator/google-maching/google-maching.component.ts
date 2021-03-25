import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CheckUserInfoService } from '@app/user-spaces/dashbord/services/check-user-info.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';

@Component({
  selector: 'app-google-maching',
  templateUrl: './google-maching.component.html',
  styleUrls: ['./google-maching.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  // providers: [FormBuilder] // <-- THIS PART
})
export class GoogleMachingComponent implements OnInit, OnChanges, AfterViewInit, DoCheck {

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

  displayColumns: string[] = [];
  column: string[] = ['Valid', 'Popular Search Queries', 'Website Browser'];

  @Output() previewTab = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private sharedData: CheckUserInfoService) {
    console.log('2', this.displayColumns);
    console.log('232', this.sharedData.currentDatasources);

  }

  ngDoCheck() {
    if (this.data != undefined && this.isTabSelected === true) {
      console.log('2', this.dataSource);
      console.log('2', this.data);

      Object.assign(this.dataView, this.data);
      console.log(this.data.displayColumns)

      this.data.displayColumns.forEach((item: string, index: number) => {
        // if (index === 0) {
        //   this.displayColumns.push(this.column['0']);
        //   this.filters.addControl(this.column['0'], new FormControl(''));
        // }
        // if (index === 3) {
        //   this.displayColumns.push(this.column['1']);
        //   this.filters.addControl(this.column['1'], new FormControl(''));
        // }

        // if (index === 5) {
        //   this.displayColumns.push(this.column['1']);
        //   this.filters.addControl(this.column['2'], new FormControl(''));
        // }
        this.displayColumns.push(item);
        this.filters.addControl(item, new FormControl(''));
      })

      this.dataSource.data = this.dataView.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.isTabSelected = false;
    }
  }
  ngOnChanges() {
    Object.assign(this.dataView, this.dataSources);
    console.log('2', this.dataView)
    console.log('2', this.displayColumns);
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
