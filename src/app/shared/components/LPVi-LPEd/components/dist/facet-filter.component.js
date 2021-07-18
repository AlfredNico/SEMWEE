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
exports.__esModule = true;
exports.FacetFilterComponent = void 0;
var core_1 = require("@angular/core");
var FacetFilterComponent = /** @class */ (function () {
    function FacetFilterComponent(lpEditor, lpviLped) {
        this.lpEditor = lpEditor;
        this.lpviLped = lpviLped;
        /* VARIABLES */
        this.queries = {};
        this.Columns = '';
        /* ALL QUERY FILTERS VALUES */
        this.inputQueries = [];
        this.searchQueries = [];
        this.numericQeury = [];
        this.timeLineQeury = [];
        this.queriesNumerisFilters = {};
        this.queriesTimeLineFilters = {};
        // public items: any[] = [];
        /* INPUT */
        this.dataViews = [];
        this.dataSources = [];
        this.idProject = undefined;
        this.items = [];
        this.search_replace = [];
    }
    FacetFilterComponent.prototype.ngOnInit = function () {
        if (Object.keys(this.lpviLped.permaLink).length !== 0) {
            this.inputQueries = this.lpviLped.permaLink['input'];
            this.searchQueries = this.lpviLped.permaLink['search'];
            this.numericQeury = this.lpviLped.permaLink['numeric'];
            this.items = this.lpviLped.permaLink['items'];
            this.queries = this.lpviLped.permaLink['queries'];
            this.queriesNumerisFilters =
                this.lpviLped.permaLink['queriesNumerisFilters'];
        }
    };
    FacetFilterComponent.prototype.ngOnDestroy = function () { };
    FacetFilterComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.lpviLped.resetfilter.subscribe(function (res) {
            _this.resetAll();
        });
        this.lpviLped.itemsObservables$.subscribe(function (res) {
            if (res !== undefined) {
                _this.items.push(res);
                _this.savePermalink(); // SAVE PERMALINK
            }
        });
    };
    FacetFilterComponent.prototype.removeAll = function () {
        var _this = this;
        this.lpviLped.dataSources$.next(this.dataViews);
        this.items = [];
        this.inputQueries = [];
        this.searchQueries = [];
        this.numericQeury = [];
        this.dataSources = this.dataViews;
        this.queries = {};
        this.queriesNumerisFilters = {};
        Object.keys(this.lpviLped.permaLink.queries).forEach(function (v) { return (_this.lpviLped.permaLink.queries[v] = ''); });
        this.savePermalink(); // SAVE PERMALINK
    };
    FacetFilterComponent.prototype.resetAll = function () {
        var _this = this;
        this.inputQueries = [];
        this.searchQueries = [];
        this.numericQeury = [];
        Object.keys(this.queries).forEach(function (v) { return (_this.queries[v] = ''); });
        Object.keys(this.lpviLped.permaLink.queries).forEach(function (v) { return (_this.lpviLped.permaLink.queries[v] = ''); });
        this.lpviLped.inputSubject.next();
        this.queriesNumerisFilters = {};
        this.lpviLped.dataSources$.next(this.dataViews);
        this.dataSources = this.dataViews;
        this.items.map(function (item, index) {
            var _a;
            if (item['type'] === 'search') {
                (_a = item['content']) === null || _a === void 0 ? void 0 : _a.map(function (value, i) {
                    item['content'][i] = __assign(__assign({}, value), { include: false });
                });
            }
            else if (item['type'] === 'input') {
                _this.items[index] = __assign(__assign({}, item), { value: '' });
            }
            else if (item['type'] === 'numeric') {
                _this.items[index] = __assign(__assign({}, item), { options: __assign(__assign({}, item['options']), { floor: item['minValue'], ceil: item['maxValue'] }) });
            }
        });
        this.items = this.items;
        this.savePermalink(); // SAVE PERMALINK
    };
    /* EMITTER FUNCTION AFTER FILTER FROM COMPONENTS */
    FacetFilterComponent.prototype.callAfterNumericFilter = function (event) {
        var _this = this;
        this.lpviLped.isLoading$.next(true); // enable loading spinner
        var q = [], ss;
        this.dataSources = this.dataViews.filter(function (value, index) {
            var v = value["" + event['head']];
            if (Object.keys(_this.queriesNumerisFilters).length === 0) {
                if (v >= event['minValue'] &&
                    v <= event['maxValue'] &&
                    Number.isFinite(v) === true)
                    q[index] = true;
                else
                    q[index] = false;
                _this.numericQeury[index] = ss = q[index];
                return _this.filtersData(index);
            }
            else {
                return Object.keys(_this.queriesNumerisFilters).every(function (x) {
                    var s = _this.queriesNumerisFilters[x];
                    if (v >= event['minValue'] &&
                        v <= event['maxValue'] &&
                        Number.isFinite(v) === true)
                        q[index] = true;
                    else
                        q[index] = false;
                    if (x === event['head'])
                        ss = q;
                    _this.numericQeury[index] = ss = s[index] && q[index];
                    return _this.filtersData(index);
                });
            }
        });
        this.queriesNumerisFilters["" + event['head']] = this.numericQeury = q;
        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    };
    FacetFilterComponent.prototype.callAfterTimeLineEmitter = function (event) {
        var _this = this;
        this.lpviLped.isLoading$.next(true); // enable loading spinner
        var q = [], ss = [];
        this.dataSources = this.dataViews.filter(function (value, index) {
            var v = Date.parse(value["" + event['head']]);
            if (Object.keys(_this.queriesTimeLineFilters).length === 0) {
                if (v <= event['end'] && v >= event['start'])
                    q[index] = true;
                else
                    q[index] = false;
                _this.timeLineQeury[index] = ss = q[index];
                return _this.filtersData(index);
            }
            else {
                return Object.keys(_this.queriesTimeLineFilters).every(function (x) {
                    var s = _this.queriesTimeLineFilters[x];
                    // !isNaN(Date.parse(v))
                    if (v <= event['end'] && v >= event['start'])
                        q[index] = true;
                    else
                        q[index] = false;
                    if (x === event['head'])
                        ss = q;
                    _this.timeLineQeury[index] = ss = s[index] && q[index];
                    return _this.filtersData(index);
                });
            }
        });
        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    };
    FacetFilterComponent.prototype.formGroupEmitter = function (event) {
        this.queries[event.item['head']] = event.query; //save querie from input filter
        var index = this.items.findIndex(function (elem) { return elem['head'] == event.item['head']; });
        if (index !== -1)
            this.items[index] = __assign({}, event.item);
        this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
    };
    FacetFilterComponent.prototype.minimizeEmitter = function (item) {
        var index = this.items.findIndex(function (elem) { return elem['head'] == item['head']; });
        if (index !== -1) {
            this.items[index] = __assign(__assign({}, this.items[index]), { isMinimize: !this.items[index]['isMinimize'] });
        }
        this.items = this.items;
        this.savePermalink(); // SAVE PERMALINK
    };
    FacetFilterComponent.prototype.removeFromItemEmitter = function (item, removeName) {
        var _this = this;
        if (this.items.indexOf(item) !== -1) {
            this.items.splice(this.items.indexOf(item), 1);
        }
        this.items = this.items;
        if (removeName !== undefined) {
            if (removeName === 'input') {
                var newObject = Object.keys(this.queries).reduce(function (accumulator, key) {
                    if (key !== item['head'])
                        accumulator[key] = _this.queries[key];
                    return accumulator;
                }, {});
                this.queries = newObject;
                this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
            }
            else if (removeName === 'number') {
                this.numericQeury = [];
                this.dataSources = this.dataViews.filter(function (value, index) {
                    return _this.filtersData(index);
                });
                this.lpviLped.dataSources$.next(this.dataSources);
            }
            else if (removeName === 'search') {
                this.searchQueries = [];
                this.dataSources = this.dataViews.filter(function (value, index) {
                    return _this.filtersData(index);
                });
                this.lpviLped.dataSources$.next(this.dataSources);
            }
        }
        this.savePermalink(); // SAVE PERMALINK
    };
    FacetFilterComponent.prototype.itemsEmitter = function (event) {
        var _this = this;
        this.lpviLped.isLoading$.next(true); // enable loading spinner
        if (event !== undefined)
            this.items = event;
        this.dataSources = this.dataViews.filter(function (value, index) {
            var i1 = 0;
            var queries;
            var q = _this.items.map(function (item) {
                var _a;
                var i2 = 0;
                var str = '';
                (_a = item['content']) === null || _a === void 0 ? void 0 : _a.map(function (element) {
                    if (element['include'] == true) {
                        var q_1 = "value[\"" + item['head'] + "\"].trim()===\"" + element[0] + "\".trim()";
                        if (i2 === 0)
                            str = q_1;
                        else
                            str = str + "||" + q_1;
                        i2++;
                    }
                });
                if (i1 === 0)
                    queries = eval(str);
                else
                    queries = queries && eval(str);
                i1++;
            });
            _this.searchQueries[index] = queries;
            return _this.filtersData(index);
        });
        console.log(this.dataSources);
        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    };
    /* VERIFY ALL QUERY FILTERS */
    FacetFilterComponent.prototype.chechQueryFilter = function (index, queries) {
        if (queries.length !== 0)
            return queries[index];
        return true;
    };
    FacetFilterComponent.prototype.filtersData = function (index) {
        var q1 = this.chechQueryFilter(index, this.numericQeury);
        var q2 = this.chechQueryFilter(index, this.searchQueries);
        var q3 = this.chechQueryFilter(index, this.inputQueries);
        var q4 = this.chechQueryFilter(index, this.timeLineQeury);
        return q1 && q2 && q3 && q4;
    };
    FacetFilterComponent.prototype.inputFilterFonciont = function () {
        var _this = this;
        var qqq = '', i1 = 0;
        this.lpviLped.isLoading$.next(true); // disable loading spinner
        this.dataSources = this.dataViews.filter(function (value, index) {
            if (Object.values(_this.queries).every(function (x) { return x === null || x === ''; })) {
                _this.inputQueries[index] = true;
                return _this.filtersData(index);
            }
            else {
                var s_1 = '', i2_1 = 0;
                Object.keys(_this.queries).some(function (property) {
                    if (_this.queries[property] != '' &&
                        typeof value[property] === 'string' &&
                        _this.queries[property] !== undefined &&
                        _this.queries[property]['value'] !== undefined &&
                        value[property] !== undefined) {
                        var lower = _this.queries[property]['value'];
                        var ss = '';
                        if (!_this.queries[property]['complete_string']) { //true
                            if (!_this.queries[property]['sensitive']) { //true
                                if (_this.queries[property]['invert'])
                                    ss = "value[\"" + property + "\"].trim().includes(\"" + lower + "\".trim())";
                                else
                                    ss = "!value[\"" + property + "\"].trim().includes(\"" + lower + "\".trim())";
                            }
                            else {
                                if (_this.queries[property]['invert'])
                                    ss = "value[\"" + property + "\"].trim().toLowerCase().includes(\"" + lower + "\".trim().toLowerCase())";
                                else
                                    ss = "!value[\"" + property + "\"].trim().toLowerCase().includes(\"" + lower + "\".trim().toLowerCase())";
                            }
                        }
                        else {
                            if (!_this.queries[property]['sensitive']) {
                                if (_this.queries[property]['invert'])
                                    ss = "value[\"" + property + "\"].trim()==\"" + lower + "\".trim()";
                                else
                                    ss = "value[\"" + property + "\"].trim()!=\"" + lower + "\".trim()";
                            }
                            else {
                                if (_this.queries[property]['invert'])
                                    ss = "value[\"" + property + "\"].trim().toLowerCase()==\"" + lower + "\".trim().toLowerCase()";
                                else
                                    ss = "value[\"" + property + "\"].trim().toLowerCase()!=\"" + lower + "\".trim().toLowerCase()";
                            }
                        }
                        if (i2_1 === 0)
                            s_1 = ss;
                        else
                            s_1 = s_1 + '&&' + ss;
                        i2_1++;
                    }
                });
                if (i1 === 0)
                    qqq = eval(s_1);
                else
                    qqq = qqq + '&&' + eval(s_1);
                i2_1++;
                _this.inputQueries[index] = eval(qqq) !== undefined ? eval(qqq) : true;
                return _this.filtersData(index);
            }
        });
        this.lpviLped.dataSources$.next(this.dataSources);
        this.savePermalink(); // SAVE PERMALINK
    };
    FacetFilterComponent.prototype.savePermalink = function () {
        var permalink = {
            idProject: this.idProject,
            value: JSON.stringify({
                input: this.inputQueries,
                search: this.searchQueries,
                numeric: this.numericQeury,
                items: this.items,
                queries: this.queries,
                queriesNumerisFilters: this.queriesNumerisFilters
            })
        };
        this.lpviLped.permaLink = __assign(__assign({}, this.lpviLped.permaLink), { input: this.inputQueries, search: this.searchQueries, numeric: this.numericQeury, items: this.items, queries: this.queries, queriesNumerisFilters: this.queriesNumerisFilters });
        this.lpviLped.isLoading$.next(false); // desaable loading spinner
        this.lpEditor.addFilter(permalink).subscribe();
    };
    __decorate([
        core_1.Input('dataViews')
    ], FacetFilterComponent.prototype, "dataViews");
    __decorate([
        core_1.Input('dataSources')
    ], FacetFilterComponent.prototype, "dataSources");
    __decorate([
        core_1.Input('idProject')
    ], FacetFilterComponent.prototype, "idProject");
    __decorate([
        core_1.Input('items')
    ], FacetFilterComponent.prototype, "items");
    FacetFilterComponent = __decorate([
        core_1.Component({
            selector: 'app-facet-filter-target',
            template: "\n    <div *ngIf=\"items.length > 0; else noItems\">\n      <div class=\"w-100 pl-4 pr-2 pb-3\">\n        <button class=\"rounded btn btn-custom\">Refresh</button>\n        <span fxFlex></span>\n        <button class=\"rounded btn btn-custom mr-2\" (click)=\"resetAll()\">\n          Reset All\n        </button>\n        <button class=\"rounded btn btn-custom\" (click)=\"removeAll()\">\n          Remove All\n        </button>\n      </div>\n\n      <div *ngFor=\"let item of items; let index = index\">\n        <ng-container\n          *ngTemplateOutlet=\"\n            item.type === 'search'\n              ? searchTemplate\n              : item.type === 'input'\n              ? inputTemplate\n              : item.type === 'datefilter'\n              ? dateTemplate\n              : item.type === 'numeric'\n              ? numericTemplate\n              : timeLineTemplate;\n            context: { value: item }\n          \"\n        >\n        </ng-container>\n\n        <ng-template #searchTemplate let-currentValue=\"value\">\n          <app-search-filter\n            [items]=\"items\"\n            [item]=\"item\"\n            [index]=\"index\"\n            [dataViews]=\"dataViews\"\n            (itemsEmitter)=\"itemsEmitter($event)\"\n            (removeFromItem)=\"removeFromItemEmitter($event, 'search')\"\n            (minimize)=\"minimizeEmitter($event)\"\n          ></app-search-filter>\n        </ng-template>\n\n        <ng-template #inputTemplate let-currentValue=\"value\">\n          <app-input-filter\n            [items]=\"items\"\n            [item]=\"item\"\n            [index]=\"index\"\n            [dataViews]=\"dataViews\"\n            (formGroup)=\"formGroupEmitter($event)\"\n            (removeFromItem)=\"removeFromItemEmitter($event, 'input')\"\n            (minimize)=\"minimizeEmitter($event)\"\n            (itemsEmitter)=\"itemsEmitter($event)\"\n          ></app-input-filter>\n        </ng-template>\n\n        <ng-template #dateTemplate let-currentValue=\"value\">\n          <app-date-filter\n            [items]=\"items\"\n            [item]=\"item\"\n            [index]=\"index\"\n            [dataViews]=\"dataViews\"\n            (formGroup)=\"formGroupEmitter($event)\"\n            (removeFromItem)=\"removeFromItemEmitter($event, 'input')\"\n            (minimize)=\"minimizeEmitter($event)\"\n            (itemsEmitter)=\"itemsEmitter($event)\"\n          ></app-date-filter>\n        </ng-template>\n\n        <ng-template #numericTemplate let-currentValue=\"value\">\n          <app-numeric-facet\n            [items]=\"items\"\n            [item]=\"item\"\n            [dataViews]=\"dataViews\"\n            [dataSources]=\"dataSources\"\n            (numericQueriesEmitter)=\"callAfterNumericFilter($event)\"\n            (removeFromItem)=\"removeFromItemEmitter($event, 'number')\"\n            (minimize)=\"minimizeEmitter($event)\"\n          ></app-numeric-facet>\n        </ng-template>\n\n        <ng-template #timeLineTemplate let-currentValue=\"value\">\n          <app-time-line\n            [items]=\"items\"\n            [item]=\"item\"\n            [dataViews]=\"dataViews\"\n            [dataSources]=\"dataSources\"\n            (timeLineQueriesEmitter)=\"callAfterTimeLineEmitter($event)\"\n            (removeFromItem)=\"removeFromItemEmitter($event, 'timeLine')\"\n            (minimize)=\"minimizeEmitter($event)\"\n          ></app-time-line>\n        </ng-template>\n      </div>\n    </div>\n\n    <ng-template #noItems>\n      <div style=\"background: #F5F6FA;\" class=\"w-100 ml-4 px-3 py-5\">\n        <h1 class=\"ftp\">Using facets and filters</h1>\n        <p class=\"m-0 ftp\">\n          Use facets and filters to select subsets of your data to act on.\n          Choose facet and filter methods from the menus at the top of each data\n          column.\n        </p>\n      </div>\n    </ng-template>\n  ",
            styleUrls: ['./facet-filter.component.scss']
        })
    ], FacetFilterComponent);
    return FacetFilterComponent;
}());
exports.FacetFilterComponent = FacetFilterComponent;
