import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



export interface PeriodicElement {
  id: number;
  fistName: string;
  lastName: string;
  phone: number;
  adresse: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1,lastName: 'Zaho1', fistName: 'ZAHO 1', phone: 12345678, adresse: 'Tana' },
  { id: 2,lastName: 'Zaho2', fistName: 'zaho 2', phone: 12345678, adresse: 'Fianara' },
  { id: 3,lastName: 'Zaho3', fistName: 'zaho 3', phone: 12345678, adresse: 'Ambositra' },
  { id: 4,lastName: 'Zaho4', fistName: 'zaho 4', phone: 12345678, adresse: 'Ambalavao' },
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
  displayedColumns: string[] = ['id', 'lastName', 'fistName', 'phone', 'adresse'];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.dataSource.data = 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
