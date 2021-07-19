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
import { MatSort, Sort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import * as moment from 'moment';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
import {
  PageEvent,
  Paginator,
} from '@app/user-spaces/dashbord/interfaces/paginator';
import { ResizeEvent } from 'angular-resizable-element';
import { of } from 'rxjs';
import { NotificationService } from '@app/services/notification.service';

//filter data
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss'],
})
export class ViwerReadImportComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  displayedColumns: string[] = [];
  edidtableColumns: string[] = [];
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren('updateHeader') nameHeader: QueryList<ElementRef>;
  @ViewChild('btnbutton') MyDOMElement: ElementRef;
  selectedIndex = 0;

  @Input('idProject') idProject = undefined;
  @Input('filtersData') filtersData: {
    items: any;
    facetQueries: any;
    searchQueries: any;
  } = undefined;

  @Input('dataAfterUploaded') dataAfterUploaded: any = undefined;
  @Input('inputFilters') inputFilters: any = undefined;
  @ViewChild('container') container: ElementRef;
  @Input() isFavorate: boolean = false;

  public projectName: string = '';

  formfilterStart = new FormGroup({
    first: new FormControl(false),
    second: new FormControl(false),
  });
  public syncData$ = of(false);
  public isLooading: boolean = true;
  public dataSourceFilterStart = [];
  public tabIndex = 0;
  public icon = '';
  public active: any = '';
  public undoRedoLabel = 'Undo/Redo 0/0';
  public dataViews: any[] = [];
  public dataSourceFilter: any[] = [];
  public paginator: Paginator;
  private isFiltered = false;
  public formGroup = this.fb.group({});
  public items: any[] = [];

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
  public ws: any;

  // ------------------
  pageEvent: PageEvent;
  Columns_replace: String;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private lpViewer: LpViwersService,
    public senitizer: DomSanitizer,
    private readonly lpviLped: LpdLpdService,
    private notifs: NotificationService
  ) {}

  ngOnChanges(): void {
    if (this.dataAfterUploaded != undefined) {
      this.lpviLped.itemsObservables$.next(undefined);

      if (Object.keys(this.dataAfterUploaded).length === 6) {
        this.displayedColumns = this.dataAfterUploaded['headerOrigin'];
        this.dataViews = this.dataAfterUploaded['data'];
        this.listNameHistory = this.dataAfterUploaded['name'];
        this.projectName = this.dataAfterUploaded['projectName'];

        this.items = this.lpviLped.permaLink.items;

        Object.values(this.lpviLped.permaLink).map((x) => {
          if (Array.isArray(x) === true)
            if ((x as any[]).length != 0) this.isFiltered = true;
            else if (Object.keys(x).length !== 0) this.isFiltered = true;
        });

        if (this.isFiltered == true) {
          this.dataSourceFilter = this.dataFilters(this.dataViews);
          this.dataSource = this.dataSourceFilter?.slice(0, 10);
        } else {
          this.dataSourceFilter = this.dataViews;
          this.dataSource = this.dataSourceFilter?.slice(0, 10);
        }
        this.isLooading = false;
        this.projectName = this.dataAfterUploaded['projectName'];
      } else {
        this.items = []; //set items filters
        setTimeout(() => {
          this.readCsvFile(
            this.dataAfterUploaded['file'],
            this.dataAfterUploaded['idProject']
          );

          this.projectName = this.dataAfterUploaded['projectName'];
        }, 500);
        this.listNameHistory = [
          {
            idName: 0,
            name: 'Create project',
            idProject: this.dataAfterUploaded['idProject'],
          },
        ];
      }

      this.paginator = {
        pageIndex: 0,
        pageSize: 10,
        nextPage: 0,
        previousPageIndex: 1,
        pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
      };
      this.lpviLped.isLoading$.next(false);
    }
  }

  private processCsv(content) {
    return content.split('\n');
  }

  private readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  private readCsvFile(file: File, idProject: any) {
    this.readFileContent(file)
      .then((csvContent) => {
        try {
          const csv = [];
          const lines = this.processCsv(csvContent);
          const sep1 = lines[0].split(';').length;
          const sep2 = lines[0].split(',').length;
          const csvSeparator = sep1 > sep2 ? ';' : ',';
          lines.forEach((element) => {
            const cols: string[] = element.split(csvSeparator);
            csv.push(cols);
          });
          const parsedCsv = csv;
          parsedCsv.pop();
          setTimeout(() => {
            const header = parsedCsv.shift().toString().split(',');
            this.displayedColumns = [...new Set([...header])].filter(
              (item) => item != undefined && item != ''
            );
            setTimeout(() => {
              const content = parsedCsv.map((value, indexMap) =>
                value.reduce(
                  (tdObj, td, index) => {
                    tdObj[header[index]] = td;
                    return tdObj;
                  },
                  { star: false, flag: false, index: indexMap + 1 }
                )
              );
              this.displayedColumns.unshift('all');
              this.dataViews = this.dataSourceFilter = content;
              this.dataSource = this.dataSourceFilter.slice(0, 10);
              this.isLooading = false;
              this.lpViewer
                .sendFiles(
                  {
                    namehistory: 'Create project',
                    idProject: idProject,
                    fileData: this.dataViews,
                    idHeader: 0,
                    header: this.displayedColumns,
                  },
                  0
                )
                .subscribe();
            }, 500);
          }, 500);
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => console.log(error));
  }

  public getServerData(event?: PageEvent): void {
    let page = event.pageIndex * event.pageSize;
    const lenghtPage = event.pageSize * (event.pageIndex + 1);
    this.paginator.nextPage = this.paginator.nextPage + event.pageSize;

    this.dataSource = this.dataViews.slice(page, lenghtPage);
    if (this.paginator.pageSize != event.pageSize)
      this.lpviLped.dataPaginator$.next(true);

    this.paginator = {
      ...this.paginator,
      ...event,
    };
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
      queriesTimeLineFilters: {}
    };
  }

  ngAfterViewInit() {
    this.lpviLped.searchReplace$.subscribe((value) => {
      if (value !== undefined) {
        this.Columns_replace = value['head'];
      }
    });
    this.lpviLped.dataSources$.subscribe((res: any[]) => {
      if (res) {
        this.paginator = {
          ...this.paginator,
          pageIndex: 0,
          nextPage: 0,
        };
        this.dataSourceFilter = res;
        this.dataSource = res.slice(0, this.paginator.pageSize);
        this.lpviLped.dataPaginator$.next(true);
      }
    });

    setTimeout(() => {
      let containt =
        (this.container.nativeElement as HTMLElement).offsetWidth / 4;
      this.ws = containt > 450 ? containt : 450;
    }, 0);
  }

  onResizeEnd(e: ResizeEvent) {
    this.ws = e.rectangle.width > 450 ? e.rectangle.width : 450;
  }

  onFavorite() {
    this.isFavorate = !this.isFavorate;
  }

  public openTablesOptionns() {
    this.dialog
      .open(HeaderOptionsComponent, {
        data: {
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
  update_Search_Replace(name_dinamic) {
    this.savedata(name_dinamic);
  }

  updateStart(value, indice, nameUpdate) {
    let name_dinamic;

    if (nameUpdate === 'Star') {
      value.star = value.star ? false : true;
      name_dinamic = value.star
        ? `${nameUpdate} row ${indice}`
        : `Un${nameUpdate} row ${indice}`;
    } else {
      value.flag = value.flag ? false : true;
      name_dinamic = value.flag
        ? `${nameUpdate} row ${indice}`
        : `Un${nameUpdate} row ${indice}`;
    }
    this.savedata(name_dinamic);

    this.selectedIndex = 1;
  }

  savedata(name_dinamic) {
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
          header: [],
        },
        actualydata
      )
      .subscribe((res) => {
        this.listNameHistory.push(res);
      });
    this.ActualyData = null;
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

  public sortData($e: any) {
    $e.direction === 'asc'
      ? (this.icon = 'asc')
      : $e.direction === 'desc'
      ? (this.icon = 'desc')
      : (this.icon = '');
    this.active = $e.active;

    const data = this.dataSource.slice();
    if (!$e.active || $e.direction === '') {
      this.dataSource = data;
      return;
    }
    this.dataSource = data.sort((a, b) => {
      const isAsc = $e.direction === 'asc';
      switch ($e.active) {
        case $e.active:
          return compare(a[`${$e.active}`], b[`${$e.active}`], isAsc);
        default:
          return 0;
      }
    });
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

  public searchFacet(column: any) {
    let distances = {};
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
      invert: true,
    });
    this.selectedIndex = 0;
  }

  public inputFilter(column: any) {
    this.lpviLped.itemsObservables$.next({
      type: 'input',
      isMinimize: false,
      head: column,
      value: '',
      invert: true,
      sensitive: false,
      complete_string: false,
    });
    this.selectedIndex = 0;
  }
  public searchReplace(column: any) {
    this.lpviLped.searchReplace$.next({
      type: 'search_replace',
      isMinimize: false,
      head: column,
    });
    this.selectedIndex = 3;
  }

  public dateFilter(column: any) {
    this.lpviLped.itemsObservables$.next({
      type: 'datefilter',
      isMinimize: false,
      head: column,
      value: '',
    });
  }

  public numericFacter(column: any) {
    this.selectedIndex = 0;

    const result = this.dataViews.reduce(
      (item, value) => {
        if (Number.isInteger(Number(value[column])) === true) {
          if (item.minNumber > value[column]) item.minNumber = value[column];
          if (item.maxNumber < value[column]) item.maxNumber = value[column];
        }
        return item;
      },
      {
        maxNumber: this.dataViews[0][column],
        minNumber: this.dataViews[0][column],
      }
    );

    if (
      result.minNumber &&
      result.maxNumber &&
      typeof result.minNumber == 'number' &&
      typeof result.maxNumber == 'number'
    ) {
      const options: Options = {
        floor: Math.trunc(result.minNumber),
        ceil: Math.trunc(result.maxNumber),
        hidePointerLabels: true,
        hideLimitLabels: true,
        draggableRange: true,
        showSelectionBar: true,
      };

      this.lpviLped.itemsObservables$.next({
        type: 'numeric',
        isMinimize: false,
        head: column,
        minValue: result.minNumber,
        maxValue: result.maxNumber,
        options: options,
        invert: true,
      });
    } else this.notifs.info(`${column} is not a type Number`);
  }

  public timeLineFacter(column: any): void {
    this.selectedIndex = 0;

    const result = this.dataViews.reduce(
      (item, value) => {
        if (item.minDate > value[column]) item.minDate = value[column];
        if (item.maxDate < value[column]) item.maxDate = value[column];
        return item;
      },
      {
        maxDate: this.dataViews[0][column],
        minDate: this.dataViews[0][column],
      }
    );

    if (
      result.maxDate &&
      result.minDate &&
      result?.maxDate.toString().length == 25 &&
      result?.minDate.toString().length == 25
    ) {
      this.lpviLped.itemsObservables$.next({
        type: 'timeLine',
        isMinimize: false,
        head: column,
        startDate: result?.minDate,
        endDate: result?.maxDate,
        invert: true,
      });
    } else this.notifs.info(`${column} is not a type DateTime`);
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
            header: [],
          },
          actualydata
        )
        .subscribe((res) => {
          this.listNameHistory.push(res);
        });
      this.ActualyData = null;
    }
    this.CountCell = 0;
    this.testConverter = true;
    this.selectedIndex = 1;
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
    this.nameHeader.forEach((value, index) => {
      let textValue = value['_elementRef'].nativeElement.innerText;
      if (textValue !== newHeader[index].trim())
        value['_elementRef'].nativeElement.innerText = newHeader[index].trim();
    });
  }

  getAllDataByListName(value) {
    this.lpviLped.isLoading$.next(true); // enable loading spinner
    this.ActualyData = value;
    this.idHeader = value.idHeader;
    this.lpViewer.getOnedateHistory(value).subscribe((response) => {
      const header = JSON.parse(
        JSON.stringify(response[1]['nameUpdate'].split('"').join(''))
      ).split(',');

      this.updateDisplaycolumn(header);
      this.idHeader = response[1]['idHeader'];
      let min = this.paginator.pageIndex * this.paginator.pageSize;
      let max = (this.paginator.pageIndex + 1) * this.paginator.pageSize;

      this.dataViews = response[0];
      this.dataSourceFilter = this.dataFilters(response[0]);
      this.dataSource = this.dataSourceFilter.slice(min, max);
    });
    this.lpviLped.isLoading$.next(false); // disable loading spinner
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
                  fileData: this.dataSource,
                  idHeader: this.idHeader,
                  header: [],
                },
                actualy
              )
              .subscribe((res) => {
                this.listNameHistory.push(res);
              });
          }
        })
      )
      .subscribe();
  }

  private dataFilters(data: any[]) {
    return data.filter((_, index) => this.checkFiltesData(index));
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

  onChangeEventFilterStartAndFlag() {
    const first = this.formfilterStart.value.first;
    const second = this.formfilterStart.value.second;
    if (first && second) {
      this.dataSourceFilter = this.dataViews.filter(
        (value) => value.star === true && value.flag === true
      );
    } else if (!first && !second) {
      this.dataSourceFilter = this.dataViews;
    } else {
      if (first && !second) {
        this.dataSourceFilter = this.dataViews.filter(
          (value) => value.star === true
        );
      } else if (!first && second) {
        this.dataSourceFilter = this.dataViews.filter(
          (value) => value.flag === true
        );
      }
    }

    this.lpviLped.dataSources$.next(this.dataSourceFilter);
  }

  removeAppSearch($item) {
    this.Columns_replace = undefined;
  }
}
