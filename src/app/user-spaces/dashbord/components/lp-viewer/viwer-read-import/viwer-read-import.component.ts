import { LpEditorService } from "@app/user-spaces/dashbord/services/lp-editor.service";
import { UpdatesHeaderComponent } from "./updates-header.component";
import { HeaderOptionsComponent } from "./header-options.component";
import { LpViwersService } from "./../../../services/lp-viwers.service";
import { LPViewerProjectsService } from "@app/user-spaces/dashbord/services/lp-viewer.service";
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    OnChanges,
    ViewChild,
    ViewChildren,
    QueryList,
    OnDestroy,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { map } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularCsv } from "angular7-csv/dist/Angular-csv";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Options } from "@angular-slider/ngx-slider";
import * as moment from "moment";
import { LpdLpdService } from "@app/shared/components/LPVi-LPEd/services/lpd-lpd.service";
import {
    PageEvent,
    Paginator,
} from "@app/user-spaces/dashbord/interfaces/paginator";
import { ResizeEvent } from "angular-resizable-element";
import { of } from "rxjs";
import { NotificationService } from "@app/services/notification.service";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { ValidTableHeaderLpViewer } from "@app/classes/valid-table-header-lp-viewer";
import { toInteger } from "@app/_metronic/core";

//filter data
function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
    selector: "app-viwer-read-import",
    templateUrl: "./viwer-read-import.component.html",
    styleUrls: ["./viwer-read-import.component.scss"],
})
export class ViwerReadImportComponent
    implements AfterViewInit, OnChanges, OnInit, OnDestroy {

    paginationInfo;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    // Test states
    EmitResult = {
      pageNumber: '',
      pageSize: ''
    };

    testPaginator = {
      length: 1000,
      pageSize: 10,
      pageIndex: 1
    };


    // states
    tableData;
    setPageSizeOptions = (setPageSizeOptionsInput: string) => {
      if (setPageSizeOptionsInput) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
      }
    }
    
    displayedColumns: string[] = [];
    edidtableColumns: string[] = [];
    dataSource: any = [];
    dataSourceTotal: any = [];

    /* VARIABLES */
    private queries = {};
    /* ALL QUERY FILTERS VALUES */
    private inputQueries: boolean[] = [];
    private searchQueries: boolean[] = [];
    private numericQeury: boolean[] = [];
    private timeLineQeury: boolean[] = [];
    private queriesNumerisFilters = {};
    private queriesTimeLineFilters = {};

    @ViewChild(MatSort) sort: MatSort;
    @ViewChildren("updateHeader") nameHeader: QueryList<ElementRef>;
    @ViewChild("btnbutton") MyDOMElement: ElementRef;
    selectedIndex = 0;

    @Input("idProject") idProject = undefined;
    @Input("filtersData") filtersData: {
        items: any;
        facetQueries: any;
        searchQueries: any;
    } = undefined;

    @Input("dataAfterUploaded") dataAfterUploaded: any = undefined;
    @Input("inputFilters") inputFilters: any = undefined;
    @ViewChild("container") container: ElementRef;
    @Input() isFavorate: boolean = false;

    public projectName: string = "";

    formfilterStart = new FormGroup({
        first: new FormControl(false),
        second: new FormControl(false),
    });
    public syncData$ = of(false);
    public isLooading: boolean = true;
    public dataSourceFilterStart = [];
    public tabIndex = 0;
    public icon = "";
    public active: any = "";
    public undoRedoLabel = "Undo/Redo 0/0";
    public dataViews: any[] = [];
    public dataSourceFilter: any[] = [];
    public paginator: Paginator;
    private isFiltered = false;
    public formGroup = this.fb.group({});
    public items: any[] = [];
    public test: boolean = undefined;

    public vueEdit: boolean = false;
    public nameCells;
    public lastValue;
    public objectOne: any;
    public selected = "string";
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
    public tab: any[];
    public ws: any;
    public isloadingHistory = false;

    public link: string = "";
    public linkId: string;
    public testLink: boolean = false;
    public testLinkcopied: boolean = false;
    public copyString = "This text needs to copied.";
    public value: any;

    pageEvent: PageEvent;
    pageIndex:number;
    pageSize:number;
    length:number;
    Columns_replace: String;

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private lpViewer: LpViwersService,
        private LPViewerProjestService: LPViewerProjectsService,
        public senitizer: DomSanitizer,
        private readonly lpviLped: LpdLpdService,
        private readonly lpEditor: LpEditorService,
        private notifs: NotificationService
    ) {
        this.getPageDetails(); }

    ngOnInit(): void {
        if (Object.keys(this.lpviLped.permaLink).length !== 0) {
            this.inputQueries = this.lpviLped.permaLink["input"];
            this.searchQueries = this.lpviLped.permaLink["search"];
            this.numericQeury = this.lpviLped.permaLink["numeric"];
            this.items = this.lpviLped.permaLink["items"];
            this.queries = this.lpviLped.permaLink["queries"];
            this.queriesNumerisFilters =
                this.lpviLped.permaLink["queriesNumerisFilters"];
            this.queriesTimeLineFilters =
                this.lpviLped.permaLink["queriesTimeLineFilters"];
        }
        this.selectedIndex = 1;
        this.getPageDetails();
    }
    ngOnChanges(): void {
        if (this.dataAfterUploaded != undefined) {
            this.lpviLped.itemsObservables$.next(undefined);
            this.lpviLped.isLoading$.next(false);

            if (Object.keys(this.dataAfterUploaded).length === 7) {
                console.log("In Viewer : ", this.dataAfterUploaded);
                this.displayedColumns = this.dataAfterUploaded["headerOrigin"];
                this.dataViews = this.dataAfterUploaded["data"];
                this.projectName = this.dataAfterUploaded["projectName"];
                this.lpViewer.idFilter$ = this.dataAfterUploaded["name"].pop();
                this.lpViewer.idProject$ = this.dataAfterUploaded["name"].pop();
                if (this.dataAfterUploaded["idname"])
                    this.indexRowdata =
                        this.dataAfterUploaded["idname"]["idname"];
                console.log(
                    "IndexRows : ",
                    this.indexRowdata,
                    "data idname : ",
                    this.dataAfterUploaded["idname"]
                );
                this.listNameHistory = this.dataAfterUploaded["name"];
                console.log("id filter actuell : ", this.lpViewer.idFilter$);
                this.items = this.lpviLped.permaLink.items;
                Object.values(this.lpviLped.permaLink).map((x) => {
                    if (Array.isArray(x) === true)
                        if ((x as any[]).length != 0) this.isFiltered = true;
                        else if (Object.keys(x).length !== 0)
                            this.isFiltered = true;
                });

                if (this.isFiltered == true) {
                    this.dataSourceFilter = this.dataFilters(this.dataViews);
                    this.dataSource = this.dataSourceFilter?.slice(0, 10);
                } else {
                    this.dataSourceFilter = this.dataViews;
                    this.dataSource = this.dataSourceFilter?.slice(0, 10);
                }
                this.isLooading = false;
                this.projectName = this.dataAfterUploaded["projectName"];
            } else {
                this.items = [];
                setTimeout(() => {
                    console.log("avant readCsvFile");
                    this.readCsvFile(
                        this.dataAfterUploaded["file"],
                        this.dataAfterUploaded["idProject"]
                    );
                    console.log("après readCsvFile");

                    this.projectName = this.dataAfterUploaded["projectName"];
                }, 500);
                this.listNameHistory = [
                    {
                        idName: 0,
                        name: "Create project",
                        idProject: this.dataAfterUploaded["idProject"],
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
        return content.split("\n");
    }

    private readFileContent(file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    }

    private customSplit(chaine: string, delimiter: string): any[] {
        let test = false;
        let souschaine = "";
        let tab = [];
        let i = 0;

        for (let index = 0; index < chaine.length; index++) {
            if (chaine[index] == '"') {
                test = true;
                i++;
            } else if (i == 2) {
                i = 0;
                test = false;
            }
            if (chaine[index] == "," && !test) {
                tab.push(souschaine);
                souschaine = "";
            } else
                souschaine =
                    chaine[index] === '"'
                        ? souschaine + ""
                        : souschaine + chaine[index];
        }
        tab.push("vide\r");
        return tab;
    }
    private readCsvFile(file: File, idProject: any) {
        this.readFileContent(file)
            .then((csvContent) => {
                try {
                    // const csv = [];
                    const csv1 = [];
                    const lines = this.processCsv(csvContent);
                    const sep1 = lines[0].split(";").length;
                    const sep2 = lines[0].split(",").length;
                    const csvSeparator = sep1 > sep2 ? ";" : ",";

                    lines.forEach((element) => {
                        if (csvSeparator === ",") {
                            const cols1: string[] = this.customSplit(
                                element,
                                csvSeparator
                            );
                            console.log("cols1 :", cols1);
                            csv1.push(cols1);
                        } else {
                            const cols: string[] = element.split(csvSeparator);
                            console.log("cols :", cols);
                            csv1.push(cols);
                        }
                    });

                    console.log("csv1 :", csv1);
                    const parsedCsv = csv1;
                    parsedCsv.pop();
                    setTimeout(() => {
                        const header = parsedCsv.shift().toString().split(",");
                        console.log("header : ", header);
                        this.displayedColumns = [
                            ...new Set([...header]),
                        ].filter(
                            (item) =>
                                item != undefined &&
                                item != "" &&
                                item != "vide\r"
                        );
                        setTimeout(async () => {
                            try {
                                console.log(
                                    "displayedColumns : ",
                                    this.displayedColumns
                                );
                                const resultHeader =
                                    await new ValidTableHeaderLpViewer(
                                        header
                                    ).generateValidHeader();

                                console.log("resultHeader : ", resultHeader);
                                if (resultHeader == false) {
                                    window.location.href =
                                        "/user-space/all-lp-viewer-projects";

                                    this.LPViewerProjestService.deleteProjects(
                                        this.idProject
                                    ).subscribe((result) => {
                                        if (result && result.message) {
                                            this.lpviLped.isLoading$.next(
                                                false
                                            );
                                            // alert(result.message);
                                            // this.LPViewerProjestService.refresh$.next(true);
                                            // this.LPViewerProjestService.trigrer$.next(true);
                                        }
                                        this.lpviLped.isLoading$.next(false);
                                    });

                                    // window.location.reload;
                                    // alert( 'The project is not created' );
                                } else {
                                    // window.location.href =
                                    //     "/user-space/all-lp-viewer-projects";
                                    const content = parsedCsv.map(
                                        (value, indexMap) =>
                                            value.reduce(
                                                (tdObj, td, index) => {
                                                    tdObj[header[index]] = td;
                                                    return tdObj;
                                                },
                                                {
                                                    star: false,
                                                    flag: false,
                                                    index: indexMap + 1,
                                                }
                                            )
                                    );
                                    this.displayedColumns.unshift("all");
                                    this.dataSourceTotal = this.dataViews = this.dataSourceFilter =
                                        content;
                                    this.dataSource =
                                        this.dataSourceFilter.slice(0, 10);
                                    this.isLooading = false;
                                    const permalink = {
                                        idProject: this.idProject,
                                        value: JSON.stringify({
                                            input: [],
                                            search: [],
                                            numeric: [],
                                            items: [],
                                            queries: {},
                                            queriesNumerisFilters: {},
                                        }),
                                    };
                                    this.lpEditor
                                        .addFilter(
                                            permalink,
                                            undefined,
                                            "ajout",
                                            this.idProject
                                        )
                                        .subscribe((idFilter) => {
                                            console.log(idFilter);
                                            this.lpViewer
                                                .sendFiles(
                                                    {
                                                        namehistory:
                                                            "Create project",
                                                        idProject: idProject,
                                                        fileData:
                                                            this.dataViews,
                                                        idHeader: 0,
                                                        header: this
                                                            .displayedColumns,
                                                    },
                                                    0,
                                                    idFilter["message"]
                                                )
                                                .subscribe((data) => {
                                                    // console.log(data)
                                                    this.lpViewer.idProject$ =
                                                        data["idProject"];
                                                    this.lpViewer.idFilter$ =
                                                        data["idfilter"];
                                                });
                                        });
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }, 500);
                    }, 500);
                } catch (e) {
                    console.log(e);
                }
            })
            .catch((error) => console.log(error));
    }

    public getServerData(event?: PageEvent){
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
        // this.datasource = response.data;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.length = lenghtPage;

        // this.EmitResult =  {
        //     pageNumber: event.pageIndex,
        //     pageSize: event.pageSize
        // };

        return event;
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
            queriesTimeLineFilters: {},
        };
    }

    ngAfterViewInit() {
        this.lpViewer.isloadingHistory.subscribe((res) => {
            this.isloadingHistory = res ? true : false;
        });
        this.lpviLped.searchReplace$.subscribe((value) => {
            if (value !== undefined) {
                this.Columns_replace = value["head"];
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
            this.ws = 423;
        }, 0);

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
                width: "70%",
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
        const permalink = {
            idProject: this.lpViewer.idProject$,
            value: JSON.stringify({
                input: this.lpviLped.permaLink.input,
                search: this.lpviLped.permaLink.search,
                numeric: this.lpviLped.permaLink.numeric,
                items: this.lpviLped.permaLink.items,
                queries: this.lpviLped.permaLink.queries,
                queriesNumerisFilters:
                    this.lpviLped.permaLink.queriesNumerisFilters,
            }),
        };
        this.lpEditor
            .addFilter(
                permalink,
                this.lpViewer.idFilter$,
                "ajout",
                this.lpViewer.idProject$
            )
            .subscribe((res) => {
                if (res["message"] != "update successfull") {
                    this.lpViewer.idFilter$ = res["message"];
                    console.log("id Filter After : ", this.lpViewer.idFilter$);
                    this.savedata(name_dinamic);
                    this.selectedIndex = 1;
                }
            });
    }

    updateStart(value, indice, nameUpdate) {
        this.lpViewer.isloadingHistory.next(true);
        let name_dinamic;

        if (nameUpdate === "Star") {
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
        const permalink = {
            idProject: this.lpViewer.idProject$,
            value: JSON.stringify({
                input: this.lpviLped.permaLink.input,
                search: this.lpviLped.permaLink.search,
                numeric: this.lpviLped.permaLink.numeric,
                items: this.lpviLped.permaLink.items,
                queries: this.lpviLped.permaLink.queries,
                queriesNumerisFilters:
                    this.lpviLped.permaLink.queriesNumerisFilters,
            }),
        };

        console.log("permalink before : ", this.lpviLped.permaLink);
        console.log("id Filter before : ", this.lpViewer.idFilter$);
        this.lpEditor
            .addFilter(
                permalink,
                this.lpViewer.idFilter$,
                "ajout",
                this.lpViewer.idProject$
            )
            .subscribe((res) => {
                if (res["message"] != "update successfull") {
                    this.lpViewer.idFilter$ = res["message"];
                    console.log("id Filter After : ", this.lpViewer.idFilter$);
                    this.savedata(name_dinamic);
                    this.selectedIndex = 1;
                }
            });
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
                actualydata,
                this.lpViewer.idFilter$
            )
            .subscribe((res) => {
                this.listNameHistory.push(res);
                this.lpViewer.isloadingHistory.next(false);
            });
        this.ActualyData = null;
    }

    public openEditColumn(columnName: string) {
        const index = this.displayedColumns.indexOf(columnName);
        this.dialog
            .open(UpdatesHeaderComponent, {
                data: {
                    index,
                    idHeader: this.dataAfterUploaded[0][0]["_id"],
                    edidtableColumns: this.edidtableColumns,
                },
            })
            .afterClosed();
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
    }

    public sortData($e: any) {
        $e.direction === "asc"
            ? (this.icon = "asc")
            : $e.direction === "desc"
                ? (this.icon = "desc")
                : (this.icon = "");
        this.active = $e.active;

        const data = this.dataSource.slice();
        if (!$e.active || $e.direction === "") {
            this.dataSource = data;
            return;
        }
        this.dataSource = data.sort((a, b) => {
            const isAsc = $e.direction === "asc";
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
            case column.toLowerCase().includes("idproject"):
            case column.toLowerCase().includes("_id"):
            case column.toLowerCase().includes("_v"):
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
            fieldSeparator: ";",
            quoteStrings: '"',
            decimalseparator: ".",
            headers: [],
        };

        let header_now = [];
        this.lpViewer
            .getHeaderExport(this.idProject, this.idHeader)
            .subscribe((res) => {
                if (res) {
                    header_now = res[0]["nameUpdate"].replace("\r", "").split(",");
                    const tabnewObject = [];
                    console.log("dataSourceFilter : ", this.dataSourceFilter);
                    this.dataSourceFilter.forEach((valueObject) => {
                        const object = {};
                        header_now.forEach((key) => {
                            object[key] = valueObject[key];
                        });
                        tabnewObject.push(object);
                    });
                    console.log('tabnewObject : ', tabnewObject);
                    console.log('header_now : ', header_now);
                    csvOptions.headers = header_now;

                    new AngularCsv(
                        tabnewObject,
                        res[1]["nameProject"],
                        csvOptions
                    );
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
            type: "search",
            isMinimize: false,
            head: column,
            content: value,
            invert: true,
            type_filter: "modif",
        });
        this.selectedIndex = 0;
    }

    public inputFilter(column: any) {
        this.lpviLped.itemsObservables$.next({
            type: "input",
            isMinimize: false,
            head: column,
            value: "",
            invert: true,
            sensitive: false,
            complete_string: false,
            type_filter: "modif",
        });
        this.selectedIndex = 0;
    }
    public searchReplace(column: any) {
        this.lpviLped.searchReplace$.next({
            type: "search_replace",
            isMinimize: false,
            head: column,
            type_filter: "modif",
        });
        this.selectedIndex = 3;
    }

    public dateFilter(column: any) {
        this.lpviLped.itemsObservables$.next({
            type: "datefilter",
            isMinimize: false,
            head: column,
            value: "",
            type_filter: "modif",
        });
    }

    allDataIsAnumber(value: any[], nameCells: string, type: string) {
        let test = true;
        let testType = "";
        let i = 0;
        let i2 = 0;
        let index = 0;
        if (type === "number") {
            while (value.length > i && i2 <= 1) {
                if (!/^[0-9]+[\.,]?[0-9]*$/.test(value[i][nameCells].trim())) {
                    test = false;
                    i2++;
                    if (i2 <= 1) {
                        index = i;
                    }
                }
                if (typeof value[i][nameCells] === "string")
                    testType = "string";
                i++;
            }
        } else {
            const regex0 =
                /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
            const regex1 =
                /^\d{4}[-\\/](((0)[0-9])|((1)[0-2]))[-\\/]([0-2][0-9]|(3)[0-1])$/;
            const regex3 =
                /^\d{4}[-\\/](((0)[0-9])|((1)[0-2]))[-\\/]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
            while (value.length > i && i2 <= 1) {
                if (
                    !regex1.test(value[i][nameCells]) &&
                    !regex3.test(value[i][nameCells]) &&
                    !regex0.test(value[i][nameCells])
                ) {
                    test = false;
                    i2++;
                    if (i2 <= 1) {
                        index = i;
                    }
                }
                if (
                    regex1.test(value[i][nameCells]) ||
                    regex0.test(value[i][nameCells])
                )
                    testType = "string";
                i++;
            }
        }
        return [test, testType, i, i2, index];
    }

    public numericFacter(column: any) {
        let test = this.allDataIsAnumber(this.dataViews, column, "number");
        let line = toInteger(test[4]) + 1;
        console.log("test[0] : ", test[0]);
        console.log("test[3] : ", test[3]);
        if (!test[0] && test[3] <= 1) {
            console.log("choix 1");
            alert("There is an invalid number on line " + line);
        } else if (!test[0] && test[3] > 1) {
            console.log("choix 2");
            alert("There is an invalid number on line " + line + " and other line");
        } else if (test[0] && test[1] === "string") {
            this.dataViews.forEach((item) => {
                const replace =
                    typeof item[column] === "string"
                        ? item[column].replace(",", ".")
                        : item[column];
                const parsed = parseFloat(replace);
                if (typeof item[column] === "string") {
                    if (!isNaN(parsed)) {
                        item[column] = parsed;
                        this.CountCell++;
                    }
                }
            });
            const names = `Update on ${this
                .CountCell++} cells in column ${column}: value.toNumber()`;
            this.tab = [false, "", names];
            console.log("testetestset : ", this.lpviLped.permaLink);

            const permalink = {
                idProject: this.idProject,
                value: JSON.stringify({
                    ...this.lpviLped.permaLink,
                    input: [],
                    search: [],
                    numeric: [],
                    items: [],
                    queries: {},
                    queriesNumerisFilters: {},
                }),
            };
        }
        if (test[0]) {
            let minValue = 100000,
                maxValue = 0;
            this.dataViews.map((item: any) => {
                if (Number.isInteger(Number(item[column])) === true) {
                    if (Number(item[column]) >= maxValue)
                        maxValue = Number(item[column]);
                    if (Number(item[column]) <= minValue)
                        minValue = Number(item[column]);
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
                type: "numeric",
                isMinimize: false,
                head: column,
                minValue: minValue,
                maxValue: maxValue,
                min: minValue,
                max: maxValue,
                options: options,
                invert: true,
                type_filter: "ajout",
            });
            this.selectedIndex = 0;
        }
    }

    public timeLineFacter(column: any): void {
        let test = this.allDataIsAnumber(this.dataViews, column, "date");
        let line = toInteger(test[4]) + 1;

        if (!test[0] && test[3] <= 1) {
            alert("There is an invalid date in line " + line);
        } else if (!test[0] && test[3] > 1) {
            alert("There is an invalid date in line " + line + " and other line");
        } else if (test[0] && test[1] === "string") {
            console.log(test);
            const regex1 =
                /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
            const regex0 =
                /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
            const regex2 = new RegExp("[-\\/]");
            this.dataViews.forEach((item) => {
                if (regex1.test(item[column])) {
                    const tab = item[column].split(regex2);
                    // console.log(tab)
                    item[column] = moment(
                        `${tab[2]}-${tab[1]}-${tab[0]}`,
                        "YYYY-MM-DD",
                        true
                    ).format("YYYY-MM-DD");
                } else if (regex0.test(item[column])) {
                    const tab = item[column].split(regex2);
                    // console.log(tab)
                    item[column] = moment(
                        `${tab[0]}-${tab[1]}-${tab[2]}`,
                        "YYYY-MM-DD",
                        true
                    ).format("YYYY-MM-DD");
                }
            });
            this.dataViews.forEach((item) => {
                const tab = item[column].split(regex2);
                if (
                    /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/.test(
                        item[column]
                    )
                ) {
                    item[column] = moment(
                        `${tab[0]}-${tab[1]}-${tab[2]}`,
                        "YYYY-MM-DD",
                        true
                    ).format();
                    this.CountCell++;
                } else {
                    const tab1 = tab[2].toString().split("T");
                    item[column] = moment(
                        `${tab1[0]}-${tab[1]}-${tab[0]}`,
                        "DD-MM-YYYY",
                        true
                    ).format();
                    this.CountCell++;
                }
            });
            const names = `Update on ${this
                .CountCell++} cells in column ${column}: value.toDate()`;
            this.tab = [false, "", names];
        }
        //--------END CONVERTION-----

        //--------FILTER DATE ----------
        if (test[0]) {
            const result = this.dataViews.reduce(
                (item, value) => {
                    if (item.minDate > value[column])
                        item.minDate = value[column];
                    if (item.maxDate < value[column])
                        item.maxDate = value[column];
                    return item;
                },
                {
                    maxDate: this.dataViews[0][column],
                    minDate: this.dataViews[0][column],
                }
            );

            this.lpviLped.itemsObservables$.next({
                type: "timeLine",
                isMinimize: false,
                head: column,
                startDate: result?.minDate,
                endDate: result?.maxDate,
                min: result?.minDate,
                max: result?.maxDate,
                invert: true,
                type_filter: "ajout",
            });

            this.selectedIndex = 0;
        }
        // this.toggleedit(tab);
        // this.CountCell = 0;
        //------------END FILTER---------------
    }

    tooglevueEdit($event) {
        this.vueEdit = false;
    }

    positionPopup($event) {
        let i = 0;
        while (true) {
            if ($event.path[i].nodeName === "TD") {
                this.domTab = $event.path[i];
                break;
            }
            i++;
        }
        this.domTab.style.fontWeight = "normal";
        // this.domTab.style.fontColor = "blue";
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
            this.selected = "object";
        } else {
            this.selected = typeof value[namecells];
        }
        this.vueEdit = true;
        this.objectOne = [index, value];
        this.nameCells = namecells;
        this.lastValue = value[namecells];
    }

    toggleedit(value) {
        // console.log("In tooggmo")
        let numbercoll = "";
        console.log(value);
        if (value.length === 2) {
            this.domTab.style.fontWeight = "initial";
            numbercoll =
                this.CountCell === 0
                    ? `Edit single cell on row ${this.objectOne[0] + 1},`
                    : `Mass edit ${this.CountCell} cells in `;
        }
        this.vueEdit = value[0];
        if (value[1] === "" && this.testConverter) {
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
                        idProject: this.lpViewer.idProject$,
                        fileData: this.dataViews,
                        idHeader: this.idHeader,
                        header: [],
                    },
                    actualydata,
                    this.lpViewer.idFilter$
                )
                .subscribe((res) => {
                    this.listNameHistory.push(res);
                    this.lpViewer.isloadingHistory.next(false);
                });
            this.ActualyData = null;
        }
        this.CountCell = 0;
        this.testConverter = true;
        this.selectedIndex = 1;
    }

    editOneValue(value) {
        this.tab = value;
        if (value[1] === "ok") {
            this.vueEdit = false;
            console.log("Cancel");
        } else {
            console.log("send data");
            if (this.test == true || this.test === undefined) this.test = false;
            else this.test = true;
        }
    }
    send_data(value) {
        console.log("test value : ", value);
        this.toggleedit(this.tab);
        this.CountCell = 0;
    }
    ConverterToString(newValue) {
        const regex3 =
            /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;

        if (regex3.exec(newValue) || regex3.exec(this.lastValue)) {
            const regex2 = new RegExp("[-\\/ ]");
            const tab = newValue.split(regex2);
            const tab1 = tab[2].toString().split("T");
            this.dataViews.forEach((item) => {
                if (
                    regex3.exec(item[this.nameCells]) &&
                    item[this.nameCells].split("T")[0] ===
                    this.lastValue.split("T")[0]
                ) {
                    item[this.nameCells] = moment(
                        `${tab[0]}-${tab[1]}-${tab1[0]}`,
                        "YYYY-MM-DD",
                        true
                    ).format("YYYY-MM-DD");
                    this.CountCell++;
                }
            });
        } else {
            this.dataViews.forEach((item) => {
                if (
                    item[this.nameCells] === this.lastValue.toString() ||
                    parseInt(item[this.nameCells]) ===
                    parseInt(this.lastValue) ||
                    item[this.nameCells] === this.lastValue
                ) {
                    item[this.nameCells] = newValue.toString();
                    this.CountCell++;
                }
            });
        }
    }
    filterInt(value) {
        if (/^[0-9]+[\.,]?[0-9]*$/.test(value)) {
            return true;
        } else {
            return false;
        }
    }
    ConverterToNumber(newValue) {
        if (typeof newValue === "string") {
            if (!this.filterInt(newValue.trim())) {
                alert("Not a valid number !");
                this.testConverter = false;
            } else {
                const replace =
                    typeof newValue === "string"
                        ? newValue.replace(",", ".")
                        : newValue;
                const parsed = parseFloat(replace);

                this.dataViews.forEach((item) => {
                    if (
                        item[this.nameCells] === this.lastValue.toString() ||
                        (parseInt(item[this.nameCells]) &&
                            parseInt(item[this.nameCells]) ===
                            this.lastValue) ||
                        item[this.nameCells] === this.lastValue
                    ) {
                        item[this.nameCells] = parsed;
                        this.CountCell++;
                    }
                });
            }
        } else if (typeof newValue === "object") {
            alert("Not a valid number !");
            this.testConverter = false;
        }
    }
    ConverterToDate(newValue) {
        const reg = /^([0-2][0-9]|(3)[0-1])[-](((0)[0-9])|((1)[0-2]))[-]\d{4}$/;
        const reg1 =
            /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/;
        const regex3 =
            /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
        let string_date =
            typeof newValue === "string" ? newValue.trim() : newValue;
        const regex2 = new RegExp("[-]");

        // .format('YYYY/MM/DD');
        if (reg1.exec(string_date)) {
            const tab = string_date.split(regex2);
            this.dataViews.forEach((item) => {
                if (item[this.nameCells] === this.lastValue.toString()) {
                    item[this.nameCells] = moment(
                        `${tab[0]}-${tab[1]}-${tab[2]}`,
                        "YYYY-MM-DD",
                        true
                    ).format();
                    this.CountCell++;
                }
            });
            // .format('DD'/MM/YYYY);
        } else if (reg.exec(string_date)) {
            alert("Make the date in iso format");
            this.testConverter = false;
        } else if (!regex3.exec(string_date)) {
            alert("format date incorrect");
            this.testConverter = false;
        }
        // else {
        //   // alert('format date incorrect');
        //   // this.testConverter = false;
        // }
    }
    ConverterToBooleen(newValue) {
        if (newValue != "true" || !newValue) {
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
        if (updateObject[1] === "string") {
            this.ConverterToString(updateObject[0]);
        } else if (updateObject[1] === "number") {
            this.ConverterToNumber(updateObject[0]);
        } else if (updateObject[1] === "boolean") {
            this.ConverterToBooleen(updateObject[0]);
        } else if (updateObject[1] === "object") {
            this.ConverterToDate(updateObject[0]);
        }
    }

    updateDisplaycolumn(newHeader) {
        this.nameHeader.forEach((value, index) => {
            let textValue = value["_elementRef"].nativeElement.innerText;
            if (textValue !== newHeader[index].trim())
                value["_elementRef"].nativeElement.innerText =
                    newHeader[index].trim();
        });
    }

    getAllDataByListName(value) {
        console.log("test get One list : ", value);
        this.test = undefined;
        this.ActualyData = value;
        this.idHeader = value.idHeader;
        this.lpViewer.getOnedateHistory(value).subscribe((response) => {
            // console.log(JSON.parse(response[2]["value"]));
            // console.log(response[2]["_id"]);
            const header = JSON.parse(
                JSON.stringify(response[1]["nameUpdate"].split('"').join(""))
            ).split(",");
            let ob = JSON.parse(response[2]["value"]);
            this.updateDisplaycolumn(header);
            this.idHeader = response[1]["idHeader"];
            // let min = this.paginator.pageIndex * this.paginator.pageSize;
            let max = (this.paginator.pageIndex + 1) * this.paginator.pageSize;

            this.lpviLped.permaLink = {
                ...this.lpviLped.permaLink,
                ...ob,
            };
            this.items = this.lpviLped.permaLink.items;
            this.lpViewer.idFilter$ = response[2]["_id"];
            this.dataViews = response[0];
            this.dataSourceFilter = this.dataFilters(this.dataViews);
            this.dataSource = this.dataSourceFilter.slice(0, max);
            this.lpViewer.isloadingHistory.next(false);
            this.lpviLped.isLoading$.next(false);

            this.link = `http://localhost:4200/user-space/lp-viewer?idProject=${this.lpViewer.idProject$}&id=${value["idName"]}&idFilter=${this.lpViewer.idFilter$}`;
            this.value = this.link;
        });
    }

    updateHeader(value) {
        let updateHeader: any;
        let tabforUpdate: any[] = ["All"];
        this.nameHeader.forEach((el, index) => {
            tabforUpdate.push(el["_elementRef"].nativeElement.innerText);
            if (index === value - 1) {
                updateHeader = el["_elementRef"].nativeElement;
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
                        const actualy = this.ActualyData
                            ? this.ActualyData["idName"]
                            : -1;
                        if (this.ActualyData) {
                            this.listNameHistory.splice(
                                this.listNameHistory.indexOf(this.ActualyData) +
                                1
                            );
                        }
                        this.idHeader = idHeader;
                        // Rename column RANK(2013) to RANK(2013)24
                        const name_dinamic = `Edit header table on column ${value + 1
                            }`;
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
        const q1 = this.chechQueryFilter(
            index,
            this.lpviLped.permaLink["numeric"]
        );
        const q2 = this.chechQueryFilter(
            index,
            this.lpviLped.permaLink["input"]
        );
        const q3 = this.chechQueryFilter(
            index,
            this.lpviLped.permaLink["search"]
        );

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

    testvalue() {
        console.log(this.lpviLped.permaLink);
        console.log(this.lpViewer.idFilter$);
        console.log("idProject : ", this.lpViewer.idProject$);
    }
    tooltipcustIn() {
        this.testLink = true;
    }
    tooltipcustOut() {
        this.testLink = false;
        this.testLinkcopied = false;
    }
    Linkcopied() {
        this.testLink = false;
        this.testLinkcopied = true;
    }




    onPageEvent = ($event) => {
      this.getData($event.pageIndex, $event.pageSize);
    }

    showTestEmit = ($event) => {
      this.EmitResult =  {
        pageNumber: $event.pageIndex,
        pageSize: $event.pageSize
      };
    }

    getPageDetails = () => {
    //   this.getPageSize().subscribe( res => {
    //     this.paginationInfo = res;
    //     this.getData(0, this.paginationInfo.pageSize);
    //   });
    }

    getData = (pg, lmt) => {
    //   return this.allProjects(pg, lmt).subscribe( res => {
    //     this.tableData = res;
    //   });
    }

    allProjects = (page, limit) => {
    //   return this.httpClient.get(`${this.BASE_URL}/posts?_page=${page + 1}&_limit=${limit}`);
        // return 0;
    }

    getPageSize = () => {
    //   return this.httpClient.get(`${this.BASE_URL}/pageSize`);
        // return 0;
    }
}
