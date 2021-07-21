"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ViwerReadImportComponent = void 0;
var updates_header_component_1 = require("./updates-header.component");
var header_options_component_1 = require("./header-options.component");
var core_1 = require("@angular/core");
var sort_1 = require("@angular/material/sort");
var operators_1 = require("rxjs/operators");
var Angular_csv_1 = require("angular7-csv/dist/Angular-csv");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var rxjs_1 = require("rxjs");
//filter data
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
var ViwerReadImportComponent = /** @class */ (function () {
    function ViwerReadImportComponent(dialog, fb, lpViewer, senitizer, lpviLped, notifs) {
        this.dialog = dialog;
        this.fb = fb;
        this.lpViewer = lpViewer;
        this.senitizer = senitizer;
        this.lpviLped = lpviLped;
        this.notifs = notifs;
        this.displayedColumns = [];
        this.edidtableColumns = [];
        this.dataSource = [];
        this.selectedIndex = 0;
        this.idProject = undefined;
        this.filtersData = undefined;
        this.dataAfterUploaded = undefined;
        this.inputFilters = undefined;
        this.isFavorate = false;
        this.projectName = "";
        this.formfilterStart = new forms_1.FormGroup({
            first: new forms_1.FormControl(false),
            second: new forms_1.FormControl(false)
        });
        this.syncData$ = rxjs_1.of(false);
        this.isLooading = true;
        this.dataSourceFilterStart = [];
        this.tabIndex = 0;
        this.icon = "";
        this.active = "";
        this.undoRedoLabel = "Undo/Redo 0/0";
        this.dataViews = [];
        this.dataSourceFilter = [];
        this.isFiltered = false;
        this.formGroup = this.fb.group({});
        this.items = [];
        this.vueEdit = false;
        this.selected = "string";
        this.listNameHistory = [];
        this.ActualyData = null;
        this.indexRowdata = undefined;
        this.idHeader = 0;
        this.tab_arraw = [];
        this.testConverter = true;
        this.CountCell = 0;
        this.top = 0;
        this.left = null;
        this.isloadingHistory = false;
    }
    ViwerReadImportComponent.prototype.ngOnChanges = function () {
        var _this = this;
        var _a, _b;
        if (this.dataAfterUploaded != undefined) {
            this.lpviLped.itemsObservables$.next(undefined);
            if (Object.keys(this.dataAfterUploaded).length === 6) {
                // console.log(this.dataAfterUploaded)
                this.displayedColumns = this.dataAfterUploaded["headerOrigin"];
                this.dataViews = this.dataAfterUploaded["data"];
                this.listNameHistory = this.dataAfterUploaded["name"];
                this.projectName = this.dataAfterUploaded["projectName"];
                this.items = this.lpviLped.permaLink.items;
                Object.values(this.lpviLped.permaLink).map(function (x) {
                    if (Array.isArray(x) === true)
                        if (x.length != 0)
                            _this.isFiltered = true;
                        else if (Object.keys(x).length !== 0)
                            _this.isFiltered = true;
                });
                if (this.isFiltered == true) {
                    this.dataSourceFilter = this.dataFilters(this.dataViews);
                    this.dataSource = (_a = this.dataSourceFilter) === null || _a === void 0 ? void 0 : _a.slice(0, 10);
                }
                else {
                    this.dataSourceFilter = this.dataViews;
                    this.dataSource = (_b = this.dataSourceFilter) === null || _b === void 0 ? void 0 : _b.slice(0, 10);
                }
                this.isLooading = false;
                this.projectName = this.dataAfterUploaded["projectName"];
            }
            else {
                this.items = []; //set items filters
                setTimeout(function () {
                    _this.readCsvFile(_this.dataAfterUploaded["file"], _this.dataAfterUploaded["idProject"]);
                    _this.projectName = _this.dataAfterUploaded["projectName"];
                }, 500);
                this.listNameHistory = [
                    {
                        idName: 0,
                        name: "Create project",
                        idProject: this.dataAfterUploaded["idProject"]
                    },
                ];
            }
            this.paginator = {
                pageIndex: 0,
                pageSize: 10,
                nextPage: 0,
                previousPageIndex: 1,
                pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
            };
            this.lpviLped.isLoading$.next(false);
        }
    };
    ViwerReadImportComponent.prototype.processCsv = function (content) {
        return content.split("\n");
    };
    ViwerReadImportComponent.prototype.readFileContent = function (file) {
        var reader = new FileReader();
        return new Promise(function (resolve, reject) {
            reader.onload = function (event) { return resolve(event.target.result); };
            reader.onerror = function (error) { return reject(error); };
            reader.readAsText(file);
        });
    };
    ViwerReadImportComponent.prototype.readCsvFile = function (file, idProject) {
        var _this = this;
        this.readFileContent(file)
            .then(function (csvContent) {
            try {
                var csv_1 = [];
                var lines = _this.processCsv(csvContent);
                var sep1 = lines[0].split(";").length;
                var sep2 = lines[0].split(",").length;
                var csvSeparator_1 = sep1 > sep2 ? ";" : ",";
                lines.forEach(function (element) {
                    var cols = element.split(csvSeparator_1);
                    csv_1.push(cols);
                });
                var parsedCsv_1 = csv_1;
                parsedCsv_1.pop();
                setTimeout(function () {
                    var header = parsedCsv_1.shift().toString().split(",");
                    _this.displayedColumns = __spreadArrays(new Set(__spreadArrays(header))).filter(function (item) { return item != undefined && item != ""; });
                    setTimeout(function () {
                        var content = parsedCsv_1.map(function (value, indexMap) {
                            return value.reduce(function (tdObj, td, index) {
                                tdObj[header[index]] = td;
                                return tdObj;
                            }, {
                                star: false,
                                flag: false,
                                index: indexMap + 1
                            });
                        });
                        _this.displayedColumns.unshift("all");
                        _this.dataViews = _this.dataSourceFilter = content;
                        _this.dataSource = _this.dataSourceFilter.slice(0, 10);
                        _this.isLooading = false;
                        _this.lpViewer
                            .sendFiles({
                            namehistory: "Create project",
                            idProject: idProject,
                            fileData: _this.dataViews,
                            idHeader: 0,
                            header: _this.displayedColumns
                        }, 0)
                            .subscribe();
                    }, 500);
                }, 500);
            }
            catch (e) {
                console.log(e);
            }
        })["catch"](function (error) { return console.log(error); });
    };
    ViwerReadImportComponent.prototype.getServerData = function (event) {
        var page = event.pageIndex * event.pageSize;
        var lenghtPage = event.pageSize * (event.pageIndex + 1);
        this.paginator.nextPage = this.paginator.nextPage + event.pageSize;
        this.dataSource = this.dataViews.slice(page, lenghtPage);
        if (this.paginator.pageSize != event.pageSize)
            this.lpviLped.dataPaginator$.next(true);
        this.paginator = __assign(__assign({}, this.paginator), event);
    };
    ViwerReadImportComponent.prototype.ngOnDestroy = function () {
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
    };
    ViwerReadImportComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.lpViewer.isloadingHistory.subscribe(function (res) {
            console.log("test loading valeur : ", res);
            _this.isloadingHistory = res ? true : false;
        });
        this.lpviLped.searchReplace$.subscribe(function (value) {
            if (value !== undefined) {
                _this.Columns_replace = value["head"];
            }
        });
        this.lpviLped.dataSources$.subscribe(function (res) {
            if (res) {
                _this.paginator = __assign(__assign({}, _this.paginator), { pageIndex: 0, nextPage: 0 });
                _this.dataSourceFilter = res;
                _this.dataSource = res.slice(0, _this.paginator.pageSize);
                _this.lpviLped.dataPaginator$.next(true);
            }
        });
        setTimeout(function () {
            var containt = _this.container.nativeElement.offsetWidth / 4;
            _this.ws = containt > 450 ? containt : 450;
        }, 0);
    };
    ViwerReadImportComponent.prototype.onResizeEnd = function (e) {
        this.ws = e.rectangle.width > 450 ? e.rectangle.width : 450;
    };
    ViwerReadImportComponent.prototype.onFavorite = function () {
        this.isFavorate = !this.isFavorate;
    };
    ViwerReadImportComponent.prototype.openTablesOptionns = function () {
        var _this = this;
        this.dialog
            .open(header_options_component_1.HeaderOptionsComponent, {
            data: {
                noHiddenRows: this.displayedColumns,
                hiddenRows: []
            },
            width: "70%"
        })
            .afterClosed()
            .pipe(operators_1.map(function (result) {
            if (result) {
                _this.displayedColumns = result.noHiddenRows;
                _this.lpViewer.postDisplayColums(_this.idProject, _this.idHeader, _this.displayedColumns);
            }
        }))
            .subscribe();
    };
    ViwerReadImportComponent.prototype.update_Search_Replace = function (name_dinamic) {
        this.savedata(name_dinamic);
    };
    ViwerReadImportComponent.prototype.updateStart = function (value, indice, nameUpdate) {
        this.lpViewer.isloadingHistory.next(true);
        var name_dinamic;
        if (nameUpdate === "Star") {
            value.star = value.star ? false : true;
            name_dinamic = value.star
                ? nameUpdate + " row " + indice
                : "Un" + nameUpdate + " row " + indice;
        }
        else {
            value.flag = value.flag ? false : true;
            name_dinamic = value.flag
                ? nameUpdate + " row " + indice
                : "Un" + nameUpdate + " row " + indice;
        }
        this.savedata(name_dinamic);
        this.selectedIndex = 1;
    };
    ViwerReadImportComponent.prototype.savedata = function (name_dinamic) {
        var _this = this;
        var actualydata;
        if (this.ActualyData) {
            this.listNameHistory.splice(this.listNameHistory.indexOf(this.ActualyData) + 1);
            actualydata = this.ActualyData.idName + 1;
        }
        else {
            actualydata = this.listNameHistory.length;
        }
        this.lpViewer
            .sendFiles({
            namehistory: name_dinamic,
            idProject: this.idProject,
            fileData: this.dataViews,
            idHeader: this.idHeader,
            header: []
        }, actualydata)
            .subscribe(function (res) {
            _this.listNameHistory.push(res);
            _this.lpViewer.isloadingHistory.next(false);
        });
        this.ActualyData = null;
    };
    ViwerReadImportComponent.prototype.openEditColumn = function (columnName) {
        var index = this.displayedColumns.indexOf(columnName);
        this.dialog
            .open(updates_header_component_1.UpdatesHeaderComponent, {
            data: {
                index: index,
                idHeader: this.dataAfterUploaded[0][0]["_id"],
                edidtableColumns: this.edidtableColumns
            }
        })
            .afterClosed();
    };
    ViwerReadImportComponent.prototype.tabChanged = function (tabChangeEvent) {
        this.tabIndex = tabChangeEvent.index;
    };
    ViwerReadImportComponent.prototype.sortData = function ($e) {
        $e.direction === "asc"
            ? (this.icon = "asc")
            : $e.direction === "desc"
                ? (this.icon = "desc")
                : (this.icon = "");
        this.active = $e.active;
        var data = this.dataSource.slice();
        if (!$e.active || $e.direction === "") {
            this.dataSource = data;
            return;
        }
        this.dataSource = data.sort(function (a, b) {
            var isAsc = $e.direction === "asc";
            switch ($e.active) {
                case $e.active:
                    return compare(a["" + $e.active], b["" + $e.active], isAsc);
                default:
                    return 0;
            }
        });
    };
    ViwerReadImportComponent.prototype.isColumnDisplay = function (column) {
        switch (true) {
            case column.toLowerCase().includes("idproject"):
            case column.toLowerCase().includes("_id"):
            case column.toLowerCase().includes("_v"):
                return true;
            default:
                return false;
        }
    };
    ViwerReadImportComponent.prototype.isValidURL = function (value) {
        var res = value.match(/(http(s)?:\/\/.)?([A-z]\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (res !== null)
            return true;
        return false;
    };
    ViwerReadImportComponent.prototype.downloadCSV = function () {
        var _this = this;
        var csvOptions = {
            fieldSeparator: ";",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: true,
            showTitle: false,
            useBom: false,
            noDownload: false,
            headers: []
        };
        var header_now = [];
        this.lpViewer
            .getHeaderExport(this.idProject, this.idHeader)
            .subscribe(function (res) {
            if (res) {
                header_now = res[0]["nameUpdate"].split(",");
                var tabnewObject_1 = [];
                _this.dataViews.forEach(function (valueObject) {
                    var object = {};
                    header_now.forEach(function (key) {
                        object[key] = valueObject[key];
                    });
                    tabnewObject_1.push(object);
                });
                csvOptions.headers = header_now;
                new Angular_csv_1.AngularCsv(tabnewObject_1, res[1]["nameProject"], csvOptions);
            }
        });
    };
    ViwerReadImportComponent.prototype.searchFacet = function (column) {
        var distances = {};
        this.dataViews.map(function (item) {
            distances[item[column]] = (distances[item[column]] || 0) + 1;
        });
        var value = Object.entries(distances).map(function (val) {
            return __assign(__assign({}, val), { include: false });
        });
        this.lpviLped.itemsObservables$.next({
            type: "search",
            isMinimize: false,
            head: column,
            content: value,
            invert: true
        });
        this.selectedIndex = 0;
    };
    ViwerReadImportComponent.prototype.inputFilter = function (column) {
        this.lpviLped.itemsObservables$.next({
            type: "input",
            isMinimize: false,
            head: column,
            value: "",
            invert: true,
            sensitive: false,
            complete_string: false
        });
        this.selectedIndex = 0;
    };
    ViwerReadImportComponent.prototype.searchReplace = function (column) {
        this.lpviLped.searchReplace$.next({
            type: "search_replace",
            isMinimize: false,
            head: column
        });
        this.selectedIndex = 3;
    };
    ViwerReadImportComponent.prototype.dateFilter = function (column) {
        this.lpviLped.itemsObservables$.next({
            type: "datefilter",
            isMinimize: false,
            head: column,
            value: ""
        });
    };
    ViwerReadImportComponent.prototype.allDataIsAnumber = function (value, nameCells, type) {
        var test = true;
        var testType = "";
        var i = 0;
        if (type === "number") {
            while (test && value.length > i) {
                if (!/^[0-9]+[\.,]?[0-9]*$/.test(value[i][nameCells])) {
                    test = false;
                }
                if (typeof value[i][nameCells] === "string")
                    testType = "string";
                i++;
            }
        }
        else {
            var regex1 = /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/;
            var regex3 = /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
            while (test && value.length > i) {
                if (!regex1.test(value[i][nameCells]) &&
                    !regex3.test(value[i][nameCells])) {
                    test = false;
                }
                if (regex1.test(value[i][nameCells]))
                    testType = "string";
                i++;
            }
        }
        return [test, testType, i];
    };
    ViwerReadImportComponent.prototype.numericFacter = function (column) {
        var _this = this;
        var test = this.allDataIsAnumber(this.dataViews, column, "number");
        if (!test[0]) {
            alert("there is a invalid number on row " + test[2]);
        }
        else if (test[0] && test[1] === "string") {
            this.dataViews.forEach(function (item) {
                var replace = typeof item[column] === "string"
                    ? item[column].replace(",", ".")
                    : item[column];
                var parsed = parseFloat(replace);
                if (typeof item[column] === "string") {
                    if (!isNaN(parsed)) {
                        item[column] = parsed;
                        _this.CountCell++;
                    }
                }
            });
            var names = "Update on " + this
                .CountCell++ + " cells in column " + column + ": value.toNumber()";
            var tab = [false, "", names];
        }
        if (test[0]) {
            var minValue_1 = 100000, maxValue_1 = 0;
            this.dataViews.map(function (item) {
                if (Number.isInteger(Number(item[column])) === true) {
                    if (Number(item[column]) >= maxValue_1)
                        maxValue_1 = Number(item[column]);
                    if (Number(item[column]) <= minValue_1)
                        minValue_1 = Number(item[column]);
                }
            });
            var options = {
                floor: minValue_1,
                ceil: maxValue_1,
                hidePointerLabels: true,
                hideLimitLabels: true,
                draggableRange: true,
                showSelectionBar: true
            };
            this.lpviLped.itemsObservables$.next({
                type: "numeric",
                isMinimize: false,
                head: column,
                minValue: minValue_1,
                maxValue: maxValue_1,
                min: minValue_1,
                max: maxValue_1,
                options: options,
                invert: true
            });
            this.selectedIndex = 0;
        }
    };
    ViwerReadImportComponent.prototype.timeLineFacter = function (column) {
        var _this = this;
        var test = this.allDataIsAnumber(this.dataViews, column, "date");
        if (!test[0]) {
            alert("There is a date that is not in iso format on row " + test[2]);
        }
        else if (test[0] && test[1] === "string") {
            console.log("commencement de convertion.");
            var regex2_1 = new RegExp("[-]");
            this.dataViews.forEach(function (item) {
                var tab = item[column].split(regex2_1);
                if (/^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/.test(item[column])) {
                    item[column] = moment(tab[0] + "-" + tab[1] + "-" + tab[2], "YYYY-MM-DD", true).format();
                    _this.CountCell++;
                }
                else {
                    var tab1 = tab[2].toString().split("T");
                    item[column] = moment(tab1[0] + "-" + tab[1] + "-" + tab[0], "DD-MM-YYYY", true).format();
                    _this.CountCell++;
                }
            });
            var names = "Update on " + this
                .CountCell++ + " cells in column " + column + ": value.toDate()";
            var tab = [false, "", names];
            this.toggleedit(tab);
        }
        //--------END CONVERTION-----
        //--------FILTER DATE ----------
        if (test[0]) {
            var result = this.dataViews.reduce(function (item, value) {
                if (item.minDate > value[column])
                    item.minDate = value[column];
                if (item.maxDate < value[column])
                    item.maxDate = value[column];
                return item;
            }, {
                maxDate: this.dataViews[0][column],
                minDate: this.dataViews[0][column]
            });
            this.lpviLped.itemsObservables$.next({
                type: "timeLine",
                isMinimize: false,
                head: column,
                startDate: result === null || result === void 0 ? void 0 : result.minDate,
                endDate: result === null || result === void 0 ? void 0 : result.maxDate,
                min: result === null || result === void 0 ? void 0 : result.minDate,
                max: result === null || result === void 0 ? void 0 : result.maxDate,
                invert: true
            });
            this.selectedIndex = 0;
        }
        //------------END FILTER---------------
    };
    ViwerReadImportComponent.prototype.tooglevueEdit = function ($event) {
        this.vueEdit = false;
    };
    ViwerReadImportComponent.prototype.positionPopup = function ($event) {
        var i = 0;
        while (true) {
            if ($event.path[i].nodeName === "TD") {
                this.domTab = $event.path[i];
                break;
            }
            i++;
        }
        this.domTab.style.fontWeight = "bold";
        var totaleleft = 41 - $event.offsetX;
        var totaletop = $event.clientY - 6 - ($event.offsetY + 2);
        this.top = totaletop;
        if (window.innerWidth > $event.clientX + 520) {
            this.left = $event.clientX + totaleleft + 33;
            this.tab_arraw = [true, false];
        }
        else {
            var leftfixe = $event.clientX + totaleleft;
            this.left = leftfixe - 455 - this.domTab.offsetWidth;
            this.tab_arraw = [false, true];
        }
    };
    ViwerReadImportComponent.prototype.action = function (value, namecells, index, $event) {
        this.positionPopup($event);
        var regex3 = /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
        if (regex3.exec(value[namecells])) {
            this.selected = "object";
        }
        else {
            this.selected = typeof value[namecells];
        }
        this.vueEdit = true;
        this.objectOne = [index, value];
        this.nameCells = namecells;
        this.lastValue = value[namecells];
    };
    ViwerReadImportComponent.prototype.toggleedit = function (value) {
        var _this = this;
        // console.log(value)
        var numbercoll = "";
        if (value[2] === undefined) {
            this.domTab.style.fontWeight = "initial";
            numbercoll =
                this.CountCell === 0
                    ? "Edit single cell on row " + (this.objectOne[0] + 1) + ","
                    : "Mass edit " + this.CountCell + " cells in ";
        }
        this.vueEdit = value[0];
        if (value[1] === "" && this.testConverter) {
            this.indexRowdata = undefined;
            var name_dinamic = value[2] === undefined
                ? numbercoll + " column " + this.nameCells
                : value[2];
            var actualydata = void 0;
            if (this.ActualyData) {
                this.listNameHistory.splice(this.listNameHistory.indexOf(this.ActualyData) + 1);
                actualydata = this.ActualyData.idName + 1;
            }
            else {
                actualydata = this.listNameHistory.length;
            }
            this.lpViewer
                .sendFiles({
                namehistory: name_dinamic,
                idProject: this.idProject,
                fileData: this.dataViews,
                idHeader: this.idHeader,
                header: []
            }, actualydata)
                .subscribe(function (res) {
                _this.listNameHistory.push(res);
                _this.lpViewer.isloadingHistory.next(false);
            });
            this.ActualyData = null;
        }
        this.CountCell = 0;
        this.testConverter = true;
        this.selectedIndex = 1;
    };
    ViwerReadImportComponent.prototype.ConverterToString = function (newValue) {
        var _this = this;
        var regex3 = /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
        if (regex3.exec(newValue) || regex3.exec(this.lastValue)) {
            var regex2 = new RegExp("[-\\/ ]");
            var tab_1 = newValue.split(regex2);
            var tab1_1 = tab_1[2].toString().split("T");
            this.dataViews.forEach(function (item) {
                if (regex3.exec(item[_this.nameCells]) &&
                    item[_this.nameCells].split("T")[0] ===
                        _this.lastValue.split("T")[0]) {
                    item[_this.nameCells] = moment(tab_1[0] + "-" + tab_1[1] + "-" + tab1_1[0], "YYYY-MM-DD", true).format("YYYY-MM-DD");
                    _this.CountCell++;
                }
            });
        }
        else {
            this.dataViews.forEach(function (item) {
                if (item[_this.nameCells] === _this.lastValue.toString() ||
                    parseInt(item[_this.nameCells]) ===
                        parseInt(_this.lastValue) ||
                    item[_this.nameCells] === _this.lastValue) {
                    item[_this.nameCells] = newValue.toString();
                    _this.CountCell++;
                }
            });
        }
    };
    ViwerReadImportComponent.prototype.filterInt = function (value) {
        if (/^[0-9]+[\.,]?[0-9]*$/.test(value)) {
            return true;
        }
        else {
            return false;
        }
    };
    ViwerReadImportComponent.prototype.ConverterToNumber = function (newValue) {
        var _this = this;
        if (typeof newValue === "string") {
            if (!this.filterInt(newValue.trim())) {
                alert("Not a valid number !");
                this.testConverter = false;
            }
            else {
                var replace = typeof newValue === "string"
                    ? newValue.replace(",", ".")
                    : newValue;
                var parsed_1 = parseFloat(replace);
                this.dataViews.forEach(function (item) {
                    if (item[_this.nameCells] === _this.lastValue.toString() ||
                        (parseInt(item[_this.nameCells]) &&
                            parseInt(item[_this.nameCells]) ===
                                _this.lastValue) ||
                        item[_this.nameCells] === _this.lastValue) {
                        item[_this.nameCells] = parsed_1;
                        _this.CountCell++;
                    }
                });
            }
        }
        else if (typeof newValue === "object") {
            alert("Not a valid number !");
            this.testConverter = false;
        }
    };
    ViwerReadImportComponent.prototype.ConverterToDate = function (newValue) {
        var _this = this;
        var reg = /^([0-2][0-9]|(3)[0-1])[-](((0)[0-9])|((1)[0-2]))[-]\d{4}$/;
        var reg1 = /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/;
        var regex3 = /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
        var string_date = typeof newValue === "string" ? newValue.trim() : newValue;
        var regex2 = new RegExp("[-]");
        // .format('YYYY/MM/DD');
        if (reg1.exec(string_date)) {
            var tab_2 = string_date.split(regex2);
            this.dataViews.forEach(function (item) {
                if (item[_this.nameCells] === _this.lastValue.toString()) {
                    item[_this.nameCells] = moment(tab_2[0] + "-" + tab_2[1] + "-" + tab_2[2], "YYYY-MM-DD", true).format();
                    _this.CountCell++;
                }
            });
            // .format('DD'/MM/YYYY);
        }
        else if (reg.exec(string_date)) {
            alert("Make the date in iso format");
            this.testConverter = false;
        }
        else if (!regex3.exec(string_date)) {
            alert("format date incorrect");
            this.testConverter = false;
        }
        // else {
        //   // alert('format date incorrect');
        //   // this.testConverter = false;
        // }
    };
    ViwerReadImportComponent.prototype.ConverterToBooleen = function (newValue) {
        var _this = this;
        if (newValue != "true" || !newValue) {
            this.dataViews.forEach(function (item) {
                if (item[_this.nameCells] === _this.lastValue.toString() ||
                    (parseInt(item[_this.nameCells]) &&
                        parseInt(item[_this.nameCells]) === _this.lastValue) ||
                    item[_this.nameCells] === _this.lastValue) {
                    item[_this.nameCells] = false;
                    _this.CountCell++;
                }
            });
        }
        else {
            this.dataViews.forEach(function (item) {
                if (item[_this.nameCells] === _this.lastValue.toString() ||
                    (parseInt(item[_this.nameCells]) &&
                        parseInt(item[_this.nameCells]) === _this.lastValue) ||
                    item[_this.nameCells] === _this.lastValue) {
                    item[_this.nameCells] = true;
                    _this.CountCell++;
                }
            });
        }
    };
    ViwerReadImportComponent.prototype.oneObjectfunc = function (updateObject) {
        if (updateObject[1] === "string") {
            this.ConverterToString(updateObject[0]);
        }
        else if (updateObject[1] === "number") {
            this.ConverterToNumber(updateObject[0]);
        }
        else if (updateObject[1] === "boolean") {
            this.ConverterToBooleen(updateObject[0]);
        }
        else if (updateObject[1] === "object") {
            this.ConverterToDate(updateObject[0]);
        }
    };
    ViwerReadImportComponent.prototype.updateDisplaycolumn = function (newHeader) {
        this.nameHeader.forEach(function (value, index) {
            var textValue = value["_elementRef"].nativeElement.innerText;
            if (textValue !== newHeader[index].trim())
                value["_elementRef"].nativeElement.innerText =
                    newHeader[index].trim();
        });
    };
    ViwerReadImportComponent.prototype.getAllDataByListName = function (value) {
        var _this = this;
        this.ActualyData = value;
        this.idHeader = value.idHeader;
        this.lpViewer.getOnedateHistory(value).subscribe(function (response) {
            var header = JSON.parse(JSON.stringify(response[1]["nameUpdate"].split('"').join(""))).split(",");
            _this.updateDisplaycolumn(header);
            _this.idHeader = response[1]["idHeader"];
            // let min = this.paginator.pageIndex * this.paginator.pageSize;
            var max = (_this.paginator.pageIndex + 1) * _this.paginator.pageSize;
            _this.dataViews = response[0];
            _this.dataSourceFilter = _this.dataFilters(_this.dataViews);
            _this.dataSource = _this.dataSourceFilter.slice(0, max);
            _this.lpViewer.isloadingHistory.next(false);
        });
    };
    ViwerReadImportComponent.prototype.updateHeader = function (value) {
        var _this = this;
        var updateHeader;
        var tabforUpdate = ["All"];
        this.nameHeader.forEach(function (el, index) {
            tabforUpdate.push(el["_elementRef"].nativeElement.innerText);
            if (index === value - 1) {
                updateHeader = el["_elementRef"].nativeElement;
            }
        });
        this.dialog
            .open(updates_header_component_1.UpdatesHeaderComponent, {
            data: {
                idHeader: this.idHeader,
                index: value,
                table: tabforUpdate,
                edidtableColumns: updateHeader,
                idproject: this.idProject
            }
        })
            .afterClosed()
            .pipe(operators_1.map(function (idHeader) {
            if (idHeader) {
                var actualy = _this.ActualyData
                    ? _this.ActualyData["idName"]
                    : -1;
                if (_this.ActualyData) {
                    _this.listNameHistory.splice(_this.listNameHistory.indexOf(_this.ActualyData) +
                        1);
                }
                _this.idHeader = idHeader;
                // Rename column RANK(2013) to RANK(2013)24
                var name_dinamic = "Edit header table on column " + (value + 1);
                _this.lpViewer
                    .sendFiles({
                    namehistory: name_dinamic,
                    idProject: _this.idProject,
                    fileData: _this.dataSource,
                    idHeader: _this.idHeader,
                    header: []
                }, actualy)
                    .subscribe(function (res) {
                    _this.listNameHistory.push(res);
                });
            }
        }))
            .subscribe();
    };
    ViwerReadImportComponent.prototype.dataFilters = function (data) {
        var _this = this;
        return data.filter(function (_, index) { return _this.checkFiltesData(index); });
    };
    ViwerReadImportComponent.prototype.checkFiltesData = function (index) {
        var q1 = this.chechQueryFilter(index, this.lpviLped.permaLink["numeric"]);
        var q2 = this.chechQueryFilter(index, this.lpviLped.permaLink["input"]);
        var q3 = this.chechQueryFilter(index, this.lpviLped.permaLink["search"]);
        return q1 && q2 && q3;
    };
    ViwerReadImportComponent.prototype.chechQueryFilter = function (index, queries) {
        if (queries.length !== 0)
            return queries[index];
        return true;
    };
    ViwerReadImportComponent.prototype.onChangeEventFilterStartAndFlag = function () {
        var first = this.formfilterStart.value.first;
        var second = this.formfilterStart.value.second;
        if (first && second) {
            this.dataSourceFilter = this.dataViews.filter(function (value) { return value.star === true && value.flag === true; });
        }
        else if (!first && !second) {
            this.dataSourceFilter = this.dataViews;
        }
        else {
            if (first && !second) {
                this.dataSourceFilter = this.dataViews.filter(function (value) { return value.star === true; });
            }
            else if (!first && second) {
                this.dataSourceFilter = this.dataViews.filter(function (value) { return value.flag === true; });
            }
        }
        this.lpviLped.dataSources$.next(this.dataSourceFilter);
    };
    ViwerReadImportComponent.prototype.removeAppSearch = function ($item) {
        this.Columns_replace = undefined;
    };
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], ViwerReadImportComponent.prototype, "sort");
    __decorate([
        core_1.ViewChildren("updateHeader")
    ], ViwerReadImportComponent.prototype, "nameHeader");
    __decorate([
        core_1.ViewChild("btnbutton")
    ], ViwerReadImportComponent.prototype, "MyDOMElement");
    __decorate([
        core_1.Input("idProject")
    ], ViwerReadImportComponent.prototype, "idProject");
    __decorate([
        core_1.Input("filtersData")
    ], ViwerReadImportComponent.prototype, "filtersData");
    __decorate([
        core_1.Input("dataAfterUploaded")
    ], ViwerReadImportComponent.prototype, "dataAfterUploaded");
    __decorate([
        core_1.Input("inputFilters")
    ], ViwerReadImportComponent.prototype, "inputFilters");
    __decorate([
        core_1.ViewChild("container")
    ], ViwerReadImportComponent.prototype, "container");
    __decorate([
        core_1.Input()
    ], ViwerReadImportComponent.prototype, "isFavorate");
    ViwerReadImportComponent = __decorate([
        core_1.Component({
            selector: "app-viwer-read-import",
            templateUrl: "./viwer-read-import.component.html",
            styleUrls: ["./viwer-read-import.component.scss"]
        })
    ], ViwerReadImportComponent);
    return ViwerReadImportComponent;
}());
exports.ViwerReadImportComponent = ViwerReadImportComponent;
