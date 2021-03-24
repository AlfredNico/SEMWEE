import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';

@Component({
  selector: 'app-google-maching',
  templateUrl: './google-maching.component.html',
  styleUrls: ['./google-maching.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  // providers: [FormBuilder] // <-- THIS PART
})
export class GoogleMachingComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() dataSources: DataTypes;
   dataView = { displayColumns: [], hideColumns: [], data: [] };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

   //generate form controle dynamics
  public filters = this.fb.group([]);
  public search = new FormControl('');

  displayColumns: string[] = [];
  column: string[] =['Valid', 'Popular Search Queries', 'Website Browser'];

  @Output() previewTab = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    console.log('2', this.displayColumns);
   }

  ngOnChanges() {
    Object.assign(this.dataView, this.dataSources);

    this.dataView.displayColumns.forEach((item: string, index: number) => {
      if (index === 0) {
        this.displayColumns.push(this.column['0']);
      }
      if (index === 3) {
        this.displayColumns.push(this.column['1']);
      }

      if (index === 5) {
        this.displayColumns.push(this.column['1']);
      }
      this.displayColumns.push(item);
      this.filters.addControl(item, new FormControl(''));
    })
    console.log('2', this.dataView)
    console.log('2', this.displayColumns);

    this.dataSource.data = this.dataView.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnInit(): void {
    console.log('2', this.dataView)
  }

  ngAfterViewInit(){
    
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
