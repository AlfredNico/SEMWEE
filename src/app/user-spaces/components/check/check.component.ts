import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  id: string;
  fistName: string;
  lastName: string;
  phone: string;
  adresse: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: '2', lastName: 'Zaho2', fistName: 'zaho 2', phone: '12345678', adresse: 'Fianara' },
  { id: '3', lastName: 'Zaho3', fistName: 'zaho 3', phone: '12345678', adresse: 'Ambositra' },
  { id: '1', lastName: 'Zaho1', fistName: 'ZAHO 1', phone: '12345678', adresse: 'Tana' },
  { id: '4', lastName: 'Zaho4', fistName: 'zaho 4', phone: '12345678', adresse: 'Ambalavao' },
];

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource(ELEMENT_DATA);

  // columns: Observable<>
  
  constructor() { }

  ngOnInit(): void {
  }

}
