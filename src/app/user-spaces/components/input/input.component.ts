import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CdkDragStart, CdkDragDrop,  CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';



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

export class InputComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource(ELEMENT_DATA);

  public displayedColumns: string[] = [];
  public columns: string[] = ['id', 'lastName', 'fistName', 'phone', 'adresse'];

  //filters row on tables
  public filters = new FormGroup({
    filter: new FormControl(''),
  });

  // drag and frop datadables
  public previousIndex!: number;

  constructor() { }

  ngOnInit(): void {
    this.columns.forEach((column, index) => {
      this.displayedColumns[index] = column;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  dragStarted(index: number) {
    this.previousIndex = index;
    console.log('idex' , index);
    
  }

  drop(event: CdkDragDrop<any>, index: number) {
    console.log(event.previousIndex, event.currentIndex, index);
    
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    console.log('columns ', this.columns);
  }
}