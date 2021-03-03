import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CdkDragStart, CdkDragEnd, CdkDragDrop,  CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';



export interface PeriodicElement {
  id: number;
  fistName: string;
  lastName: string;
  phone: string;
  adresse: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 2, lastName: 'Zaho2', fistName: 'zaho 2', phone: '12345678', adresse: 'Fianara' },
  { id: 3, lastName: 'Zaho3', fistName: 'zaho 3', phone: '12345678', adresse: 'Ambositra' },
  { id: 1, lastName: 'Zaho1', fistName: 'ZAHO 1', phone: '12345678', adresse: 'Tana' },
  { id: 4, lastName: 'Zaho4', fistName: 'zaho 4', phone: '12345678', adresse: 'Ambalavao' },
];


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource(ELEMENT_DATA);

  public displayedColumns: string[] = [];
  public columns: string[] = ['id', 'lastName', 'fistName', 'phone', 'adresse'];
  

  // Generate form builder rows
  public filters = this.fb.group([]);

  // drag and frop datadables
  public previousIndex!: number;
  public selectedRowIndex = -1;

  constructor(private fb: FormBuilder) { 
    this.columns.forEach(column => {
      this.filters.addControl(column, new FormControl());
      // this.form.addControl(column, new FormControl(''));
      // this.filters.addControl(column, this.fb.group({column: ''}));
    });
  }

  ngOnInit(): void {
    this.columns.forEach((column, index) => {
      this.displayedColumns[index] = column;
    })
  }

  ngOnChanges() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.filters.valueChanges.pipe(
      map(query => {
        const data = this.dataSource.data;

        // this.dataSource.data.filter((item: any) => {
        //   return Object.keys(query).every(property => item[property] === query[property])
        // })
        console.log('data', this.dataSource.data);
      })
    ).subscribe();
  }

  changeInput(event: any){
    console.log(this.filters.get('lastName')?.value);
  }


  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns.forEach((column, index) => {
      this.displayedColumns[index] = column;
    });
  }

  public getRow(row: any){
    this.selectedRowIndex = row.id;
    console.log('ros', row);
  }
}