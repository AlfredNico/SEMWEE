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
exports.SearchFilterComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var SearchFilterComponent = /** @class */ (function () {
    function SearchFilterComponent() {
        /* INPUT */
        this.items = [];
        this.dataViews = [];
        this.item = undefined;
        this.index = undefined;
        /* OUTPUT */
        this.minimize = new core_1.EventEmitter();
        this.removeFromItem = new core_1.EventEmitter();
        this.itemsEmitter = new core_1.EventEmitter();
        this.isSortName = false;
        this.isSortCount = false;
        this.itemSubject = new rxjs_1.Subject();
    }
    SearchFilterComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.itemSubject.subscribe(function (_) { return (_this.observable$ = rxjs_1.of(_this.couterInclude())); });
    };
    SearchFilterComponent.prototype.exclude = function (headName, contentName) {
        var _this = this;
        var index = this.items.indexOf(headName);
        if (index !== -1) {
            this.items[index].content.map(function (val, i) {
                if (val[0] === contentName) {
                    _this.items[index].content[i] = __assign(__assign({}, _this.items[index].content[i]), { include: !_this.items[index].content[i]["include"] });
                }
            });
        }
        this.itemSubject.next();
        this.itemsEmitter.emit(this.items);
    };
    SearchFilterComponent.prototype.include = function (headName, contentName) {
        var _this = this;
        var index = this.items.indexOf(headName);
        if (index !== -1) {
            this.items[index].content.map(function (val, i) {
                if (val[0] === contentName) {
                    _this.items[index].content[i] = __assign(__assign({}, _this.items[index].content[i]), { include: !_this.items[index].content[i]["include"] });
                }
            });
        }
        this.itemSubject.next();
        this.itemsEmitter.emit(this.items);
    };
    SearchFilterComponent.prototype.sortByName = function () {
        var _this = this;
        this.isSortName = !this.isSortName;
        this.items[this.index].content.sort(function (prev, next) {
            return _this.isSortName ? _this.ASC(prev, next, 0) : _this.DESC(prev, next, 0);
        });
    };
    SearchFilterComponent.prototype.sortByCount = function () {
        var _this = this;
        this.isSortCount = !this.isSortCount;
        this.items[this.index].content.sort(function (prev, next) {
            return _this.isSortCount
                ? _this.ASC(prev, next, 1)
                : _this.DESC(prev, next, 1);
        });
    };
    SearchFilterComponent.prototype.DESC = function (i, ii, key) {
        return i[key] > ii[key] ? -1 : i[key] < ii[key] ? 1 : 0;
    };
    SearchFilterComponent.prototype.ASC = function (i, ii, key) {
        return i[key] > ii[key] ? 1 : i[key] < ii[key] ? -1 : 0;
    };
    SearchFilterComponent.prototype.couterInclude = function () {
        var _this = this;
        this.couter = 0;
        this.items[this.index].content.forEach(function (element) {
            if (element.include) {
                _this.couter++;
            }
        });
        return this.couter;
    };
    SearchFilterComponent.prototype.reset = function () {
        this.item.content.forEach(function (element) {
            element.include = false;
        });
        var index = this.items.indexOf(this.item.head);
        if (index != -1) {
            this.items[index] = this.item;
        }
        this.itemSubject.next();
        this.itemsEmitter.emit(this.items);
    };
    __decorate([
        core_1.Input("items")
    ], SearchFilterComponent.prototype, "items");
    __decorate([
        core_1.Input("dataViews")
    ], SearchFilterComponent.prototype, "dataViews");
    __decorate([
        core_1.Input("item")
    ], SearchFilterComponent.prototype, "item");
    __decorate([
        core_1.Input("index")
    ], SearchFilterComponent.prototype, "index");
    __decorate([
        core_1.Output("minimize")
    ], SearchFilterComponent.prototype, "minimize");
    __decorate([
        core_1.Output("removeFromItem")
    ], SearchFilterComponent.prototype, "removeFromItem");
    __decorate([
        core_1.Output("itemsEmitter")
    ], SearchFilterComponent.prototype, "itemsEmitter");
    SearchFilterComponent = __decorate([
        core_1.Component({
            selector: "app-search-filter",
            template: "\n        <div class=\"mx-1 pb-2 pl-3\" appFluidHeight>\n            <div class=\"p-0 w-100 rounded \">\n                <div class=\"py-2 px-2 rounded-top level1 bb\" fxLayout=\"row\">\n                    <mat-icon\n                        aria-label=\"close icon\"\n                        (click)=\"removeFromItem.emit(item)\"\n                    >\n                        highlight_off\n                    </mat-icon>\n                    <mat-icon\n                        *ngIf=\"item['isMinimize'] === false\"\n                        aria-label=\"close icon\"\n                        (click)=\"minimize.emit(item)\"\n                    >\n                        remove_circle_outline\n                    </mat-icon>\n                    <mat-icon\n                        *ngIf=\"item['isMinimize'] === true\"\n                        aria-label=\"close icon\"\n                        (click)=\"minimize.emit(item)\"\n                    >\n                        add_circle_outline\n                    </mat-icon>\n                    <span class=\"fw-600\">{{ item[\"head\"] }}</span>\n                    <span fxFlex></span>\n                    <div\n                        class=\"pointer px-1 white-color fw-600\"\n                        (click)=\"reset()\"\n                    >\n                        reset\n                    </div>\n                </div>\n                <div\n                    fxLayout=\"row\"\n                    class=\"py-2 px-2 level2\"\n                    *ngIf=\"item['isMinimize'] === false\"\n                >\n                    <div class=\"pr-3 pointer black-color fw-600\">\n                        {{ observable$ | async }} choices\n                    </div>\n                    <div>\n                        Sort by :\n                        <span\n                            class=\"px-1 pointer black-color fw-600\"\n                            [ngStyle]=\"{\n                                color: isSortName ? 'rgb(27, 197, 189)' : null\n                            }\"\n                            (click)=\"sortByName()\"\n                            >name</span\n                        >\n                        <span\n                            class=\"px-1 pointer black-color fw-600\"\n                            [ngStyle]=\"{\n                                color: isSortCount ? 'rgb(27, 197, 189)' : null\n                            }\"\n                            (click)=\"sortByCount()\"\n                            >count</span\n                        >\n                    </div>\n                </div>\n                <div\n                    class=\"py-2\"\n                    style=\"height: 150px; overflow: auto\"\n                    *ngIf=\"item['isMinimize'] === false\"\n                >\n                    <div\n                        fxLayout=\"row\"\n                        class=\"py-0 px-2 list-content\"\n                        fxLayoutAlign=\"space-between center\"\n                        *ngFor=\"let content of item?.content\"\n                    >\n                        <div fxLayout=\"row\">\n                            <p\n                                class=\"font-weight-bold m-0 pr-2 pointer\"\n                                [ngStyle]=\"{\n                                    color:\n                                        content['include'] === false\n                                            ? '#2464a4'\n                                            : '#1BC5BD'\n                                }\"\n                            >\n                                {{ content[0] }}\n                            </p>\n                            <span style=\"color: #7E849C\">\n                                {{ content[1] }}\n                            </span>\n                        </div>\n                        <span\n                            class=\"only-show-on-hover pointer in-ex\"\n                            *ngIf=\"content['include'] === false\"\n                            (click)=\"include(item, content[0])\"\n                        >\n                            include\n                        </span>\n                        <span\n                            class=\"pointer in-ex\"\n                            *ngIf=\"content['include'] === true\"\n                            (click)=\"exclude(item, content[0])\"\n                        >\n                            exclude\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"w-100 resizable\"></div>\n        </div>\n    ",
            styles: []
        })
    ], SearchFilterComponent);
    return SearchFilterComponent;
}());
exports.SearchFilterComponent = SearchFilterComponent;
