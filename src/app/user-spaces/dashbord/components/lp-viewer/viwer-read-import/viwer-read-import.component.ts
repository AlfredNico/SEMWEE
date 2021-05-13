import { LpViwersService } from './../../../services/lp-viwers.service';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from '@app/shared/services/common.service';
import { DataSources } from '@app/user-spaces/dashbord/interfaces/data-sources';

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss']
})
export class ViwerReadImportComponent implements OnInit, AfterViewInit, OnChanges {

  displayedColumns: string[] = [];
  columns: string[] = [];
  dataSource = new MatTableDataSource<DataSources>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input('dataAfterUploaded') dataAfterUploaded: DataSources = undefined;

  public items: any[] = [];

  constructor(public dialog: MatDialog, private commonService: CommonService, private lpViewer: LpViwersService) { }

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {
      this.displayedColumns = this.dataAfterUploaded.columns;
      this.columns = this.dataAfterUploaded.columns;
      this.dataSource.data = this.dataAfterUploaded.data;
      this.columns.push('numer', 'start')
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  public textFacet(column: any) {
    // this.commonService.showSpinner('table');

    let distances = {}, isExist = false;
    this.dataSource.data.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    const value = Object.entries(distances).map((val: any) => {
      return { ...val }
    })

    // this.items.map(value => {
    //   if (value['head'] && value['head'] === column && value['type'] === column) {
    //     isExist = true;
    //     return;
    //   }
    // })

    // if (isExist === false) {
    this.items.push({
      type: 'facet',
      isMinimize: false,
      head: column,
      content: value
    });
    this.lpViewer.itemsSubject$.next();
    // }
  }

  public textFilter(column: any) {
    this.items.push({
      type: 'filter',
      isMinimize: false,
      head: column,
    });
    this.lpViewer.itemsSubject$.next();
  }

}
