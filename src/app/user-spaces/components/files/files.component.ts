import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportScroller } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingRowsTable } from '@app/models/setting-table';
import { CommonService } from '@app/shared/services/common.service';
import { UserFakeService } from '@app/shared/services/user-fake.service';
import { Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { SettingTableComponent } from '../setting-table/setting-table.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder] // <-- THIS PART
})
export class FilesComponent implements OnInit, AfterViewInit {

  //generate Data
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  //slect in table
  selection = new SelectionModel<any>(true, []);

  //generate form controle dynamics
  public filters = this.fb.group([]);

  //selected row by default
  public selectedRowIndex = -1;

  //display columns for dynamics table
  public displayedColumns: string[] = [];
  public settingDisplayRows: SettingRowsTable = {
    noHiddenRows: [],
    hiddenRows: []
  };
  
  public showRows: Observable<any> = new Observable<any>();
  public cells: Observable<any> = new Observable<any>();
  hiddenRows: Observable<any> = new Observable<any>();

  // read excel file:
  isExcelFile: boolean = false;
  fileName = '';
  @ViewChild('inputFile') inputFile!: ElementRef;
 
  constructor(private userFake: UserFakeService, private fb: FormBuilder, public dialog: MatDialog, private common: CommonService) {
    this.settingDisplayRows.noHiddenRows = this.userFake.views.columnes.noHiddenRows;
    this.settingDisplayRows.hiddenRows = this.userFake.views.columnes.hiddenRows;
    this.showRows = of(['select', ...this.userFake.views.columnes.noHiddenRows])
  }

  ngOnInit(): void {
    this.displayColumns();   
    this.dataSource.data = this.userFake.views.data;

    this.showRows.subscribe(val => {
      console.log(val);
    });
    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.filters.valueChanges.pipe(
      map(query => {
        let data = this.userFake.views.data.filter((item: any) => {
          if (Object.values(query).every(x => (x === null || x === ''))) {
            return this.userFake.views.data;
          } else {
            return Object.keys(item).some(property => {
              if (query[property] != "" && typeof item[property] === 'string' && (query[property] !== undefined && item[property] !== undefined)) {
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

  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.settingDisplayRows.noHiddenRows, event.previousIndex, event.currentIndex);
    this.settingDisplayRows.noHiddenRows.forEach((column, index) => {
      this.displayedColumns[index] = column;
    });
  }

  openSettingTable() {
    this.dialog.open(SettingTableComponent, {
      data: this.settingDisplayRows
    }).afterClosed().pipe(
      // tap(() => {
      //   this.common.showSpinner('root');
      // }),
      map((result: SettingRowsTable) => {
        if (result) {
          this.displayedColumns = result.noHiddenRows;
          this.showRows = of('select', [...this.userFake.views.columnes.noHiddenRows]);

          result.noHiddenRows?.map(async item => {
            await this.filters.addControl(item, new FormControl(''));
          });
        }
      }),
    ).subscribe();
    this.displayColumns();
  }

  public getRow(row: any) {
    console.log(row);
    this.selectedRowIndex = row.age;
  }

  displayColumns(){
    this.common.showSpinner('root');
    this.settingDisplayRows.noHiddenRows.forEach((column, index) => {
      //création formControl Dynamics
      this.filters.addControl(column, new FormControl(''));
      //creation dispaly columns
      this.displayedColumns[index] = column;
    });
    this.common.hideSpinner();
  }

  onFileInput(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    this.isExcelFile = !!target.files[0]?.name.match(/(.csv)/);
    // this.isExcelFile = !!target.files[0]?.name.match(/(.xls|.xlsx)/);

    if (event.target.files.length > 0) {
      this.fileName = event.target.files[0].name;
    }
    console.log(target.files[0]?.name);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    this.selection.selected.forEach(s => console.log(s.name));
  }
}
