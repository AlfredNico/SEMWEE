import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingRowsTable } from '@app/models/setting-table';
import { CommonService } from '@app/shared/services/common.service';
import { ProductFakeService } from '@app/shared/services/product-fake.service';
import { map, tap } from 'rxjs/operators';
import { SettingTableComponent } from '../setting-table/setting-table.component';

@Component({
  selector: 'app-filter-data',
  template: `
          <div fxLayout="column">
              <div fxLayout="row" fxLayoutAlign="end center" class="px-2 m-3">
                  <button mat-mini-fab color="primary" aria-label="setting icon" (click)="openSettingTable()">
                      <mat-icon>settings</mat-icon>
                  </button>
              </div>
              <div class="px-2 m-3 table-container">
                  <table mat-table [dataSource]="dataSource" matSort class="w-100 p-4 m-3 datatable" cdkDropList [cdkDropListData]="settingDisplayRows.noHiddenRows" (cdkDropListDropped)=" drop($event)" cdkDropListOrientation="horizontal" cdkDragHandle>

                      <ng-container *ngFor="let column of settingDisplayRows.noHiddenRows; let i = index" [matColumnDef]="column">
                          <!-- // -->
                          <th mat-header-cell *matHeaderCellDef class="drag_n_drop p-1" cdkDragBoundary=".datatable" cdkDragLockAxis="x" cdkDrag>
                              <div fxLayout="column" fxLayoutAlign="space-between center" [formGroup]="filters">
                                  <div mat-sort-header class="text-uppercase">
                                      {{ column }}
                                  </div>
                                  <mat-form-field appearance="outline" id="filters">
                                      <input matInput type="search" [formControlName]="column" autocomplete="off">
                                  </mat-form-field>
                              </div>
                          </th>
                          <td mat-cell *matCellDef="let row" (click)="getRow(row)" [ngClass]="{'high-light': selectedRowIndex == row._id}">
                              <div *ngIf="isObject(row[column]) === true; then content else other_content">
                              </div>
                              <ng-template #content>
                                  <div *ngFor="let item of row[column] | keyvalue">
                                      {{item.key}} : {{item.value}}
                                  </div>
                              </ng-template>
                              <ng-template #other_content> {{ row[column] }} </ng-template>
                          </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                  <mat-paginator [pageSizeOptions]="[10, 25, 50, 100, 250, 500, 1000, 2500, 5000]" showFirstLastButtons></mat-paginator>
              </div>
          </div>
  `,
  styles: [`
      .drag_n_drop {
      cursor: move;
  }

  // .drag_n_drop-handle {
  //     // position: absolute;
  //     // top: 10px;
  //     // right: 10px;
  //     color: #ccc;
  //     cursor: move;
  //     // width: 24px;
  //     // height: 24px;
  // }
  .table-container {
      position: relative;
      max-height: 500px;
      overflow-x: auto;
  }

  .high-light {
      background: #989a98;
      color: rgb(50, 61, 135);
      /* green */
  }

  .mat-form-field-appearance-legacy .mat-form-field-infix {
      width: auto !important;
  }

  .mat-form-field-infix {
      width: auto !important;
  }

  .hide-row {
      display: none;
  }

  .datatable:not(.table) {
      display: inline-table;
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder] // <-- THIS PART
})
export class FilterDataComponent implements OnInit {

  //generate Data
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

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

  // public data

  constructor(private productsFake: ProductFakeService, private fb: FormBuilder, public dialog: MatDialog, private common: CommonService) {
    this.settingDisplayRows.noHiddenRows = this.productsFake.views.columnes.noHiddenRows;
    this.settingDisplayRows.hiddenRows = this.productsFake.views.columnes.hiddenRows;
  }

  ngOnInit(): void {
    this.displayColumns();
    this.dataSource.data = this.productsFake.views.data;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.filters.valueChanges.pipe(
      map(query => {
        let data = this.productsFake.views.data.filter((item: any) => {
          if (Object.values(query).every(x => (x === null || x === ''))) {
            return this.productsFake.views.data;
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
      tap(() => {
        this.common.showSpinner('root');
      }),
      map((result: SettingRowsTable) => {
        if (result) {
          this.displayedColumns = result.noHiddenRows;
          this.settingDisplayRows.noHiddenRows = result.noHiddenRows;
          this.settingDisplayRows = result;

          // result.noHiddenRows?.map(async item => {
          //   await this.filters.addControl(item, new FormControl(''));
          //   if (this.displayedColumns[this.displayedColumns.length - 1] === item) {
          //     this.common.hideSpinner();
          //   }
          // });
          // this.dataSource.data = this.productsFake.views.data;
          // console.log(this.settingDisplayRows.noHiddenRows);
          this.displayColumns();

        }
      }),
    ).subscribe();
  }

  public getRow(row: any) {
    this.selectedRowIndex = row._id;
  }

  displayColumns() {
    this.common.showSpinner('root');
    this.settingDisplayRows.noHiddenRows.forEach((column, index) => {
      //création formControl Dynamics
      this.filters.addControl(column, new FormControl(''));
      //creation dispaly columns
      this.displayedColumns[index] = column;
    });
    this.common.hideSpinner();
  }

  public isObject(value: any): boolean { return typeof value === 'object'; }


}
