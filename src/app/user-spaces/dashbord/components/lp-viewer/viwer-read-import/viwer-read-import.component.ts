import { UpdatesHeaderComponent } from './updates-header.component';
import { HeaderOptionsComponent } from './header-options.component';
import { LpViwersService } from './../../../services/lp-viwers.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FormBuilder } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { getCustomPaginatorIntl } from './custom-paginator.component';
import * as moment from 'moment';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
import {
  PageEvent,
  Paginator,
} from '@app/user-spaces/dashbord/interfaces/paginator';

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss'],
  // providers: [
  //   { provide: MatPaginatorIntl, useValue: getCustomPaginatorIntl() },
  // ],
})
export class ViwerReadImportComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  displayedColumns: string[] = [];
  edidtableColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  // // public items = [];
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren('updateHeader') nameHeader: QueryList<ElementRef>;
  @ViewChild('btnbutton') MyDOMElement: ElementRef;

  @Input('idProject') idProject = undefined;
  @Input('filtersData') filtersData: {
    items: any;
    facetQueries: any;
    searchQueries: any;
  } = undefined;

  @Input('dataAfterUploaded') dataAfterUploaded: any = undefined;
  @Input('inputFilters') inputFilters: any = undefined;

  public tabIndex = 0;
  public icon = '';
  public active: any = '';
  public undoRedoLabel = 'Undo/Redo 0/0';
  public dataViews: any[] = [];
  public dataSourceFilter: any[] = [];
  // public dataSource: any[] = [];
  public paginator: Paginator;
  private isFiltered = false;
  public formGroup = this.fb.group({});
  public items: any[] = [];

  public hoverIndex;
  public vueEdit: boolean = false;
  public nameCells;
  public lastValue;
  public objectOne: any;
  public selected = 'string';
  public listNameHistory: any[] = [];
  public ActualyData: any = null;
  public indexRowdata = undefined;
  public idHeader = 0;
  public tab_arraw: boolean[] = [];
  public testConverter: boolean = true;
  public CountCell = 0;
  top = 0;
  left = null;
  public domTab: any;

  length: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // ------------------
  pageEvent: PageEvent;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private lpViewer: LpViwersService,
    public senitizer: DomSanitizer,
    private readonly lpviLped: LpdLpdService
  ) {}

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {
      this.lpviLped.itemsObservables$.next(undefined);

      if (Object.keys(this.dataAfterUploaded).length === 5) {
        this.displayedColumns = this.dataAfterUploaded['headerOrigin'];
        this.dataViews = this.dataAfterUploaded['data'];
        this.listNameHistory = this.dataAfterUploaded['name'];

        this.items = this.lpviLped.permaLink.items; //set items filters

        Object.values(this.lpviLped.permaLink).map((x) => {
          if (Array.isArray(x) === true)
            if ((x as any[]).length != 0) this.isFiltered = true;
            else if (Object.keys(x).length !== 0) this.isFiltered = true;
        });

        if (this.isFiltered == true){
          this.dataSourceFilter = this.dataFilters(
            this.dataViews
          );
          this.dataSource.data = this.dataSourceFilter?.slice(0, 10);
        }
        else{
          this.dataSourceFilter = this.dataViews;
          this.dataSource.data = this.dataSourceFilter?.slice(
            0,
            10
          );
        }
      } else if (Object.keys(this.dataAfterUploaded).length === 4) {
        this.items = []; //set items filters
        this.displayedColumns = this.dataAfterUploaded['header'];
        this.dataSourceFilter = this.dataViews =
          this.dataAfterUploaded['content'];
        this.listNameHistory = this.dataAfterUploaded['name'];
        this.dataSource.data = this.dataAfterUploaded['showData'];
        // console.log('ok=', this.dataAfterUploaded);
      }

      this.paginator = {
        pageIndex: 0,
        pageSize: 10,
        nextPage: 0,
        previousPageIndex: 1,
      };
      // this.lpviLped.isLoading$.next(false); // disable loading spinner
    }
  }

  public getServerData(event?: PageEvent): void {
    if (this.dataSource.data.length > 9) {
      const page = event.pageSize * (event.pageIndex + 1) - event.pageSize;
      const lenghtPage = event.pageSize * (event.pageIndex + 1);
      this.paginator.nextPage = this.paginator.nextPage + event.pageSize;

      this.dataSource.data = this.dataViews.slice(page, lenghtPage);
      if(this.paginator.pageSize != event.pageSize)
        this.lpviLped.dataPaginator$.next(true);


      this.paginator = {
        ...this.paginator,
        ...event,
      };
    }
  }

  ngOnDestroy(): void {
    this.lpviLped.permaLink = {
      input: [],
      numeric: [],
      search: [],
      items: [],
      name: [],
      queries: {},
      queriesNumerisFilters: {},
    };
  }

  ngAfterViewInit() {
    // this.dataSource.data.paginator = this.paginator;
    // this.dataSource.data.sort = this.sort;

    this.lpviLped.dataSources$.subscribe((res: any[]) => {
      if (res) {
        this.paginator = {
          ...this.paginator,
          pageIndex: 0,
          nextPage: 0,
        };
        this.dataSourceFilter = res;
        this.dataSource.data = res.slice(0, this.paginator.pageSize);
        this.lpviLped.dataPaginator$.next(true);

      }
    });

    // this.paginator.nextPage = () => {
    //   console.log('OK');
    // }
  }

  public openTablesOptionns() {
    this.dialog
      .open(HeaderOptionsComponent, {
        data: {
          // noHiddenRows: this.displayColumns,
          noHiddenRows: this.displayedColumns,
          hiddenRows: [],
        },
        width: '70%',
      })
      .afterClosed()
      .pipe(
        map((result: any) => {
          if (result) {
            this.displayedColumns = result.noHiddenRows;
            this.lpViewer.postDisplayColums(
              this.idProject,
              this.idHeader,
              this.displayedColumns
            );
          }
        })
      )
      .subscribe();
  }

  public openEditColumn(columnName: string) {
    const index = this.displayedColumns.indexOf(columnName);
    this.dialog
      .open(UpdatesHeaderComponent, {
        data: {
          index,
          idHeader: this.dataAfterUploaded[0][0]['_id'],
          edidtableColumns: this.edidtableColumns,
        },
      })
      .afterClosed();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
  }

  sortData($e: any) {
    $e.direction === 'asc'
      ? (this.icon = 'asc')
      : $e.direction === 'desc'
      ? (this.icon = 'desc')
      : (this.icon = '');
    this.active = $e.active;
  }

  public isColumnDisplay(column: any): boolean {
    switch (true) {
      case column.toLowerCase().includes('idproject'):
      case column.toLowerCase().includes('_id'):
      case column.toLowerCase().includes('_v'):
        return true;

      default:
        return false;
    }
  }

  public isValidURL(value: any): boolean {
    const res = value.match(
      /(http(s)?:\/\/.)?([A-z]\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );

    if (res !== null) return true;
    return false;
  }

  downloadCSV() {
    let csvOptions = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: false,
      noDownload: false,
      headers: [],
    };

    let header_now = [];
    this.lpViewer
      .getHeaderExport(this.idProject, this.idHeader)
      .subscribe((res) => {
        if (res) {
          header_now = res[0]['nameUpdate'].split(',');
          const tabnewObject = [];
          this.dataViews.forEach((valueObject) => {
            const object = {};
            header_now.forEach((key) => {
              object[key] = valueObject[key];
            });
            tabnewObject.push(object);
          });
          csvOptions.headers = header_now;
          new AngularCsv(tabnewObject, res[1]['nameProject'], csvOptions);
        }
      });
  }

  public openButton() {
    console.log('open button');
  }

  public searchFacet(column: any) {
    let distances = {},
      isExist = false;
    this.dataViews.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    });

    const value = Object.entries(distances).map((val: any) => {
      return { ...val, include: false };
    });

    this.lpviLped.itemsObservables$.next({
      type: 'search',
      isMinimize: false,
      head: column,
      content: value,
    });
  }

  public inputFilter(column: any) {
    this.lpviLped.itemsObservables$.next({
      type: 'input',
      isMinimize: false,
      head: column,
      value: '',
    });
  }

  public numericFacter(column: any) {
    let minValue = 100000,
      maxValue = 0;
    this.dataViews.map((item: any) => {
      if (Number.isInteger(Number(item[column])) === true) {
        if (Number(item[column]) >= maxValue) maxValue = Number(item[column]);
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
      options: options,
    });
  }

  public timeLineFacter(column: any): void {
    let minIdx = 0,
      maxIdx = 0,
      date = [];

    this.dataViews.map((item, index) => {
      if (!isNaN(Date.parse(item[column]))) {
        date.push(item[column]);
        if (item[column] > date[minIdx]) maxIdx = index;
        if (item[column] < date[maxIdx]) minIdx = index;
      }
    });
    this.lpviLped.itemsObservables$.next({
      type: 'timeLine',
      isMinimize: false,
      head: column,
      startDate: date[minIdx],
      endDate: date[maxIdx],
    });
  }

  combinate(i, otherValue) {
    return i + otherValue;
  }

  enter(i, otherValue) {
    this.hoverIndex = i + otherValue;
  }

  leave(i, otherValue) {
    this.hoverIndex = null;
  }
  tooglevueEdit($event) {
    this.vueEdit = false;
  }

  positionPopup($event) {
    let i = 0;
    while (true) {
      if ($event.path[i].nodeName === 'TD') {
        this.domTab = $event.path[i];
        break;
      }
      i++;
    }
    this.domTab.style.fontWeight = 'bold';
    const totaleleft = 41 - $event.offsetX;
    const totaletop = $event.clientY - 6 - ($event.offsetY + 2);
    this.top = totaletop;
    if (window.innerWidth > $event.clientX + 520) {
      this.left = $event.clientX + totaleleft + 33;
      this.tab_arraw = [true, false];
    } else {
      const leftfixe = $event.clientX + totaleleft;
      this.left = leftfixe - 455 - this.domTab.offsetWidth;
      this.tab_arraw = [false, true];
    }
  }
  action(value, namecells, index, $event) {
    this.positionPopup($event);
    const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    if (regex3.exec(value[namecells])) {
      this.selected = 'object';
    } else {
      this.selected = typeof value[namecells];
    }
    this.vueEdit = true;
    this.objectOne = [index, value];
    this.nameCells = namecells;
    this.lastValue = value[namecells];
  }

  toggleedit(value) {
    let numbercoll = '';
    if (value[2] === undefined) {
      this.domTab.style.fontWeight = 'initial';
      numbercoll =
        this.CountCell === 0
          ? `Edit single cell on row ${this.objectOne[0] + 1},`
          : `Mass edit ${this.CountCell} cells in `;
    }
    this.vueEdit = value[0];
    if (value[1] === '' && this.testConverter) {
      this.indexRowdata = undefined;

      const name_dinamic =
        value[2] === undefined
          ? `${numbercoll} column ${this.nameCells}`
          : value[2];
      let actualydata;

      if (this.ActualyData) {
        this.listNameHistory.splice(
          this.listNameHistory.indexOf(this.ActualyData) + 1
        );
        actualydata = this.ActualyData.idName + 1;
      } else {
        actualydata = this.listNameHistory.length;
      }

      this.lpViewer
        .sendFiles(
          {
            namehistory: name_dinamic,
            idProject: this.idProject,
            fileData: this.dataViews,
            idHeader: this.idHeader,
          },
          actualydata
        )
        .subscribe((res) => {
          this.listNameHistory.push(res);
          console.log(res);
        });
      this.ActualyData = null;
    }
    this.CountCell = 0;
    this.testConverter = true;
  }

  ConverterToString(newValue) {
    const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;

    if (regex3.exec(newValue) || regex3.exec(this.lastValue)) {
      const regex2 = new RegExp('[-\\/ ]');
      const tab = newValue.split(regex2);
      const tab1 = tab[2].toString().split('T');
      this.dataViews.forEach((item) => {
        if (
          regex3.exec(item[this.nameCells]) &&
          item[this.nameCells].split('T')[0] === this.lastValue.split('T')[0]
        ) {
          item[this.nameCells] = moment(
            `${tab1[0]}-${tab[1]}-${tab[0]}`,
            'DD-MM-YYYY',
            true
          ).format('DD/MM/YYYY');
        }
        this.CountCell++;
      });
    } else {
      this.dataViews.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          parseInt(item[this.nameCells]) === parseInt(this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = newValue.toString();
          this.CountCell++;
        }
      });
    }
  }
  ConverterToNumber(newValue) {
    // const parsed = parseInt(newValue);
    const replace =
      typeof newValue === 'string' ? newValue.replace(',', '.') : newValue;
    const parsed = parseFloat(replace);
    if (isNaN(parsed)) {
      alert('not a valid number');
      this.testConverter = false;
    } else {
      this.dataViews.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          (parseInt(item[this.nameCells]) &&
            parseInt(item[this.nameCells]) === this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = parsed;
          this.CountCell++;
        }
      });
    }
  }
  ConverterToDate(newValue) {
    const reg =
      /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
    const reg1 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])$/;
    const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    let string_date = newValue;
    const regex2 = new RegExp('[-\\/ ]');

    // .format('YYYY/MM/DD');
    if (reg1.exec(string_date)) {
      const tab = string_date.split(regex2);
      this.dataViews.forEach((item) => {
        if (item[this.nameCells] === this.lastValue.toString()) {
          item[this.nameCells] = moment(
            `${tab[0]}-${tab[1]}-${tab[2]}`,
            'YYYY-MM-DD',
            true
          ).format();
          this.CountCell++;
        }
      });
      // .format('DD'/MM/YYYY);
    } else if (reg.exec(string_date)) {
      const tab = string_date.split(regex2);
      this.dataViews.forEach((item) => {
        if (item[this.nameCells] === this.lastValue.toString()) {
          item[this.nameCells] = moment(
            `${tab[0]}-${tab[1]}-${tab[2]}`,
            'DD-MM-YYYY',
            true
          ).format();
          this.CountCell++;
        }
      });
    } else if (regex3.exec(string_date)) {
      // console.log("C'est un objet");
      const tab = string_date.split(regex2);
      const tab1 = tab[2].toString().split('T');
      this.dataViews.forEach((item) => {
        if (
          regex3.exec(item[this.nameCells]) &&
          item[this.nameCells].split('T')[0] === this.lastValue.split('T')[0]
        ) {
          item[this.nameCells] = moment(
            `${tab1[0]}-${tab[1]}-${tab[0]}`,
            'DD-MM-YYYY',
            true
          ).format();
          this.CountCell++;
        }
      });
    } else {
      alert('format date incorrect');
      this.testConverter = false;
    }
  }
  ConverterToBooleen(newValue) {
    if (newValue != 'true' || !newValue) {
      this.dataViews.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          (parseInt(item[this.nameCells]) &&
            parseInt(item[this.nameCells]) === this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = false;
          this.CountCell++;
        }
      });
    } else {
      this.dataViews.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          (parseInt(item[this.nameCells]) &&
            parseInt(item[this.nameCells]) === this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = true;
          this.CountCell++;
        }
      });
    }
  }

  oneObjectfunc(updateObject) {
    if (updateObject[1] === 'string') {
      this.ConverterToString(updateObject[0]);
    } else if (updateObject[1] === 'number') {
      this.ConverterToNumber(updateObject[0]);
    } else if (updateObject[1] === 'boolean') {
      this.ConverterToBooleen(updateObject[0]);
    } else if (updateObject[1] === 'object') {
      this.ConverterToDate(updateObject[0]);
    }
  }

  updateDisplaycolumn(newHeader) {
    // console.log(newHeader);
    this.nameHeader.forEach((value, index) => {
      let textValue = value['_elementRef'].nativeElement.innerText;
      // console.log(textValue);
      if (textValue !== newHeader[index].trim()) {
        value['_elementRef'].nativeElement.innerText = newHeader[index].trim();
      }
    });
  }
  getAllDataByListName(value) { 
    
    this.ActualyData = value;
    this.idHeader = value.idHeader;
    this.lpViewer.getOnedateHistory(value).subscribe((response) => {
      const header = JSON.parse(
        JSON.stringify(response[1]['nameUpdate'].split('"').join(''))
      ).split(',');

      console.log("before data")
      this.updateDisplaycolumn(header);
      this.idHeader = response[1]['idHeader'];
      let min = (this.paginator.pageIndex) * this.paginator.pageSize;
      let max =  (this.paginator.pageIndex+1) *this.paginator.pageSize;
      this.dataSource.data = response[0].slice(min,max);
      console.log("after data")
      this.dataViews= response[0];
     
    
    });
  }
  updateHeader(value) {
    let updateHeader: any;
    let tabforUpdate: any[] = ['All'];
    this.nameHeader.forEach((el, index) => {
      tabforUpdate.push(el['_elementRef'].nativeElement.innerText);
      if (index === value - 1) {
        updateHeader = el['_elementRef'].nativeElement;
      }
    });

    this.dialog
      .open(UpdatesHeaderComponent, {
        data: {
          idHeader: this.idHeader,
          index: value,
          table: tabforUpdate,
          edidtableColumns: updateHeader,
          idproject: this.idProject,
        },
      })
      .afterClosed()
      .pipe(
        map((idHeader: any) => {
          if (idHeader) {
            console.log('Actualy data : ', this.ActualyData);
            const actualy = this.ActualyData ? this.ActualyData['idName'] : -1;
            if (this.ActualyData) {
              this.listNameHistory.splice(
                this.listNameHistory.indexOf(this.ActualyData) + 1
              );
            }
            this.idHeader = idHeader;
            // Rename column RANK(2013) to RANK(2013)24
            const name_dinamic = `Edit header table on column ${value + 1}`;
            this.lpViewer
              .sendFiles(
                {
                  namehistory: name_dinamic,
                  idProject: this.idProject,
                  fileData: this.dataSource.data,
                  idHeader: this.idHeader,
                },
                actualy
              )
              .subscribe((res) => {
                this.listNameHistory.push(res);
                console.log(res);
              });
          }
        })
      )
      .subscribe();
  }

  private dataFilters(data: any[]) {
    return data.filter((value, index) => this.checkFiltesData(index));
  }

  private checkFiltesData(index: number): boolean {
    const q1 = this.chechQueryFilter(index, this.lpviLped.permaLink['numeric']);
    const q2 = this.chechQueryFilter(index, this.lpviLped.permaLink['input']);
    const q3 = this.chechQueryFilter(index, this.lpviLped.permaLink['search']);

    return q1 && q2 && q3;
  }

  private chechQueryFilter(index: number, queries: boolean[]): boolean {
    if (queries.length !== 0) return queries[index];
    return true;
  }
}
