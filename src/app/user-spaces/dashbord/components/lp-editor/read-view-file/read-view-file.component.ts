import { LpEditorService } from './../../../services/lp-editor.service';
import { EditorDialogComponent } from '../editor-dialog.component';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-read-view-file',
  templateUrl: './read-view-file.component.html',
  styleUrls: ['./read-view-file.component.scss']
})
export class ReadViewFileComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // public event: any;

  public items: any[] = [];

  public tabIndex = 0;

  public undoRedoLabel = 'Undo/Redo 0/0';
  @Input('dataAfterUploaded') dataAfterUploaded: any = undefined;

  constructor(public dialog: MatDialog, private lpEditor: LpEditorService) { }

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {
      this.displayedColumns = this.dataAfterUploaded.columns;
      this.dataSource.data = this.dataAfterUploaded.data;
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }

  public openEditorDialog(element: any, possition: string, isLast: boolean): void {
    const { left, top } = this.getOffset(element);
    const width = element.offsetWidth;


    const dialogRef = this.dialog.open(EditorDialogComponent, {
      backdropClass: 'cdk-overlay-transparent-backdrop',
      width: '250px',
      position: {
        left: (possition === 'left' || isLast === true) ? `${left - 250}px` : `${left + width}px`,
        top: `${top}px`,
      },
      hasBackdrop: true,
    });
  }

  private getOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  public filterColumn(column: any) {
    let distances = {}, isExist = false;
    this.dataSource.data.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    let valu = Object.entries(distances).map((val: any) => {
      return { ...val }
    })

    this.items.map(value => {
      if (value['head'] && value['head'] === column) {
        isExist = true;
        return;
      }
    })

    if (isExist === false) {
      this.items.push({
        head: column,
        content: valu
      });
    }
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

    this.lpEditor.itemsObservables$.next({
      type: 'facet',
      isMinimize: false,
      head: column,
      content: value
    });
    // }
  }

  public textFilter(column: any) {
    this.lpEditor.itemsObservables$.next({
      type: 'filter',
      isMinimize: false,
      head: column,
    });
  }

  /* Convert To Title case */
  public convertToTitlecase(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (item[nameCell][1] === 'text') {
        item[nameCell][0] = this.toTitleCase(item[nameCell][0]);
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Uppercase */
  public convertToUppercase(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (item[nameCell][1] === 'text') {
        item[nameCell][0] = (item[nameCell][0] as string).toUpperCase();
      }
    });
    this.dataSource = this.dataSource;
  }

  /* Convert To Lowercase */
  public convertToLowercase(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (item[nameCell][1] === 'text') {
        item[nameCell][0] = (item[nameCell][0] as string).toLowerCase();
      }
    });
    this.dataSource = this.dataSource;
  }
  /* Convert To Number */
  public convertToNumber(nameCell: string) {
    this.dataSource.data.forEach(item => {
      if (Number.isInteger(Number(item[nameCell][0]))) {
        item[nameCell][0] = Number(item[nameCell][0])
        item[nameCell][1] = 'number'
      }
    });
    this.dataSource = this.dataSource;
  }
  /* Convert To Date */
  public convertToDate(nameCell: string) {
    this.dataSource.data.forEach(item => {
      // console.log('item', item[nameCell])
      // if (Date.isDate(Date(item[nameCell][0]))) {
        item[nameCell][0] = Date.parse(item[nameCell][0])
        item[nameCell][1] = 'date'
      // }
    });
  }
  /* Convert To Text */
  public convertToText(nameCell: string) {
    this.dataSource.data.forEach(item => {
      console.log('item', item[nameCell])
    });
  }

  private toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (txt: string) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

}


