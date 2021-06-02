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
import { DatePipe } from '@angular/common';
import { Options } from '@angular-slider/ngx-slider';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

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
  public dataViews: any[] = [];

  constructor(
    public dialog: MatDialog,
    private readonly lpEditor: LpEditorService,
    private readonly lpviLped: LpdLpdService,
    public datepipe: DatePipe
  ) { }

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {
      if (Array.isArray(this.dataAfterUploaded) === true) {
        const header = JSON.parse(
          JSON.stringify(
            this.dataAfterUploaded[0][0]['nameOrigin'].split('"').join('')
          )
        ).split(',');
        const editableColumns = JSON.parse(
          JSON.stringify(
            this.dataAfterUploaded[0][0]['nameUpdate'].split('"').join('')
          )
        ).split(',');
        const values = this.dataAfterUploaded[1];
        header.unshift('all');
        editableColumns.unshift('all');

        this.displayedColumns = header;
        this.dataSource.data = this.dataViews = values;
      } else {
        this.displayedColumns = this.dataAfterUploaded['header'];
        this.dataSource.data = this.dataViews = this.dataAfterUploaded['content'];
      }
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.lpviLped.dataSources$.subscribe(data => {
      if (data)
        this.dataSource.data = data;
    })
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

  public searchFacet(column: any) {
    let distances = {}, isExist = false;
    this.dataViews.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    })

    const value = Object.entries(distances).map((val: any) => {
      return { ...val, include: false };
    });

    this.lpviLped.itemsObservables$.next({
      type: 'search',
      isMinimize: false,
      head: column,
      content: value
    });
  }

  public inputFilter(column: any) {
    this.lpviLped.itemsObservables$.next({
      type: 'input',
      isMinimize: false,
      head: column,
      value: ''
    });
  }

  public numericFacter(column: any) {
    let minValue = 100000, maxValue = 0;
    this.dataViews.map((item: any) => {
      if (Number.isInteger(Number(item[column])) === true) {
        if (Number(item[column]) >= maxValue) maxValue = Number(item[column])
        if (Number(item[column]) <= minValue) minValue = Number(item[column]);
      }
    });
    const options: Options = {
      floor: minValue,
      ceil: maxValue,
      hidePointerLabels: true,
      hideLimitLabels: true,
      draggableRange: true,
      showSelectionBar: true,
    };


    this.lpviLped.itemsObservables$.next({
      type: 'numeric',
      isMinimize: false,
      head: column,
      minValue: minValue,
      maxValue: maxValue,
      options: options
    });
  }
}


