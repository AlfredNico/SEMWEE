import { UpdatesHeaderComponent } from './updates-header.component';
import { HeaderOptionsComponent } from './header-options.component';
import { LpViwersService } from './../../../services/lp-viwers.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
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
import { style } from '@angular/animations';
// import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

@Component({
  selector: 'app-viwer-read-import',
  templateUrl: './viwer-read-import.component.html',
  styleUrls: ['./viwer-read-import.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getCustomPaginatorIntl() },
  ],
})
export class ViwerReadImportComponent
  implements OnInit, AfterViewInit, OnChanges {
  displayedColumns: string[] = [];
  edidtableColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  // public formGroup = new FormGroup({});
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
  top = 0;
  left = null;
  right = null;
  public domTab: any;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private lpViewer: LpViwersService,
    public senitizer: DomSanitizer,
    // private readonly lpviLped: LpdLpdService,
  ) { }

  ngOnChanges(): void {
    // console.log('Okokokoko');
    if (this.dataAfterUploaded != undefined) {
      // console.log('lViewerReadImport : ', this.dataAfterUploaded);
      // console.log(' cnhange: ', this.nameHeader);
      // this.nameHeader.forEach((value, index) => {
      //   let textValue = value['_elementRef'].nativeElement.innerText;
      //   console.log(textValue);
      //   // if (textValue !== newHeader[index].trim()) {
      //   // value['_elementRef'].nativeElement.innerText = newHeader[index].trim();
      // });
      if (
        (this.dataAfterUploaded[0] && this.dataAfterUploaded[1]) !== undefined
      ) {
        // console.log('first ', this.dataAfterUploaded[0][0]['nameUpdate']);
        const header = JSON.parse(
          JSON.stringify(
            this.dataAfterUploaded[0][0]['nameUpdate'].split('"').join('')
          )
        ).split(',');
        // console.log('after ', header);

        const editableColumns = JSON.parse(
          JSON.stringify(
            this.dataAfterUploaded[0][0]['nameUpdate'].split('"').join('')
          )
        ).split(',');
        const values = this.dataAfterUploaded[1];
        header.unshift('all');
        editableColumns.unshift('all');

        console.log('header : ', header);
        console.log('this.displayedColumns : ', this.displayedColumns);
        this.displayedColumns = header;
        this.edidtableColumns = editableColumns;
        // this.dataSource.data = this.checkFilter(values);
        this.dataSource.data = this.dataViews = values;
        this.listNameHistory = this.dataAfterUploaded[4];

        if (this.filtersData.items !== undefined) {
          this.formGroup = this.fb.group(
            JSON.parse(this.dataAfterUploaded[2][0]['value'])
          );
          this.items = this.filtersData['items'];
          this.lpViewer.itemsObservables$.next(this.filtersData['items']);
        }
      } else {
        // console.log(this.dataAfterUploaded);
        this.displayedColumns = this.dataAfterUploaded['header'];
        this.edidtableColumns = this.displayedColumns;
        this.dataSource.data = this.dataAfterUploaded['content'];
        this.dataViews = this.dataAfterUploaded['content'];
        this.listNameHistory = this.dataAfterUploaded['name'];
      }
    }
    this.lpViewer.checkInfoSubject$.next();
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.lpViewer.dataSources$.subscribe((res) => {
      if (res) {
        this.dataSource.data = res;
        console.log(res);
        // console.log('okokook oooooooooooooooooooo');
      }
    });
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

  // --------------------------------------------------------------------------- //
  sortData($e: any) {
    $e.direction === 'asc'
      ? (this.icon = 'asc')
      : $e.direction === 'desc'
        ? (this.icon = 'desc')
        : (this.icon = '');
    this.active = $e.active;
  }

  public textFacet(column: any) {
    let distances = {};
    // isExist = false;
    this.dataViews.map((item: any) => {
      distances[item[column]] = (distances[item[column]] || 0) + 1;
    });

    const value = Object.entries(distances).map((val: any) => {
      return { ...val, include: false };
    });

    this.lpViewer.itemsObservables$.next({
      type: 'facet',
      isMinimize: false,
      head: column,
      content: value,
    });
    // }
  }

  public textFilter(column: any) {
    this.lpViewer.itemsObservables$.next({
      type: 'filter',
      isMinimize: false,
      head: column,
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

    console.log('id Header actuelle : ', this.idHeader);
    console.log('Data actuelle : ', this.dataSource.data);
    let header_now = [];
    this.lpViewer
      .getHeaderExport(this.idProject, this.idHeader)
      .subscribe((res) => {
        // console.log(res);
        if (res) {
          header_now = res[0]['nameUpdate'].split(',');
          const tabnewObject = [];
          this.dataSource.data.forEach((valueObject) => {
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

  private checkFilter(val: any[]): any[] {
    if (this.filtersData !== undefined) {
      const length1 = this.filtersData['facetQueries']?.length;
      const length2 = this.filtersData['searchQueries']?.length;

      const dataFilter = val.filter((x: any, i: number) => {
        switch (true) {
          case length1 > 0 && length2 > 0:
            return (
              this.filtersData['facetQueries'][i] &&
              this.filtersData['searchQueries'][i]
            );

          case length1 === 0 && length2 > 0:
            return this.filtersData['searchQueries'][i];

          case length1 > 0 && length2 === 0:
            return this.filtersData['facetQueries'][i];

          case length1 === 0 && length2 === 0:
            return true;
        }
      });
      return dataFilter;
    } else return val;
  }

  public openButton() {
    console.log('open button');
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
    // let distances = {}, isExist = false;
    // this.dataViews.map((item: any) => {
    //   distances[item[column]] = (distances[item[column]] || 0) + 1;
    // })

    // const value = Object.entries(distances).map((val: any) => {
    //   return { ...val, include: false };
    // });

    // this.lpviLped.itemsObservables$.next({
    //   type: 'search',
    //   isMinimize: false,
    //   head: column,
    //   content: value
    // });
  }

  public inputFilter(column: any) {
    // this.lpviLped.itemsObservables$.next({
    //   type: 'input',
    //   isMinimize: false,
    //   head: column,
    //   value: ''
    // });
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


    // this.lpviLped.itemsObservables$.next({
    //   type: 'numeric',
    //   isMinimize: false,
    //   head: column,
    //   minValue: minValue,
    //   maxValue: maxValue,
    //   options: options
    // });
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
  action(value, namecells, index, $event) {
    this.domTab = $event.path[3];
    this.domTab.style.background = '#f3f2f2c7';
    const totaleleft = 41 - $event.offsetX
    this.top = $event.clientY;
    if (window.innerWidth > $event.clientX + 470) {
      // this.left = $event.clientX;
      this.left = $event.clientX + totaleleft + 10;
    } else {
      this.left = $event.clientX - 550;
    }
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
    this.domTab.style.background = 'none';
    this.vueEdit = value[0];
    console.log(this.idHeader);
    if (value[1] === '') {
      console.log('envoye des donnée');
      this.indexRowdata = undefined;
      const name_dinamic = `Edit single cell on row ${this.objectOne[0] + 1
        }, column ${this.nameCells}`;
      const actualydata = this.ActualyData ? this.ActualyData['idName'] : -1;
      if (this.ActualyData) {
        this.listNameHistory.splice(
          this.listNameHistory.indexOf(this.ActualyData) + 1
        );
      }
      this.lpViewer
        .sendFiles(
          {
            namehistory: name_dinamic,
            idProject: this.idProject,
            fileData: this.dataSource.data,
            idHeader: this.idHeader,
          },
          actualydata
        )
        .subscribe((res) => {
          this.listNameHistory.push(res);
        });
      this.ActualyData = null;
    }
  }
  ConcerterToString(newValue) {
    const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;

    if (regex3.exec(newValue) || regex3.exec(this.lastValue)) {
      const regex2 = new RegExp('[-\\/ ]');
      const tab = newValue.split(regex2);
      const tab1 = tab[2].toString().split('T');
      this.dataSource.data.forEach((item) => {
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
      });
    } else {
      this.dataSource.data.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          parseInt(item[this.nameCells]) === parseInt(this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = newValue.toString();
        } else {
        }
      });
    }
  }
  ConverterToNumber(newValue) {
    const parsed = parseInt(newValue);
    if (isNaN(parsed)) {
      alert('not a valid number');
    } else {
      this.dataSource.data.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          (parseInt(item[this.nameCells]) &&
            parseInt(item[this.nameCells]) === this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = parsed;
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
      // console.log(tab);
      this.dataSource.data.forEach((item) => {
        if (item[this.nameCells] === this.lastValue.toString()) {
          item[this.nameCells] = moment(
            `${tab[0]}-${tab[1]}-${tab[2]}`,
            'YYYY-MM-DD',
            true
          ).format();
        }
      });
      // .format('DD'/MM/YYYY);
    } else if (reg.exec(string_date)) {
      const tab = string_date.split(regex2);
      // console.log(tab);
      this.dataSource.data.forEach((item) => {
        if (item[this.nameCells] === this.lastValue.toString()) {
          item[this.nameCells] = moment(
            `${tab[0]}-${tab[1]}-${tab[2]}`,
            'DD-MM-YYYY',
            true
          ).format();
        }
      });
    } else if (regex3.exec(string_date)) {
      // console.log("C'est un objet");
      const tab = string_date.split(regex2);
      const tab1 = tab[2].toString().split('T');
      this.dataSource.data.forEach((item) => {
        if (
          regex3.exec(item[this.nameCells]) &&
          item[this.nameCells].split('T')[0] === this.lastValue.split('T')[0]
        ) {
          // console.log(item[this.nameCells].split('T')[0]);
          item[this.nameCells] = moment(
            `${tab1[0]}-${tab[1]}-${tab[0]}`,
            'DD-MM-YYYY',
            true
          ).format();
        }
      });
    } else {
      alert('format date incorect');
    }
  }
  ConverterToBooleen(newValue) {
    if (newValue != 'true' || !newValue) {
      this.dataSource.data.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          (parseInt(item[this.nameCells]) &&
            parseInt(item[this.nameCells]) === this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = false;
        }
      });
    } else {
      // console.log(newValue);
      // console.log('this.lastValue : ', this.lastValue);
      // console.log('type : ', typeof this.lastValue);
      this.dataSource.data.forEach((item) => {
        if (
          item[this.nameCells] === this.lastValue.toString() ||
          (parseInt(item[this.nameCells]) &&
            parseInt(item[this.nameCells]) === this.lastValue) ||
          item[this.nameCells] === this.lastValue
        ) {
          item[this.nameCells] = true;
        }
      });
    }
  }

  oneObjectfunc(updateObject) {
    if (updateObject[1] === 'string') {
      this.ConcerterToString(updateObject[0]);
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
  otherData(value) {
    console.log(value);
    this.ActualyData = value;
    this.idHeader = value.idHeader;
    this.lpViewer.getOnedateHistory(value).subscribe((response) => {
      const header = JSON.parse(
        JSON.stringify(response[1]['nameUpdate'].split('"').join(''))
      ).split(',');
      // console.log(header);
      this.updateDisplaycolumn(header);
      this.idHeader = response[0]['idHeader'];
      this.dataSource.data = JSON.parse(response[0]['datahistory']);
      console.log('idHeader : ', this.idHeader);
    });
  }
  updateHeader(value) {
    console.log('mea ', value);
    let updateHeader: any;
    let tabforUpdate: any[] = ['All'];
    this.nameHeader.forEach((el, index) => {
      // console.log(typeof el['_elementRef'].nativeElement.innerText);
      tabforUpdate.push(el['_elementRef'].nativeElement.innerText);
      if (index === value - 1) {
        updateHeader = el['_elementRef'].nativeElement;
      }
    });
    // console.log('tab For Update : ', updateHeader);

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
}
