import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SettingTableComponent } from '../setting-table/setting-table.component';
import { SettingRowsTable } from '@app/models/setting-table';

// import * as fs from "fs";

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

  public dispalayColumn = [
    { name: 'id', ishidden: true },
    { name: 'lastName', ishidden: true },
    { name: 'fistName', ishidden: true },
    { name: 'phone', ishidden: false },
  ];

  public settingDisplayRows: SettingRowsTable = {
    noHiddenRows: ['lastName'],
    hiddenRows: ['id', 'fistName', 'phone', 'adresse']
  };

  // Generate form builder rows
  public filters = this.fb.group([]);

  // drag and frop datadables indexes
  public previousIndex!: number;
  public selectedRowIndex = -1;


  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.settingDisplayRows.noHiddenRows.forEach((column, index) => {
      //création formControl Dynamics
      this.filters.addControl(column, new FormControl(''));
      //creation dispaly columns
      this.displayedColumns[index] = column;
    });
  }

  ngOnInit(): void {
    console.log('Propertyv ', Object.keys(ELEMENT_DATA[0]));
  }

  ngOnChanges(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.filters.valueChanges.pipe(
      map(query => {
        let data = ELEMENT_DATA.filter((item: any) => {
          if (Object.values(query).every(x => (x === null || x === ''))) {
            return ELEMENT_DATA;
          } else {
            return Object.keys(item).some(property => {
              if (query[property] != "" && (query[property] !== undefined && item[property] !== undefined )) {
                return item[property].toLowerCase().includes(query[property].toLowerCase())
              }
            }
            )
          }
        }
        );
        this.dataSource.data = data;
      })
    ).subscribe();
  }

  async openSettingTable(): Promise<void>{
    this.dialog.open(SettingTableComponent, {
      data: this.settingDisplayRows
    }).afterClosed().subscribe(async (result: SettingRowsTable) => {
      this.settingDisplayRows.noHiddenRows.forEach((column, index) => {
        this.filters.addControl(column, new FormControl(''));
      });
      this.displayedColumns = result.noHiddenRows;
      this.settingDisplayRows = result;
      
    });

  }

  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.settingDisplayRows.noHiddenRows, event.previousIndex, event.currentIndex);
    this.settingDisplayRows.noHiddenRows.forEach((column, index) => {
      this.displayedColumns[index] = column;
    });
    
  }

  public getRow(row: any) {
    this.selectedRowIndex = row.id;
  }
}