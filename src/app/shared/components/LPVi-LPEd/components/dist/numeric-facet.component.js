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
exports.NumericFacetComponent = void 0;
var core_1 = require("@angular/core");
var NumericFacetComponent = /** @class */ (function () {
    /* VARIALBES */
    function NumericFacetComponent() {
        /* INPUT */
        this.items = [];
        this.item = undefined;
        this.dataViews = [];
        /* OUTPUT */
        this.numericQueriesEmitter = new core_1.EventEmitter(undefined);
        this.itemsEmitter = new core_1.EventEmitter();
        this.minimize = new core_1.EventEmitter();
        this.removeFromItem = new core_1.EventEmitter();
        this.resetFacet = new core_1.EventEmitter();
    }
    NumericFacetComponent.prototype.userChangeEnd = function (event) {
        var valueFiltered = {
            minValue: event["value"],
            maxValue: event["highValue"],
            head: this.item["head"]
        };
        this.numericQueriesEmitter.emit(valueFiltered);
    };
    NumericFacetComponent.prototype.reset = function () {
        this.item = __assign(__assign({}, this.item), { minValue: this.item.min, maxValue: this.item.max });
        this.resetFacet.emit(this.item);
    };
    __decorate([
        core_1.Input("items")
    ], NumericFacetComponent.prototype, "items");
    __decorate([
        core_1.Input("item")
    ], NumericFacetComponent.prototype, "item");
    __decorate([
        core_1.Input("dataViews")
    ], NumericFacetComponent.prototype, "dataViews");
    __decorate([
        core_1.Output("numericQueriesEmitter")
    ], NumericFacetComponent.prototype, "numericQueriesEmitter");
    __decorate([
        core_1.Output("itemsEmitter")
    ], NumericFacetComponent.prototype, "itemsEmitter");
    __decorate([
        core_1.Output("minimize")
    ], NumericFacetComponent.prototype, "minimize");
    __decorate([
        core_1.Output("removeFromItem")
    ], NumericFacetComponent.prototype, "removeFromItem");
    __decorate([
        core_1.Output("resetFacet")
    ], NumericFacetComponent.prototype, "resetFacet");
    NumericFacetComponent = __decorate([
        core_1.Component({
            selector: "app-numeric-facet",
            template: "\n        <div class=\"ml-5 pb-2\">\n            <div class=\"p-0 w-100 rounded \">\n                <div class=\"py-2 px-2 level1\" fxLayout=\"row\">\n                    <mat-icon\n                        aria-label=\"close icon\"\n                        (click)=\"removeFromItem.emit(item)\"\n                    >\n                        highlight_off\n                    </mat-icon>\n                    <mat-icon\n                        *ngIf=\"item['isMinimize'] === false\"\n                        aria-label=\"close icon\"\n                        (click)=\"minimize.emit(item)\"\n                    >\n                        remove_circle_outline\n                    </mat-icon>\n                    <mat-icon\n                        *ngIf=\"item['isMinimize'] === true\"\n                        aria-label=\"close icon\"\n                        (click)=\"minimize.emit(item)\"\n                    >\n                        add_circle_outline\n                    </mat-icon>\n                    <span class=\"fw-600\">{{ item[\"head\"] }}</span>\n                    <span fxFlex></span>\n                    <div\n                        class=\"pointer px-1 white-color fw-600\"\n                        (click)=\"reset()\"\n                    >\n                        reset\n                    </div>\n                </div>\n                <div\n                    class=\"custom-slider\"\n                    *ngIf=\"item?.maxValue !== 0 && item['isMinimize'] === false\"\n                >\n                    <ngx-slider\n                        [(value)]=\"item.minValue\"\n                        [(highValue)]=\"item.maxValue\"\n                        [options]=\"item.options\"\n                        (userChangeEnd)=\"userChangeEnd($event)\"\n                    ></ngx-slider>\n                </div>\n                <div\n                    fxLayout=\"row\"\n                    fxLayoutAlign=\"center center\"\n                    class=\"py-1 level2 rounded-bottom\"\n                    *ngIf=\"item?.maxValue !== 0 && item['isMinimize'] === false\"\n                >\n                    <p class=\"m-0 ftp fw-600\">{{ item?.minValue }}</p>\n                    <p class=\"mx-1 my-0 ftp fw-600\">-</p>\n                    <p class=\"m-0 ftp fw-600\">{{ item?.maxValue }}</p>\n                </div>\n            </div>\n        </div>\n    "
        })
    ], NumericFacetComponent);
    return NumericFacetComponent;
}());
exports.NumericFacetComponent = NumericFacetComponent;
