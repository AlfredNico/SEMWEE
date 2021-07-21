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
exports.TimeLineComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var TimeLineComponent = /** @class */ (function () {
    function TimeLineComponent(dateAdapter) {
        this.dateAdapter = dateAdapter;
        /* INPUT */
        this.items = [];
        this.item = undefined;
        /* OUTPUT */
        this.timeLineQueriesEmitter = new core_1.EventEmitter(undefined);
        this.itemsEmitter = new core_1.EventEmitter();
        this.minimize = new core_1.EventEmitter();
        this.removeFromItem = new core_1.EventEmitter();
        this.resetFacet = new core_1.EventEmitter();
        /* VARIALBES */
        this.FormRange = new forms_1.FormGroup({
            start: new forms_1.FormControl("", [forms_1.Validators.required]),
            end: new forms_1.FormControl([forms_1.Validators.required])
        });
        this.dateAdapter.setLocale("en-US");
    }
    TimeLineComponent.prototype.ngOnInit = function () {
        this.FormRange.patchValue({
            start: this.item["startDate"],
            end: this.item["endDate"]
        });
    };
    Object.defineProperty(TimeLineComponent.prototype, "end", {
        get: function () {
            return this.FormRange.get("end").value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeLineComponent.prototype, "start", {
        get: function () {
            return this.FormRange.get("start").value;
        },
        enumerable: false,
        configurable: true
    });
    TimeLineComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.FormRange.valueChanges.subscribe(function (query) {
            _this.timeLineQueriesEmitter.emit({
                head: _this.item["head"],
                start: Date.parse(query["start"]),
                end: Date.parse(query["end"])
            });
        });
    };
    TimeLineComponent.prototype.isValidDate = function () {
        return !(this.item["startDate"].length == 25 &&
            this.item["endDate"].length == 25);
    };
    TimeLineComponent.prototype.reset = function () {
        this.item = __assign(__assign({}, this.item), { minValue: this.item.min, maxValue: this.item.max });
        this.resetFacet.emit(this.item);
    };
    __decorate([
        core_1.Input("items")
    ], TimeLineComponent.prototype, "items");
    __decorate([
        core_1.Input("item")
    ], TimeLineComponent.prototype, "item");
    __decorate([
        core_1.Output("timeLineQueriesEmitter")
    ], TimeLineComponent.prototype, "timeLineQueriesEmitter");
    __decorate([
        core_1.Output("itemsEmitter")
    ], TimeLineComponent.prototype, "itemsEmitter");
    __decorate([
        core_1.Output("minimize")
    ], TimeLineComponent.prototype, "minimize");
    __decorate([
        core_1.Output("removeFromItem")
    ], TimeLineComponent.prototype, "removeFromItem");
    __decorate([
        core_1.Output("resetFacet")
    ], TimeLineComponent.prototype, "resetFacet");
    TimeLineComponent = __decorate([
        core_1.Component({
            selector: "app-time-line",
            template: "\n        <div class=\"ml-5 pb-2\">\n            <div class=\"p-0 w-100 rounded style-border\">\n                <div class=\"py-2 px-2 level1\" fxLayout=\"row\">\n                    <mat-icon\n                        aria-label=\"close icon\"\n                        (click)=\"removeFromItem.emit(item)\"\n                    >\n                        highlight_off\n                    </mat-icon>\n                    <mat-icon\n                        *ngIf=\"item['isMinimize'] === false\"\n                        aria-label=\"close icon\"\n                        (click)=\"minimize.emit(item)\"\n                    >\n                        remove_circle_outline\n                    </mat-icon>\n                    <mat-icon\n                        *ngIf=\"item['isMinimize'] === true\"\n                        aria-label=\"close icon\"\n                        (click)=\"minimize.emit(item)\"\n                    >\n                        add_circle_outline\n                    </mat-icon>\n                    <span class=\"fw-600\">{{ item[\"head\"] }}</span>\n                    <span fxFlex></span>\n                    <div\n                        class=\"pointer px-1 white-color fw-600\"\n                        (click)=\"reset()\"\n                    >\n                        reset\n                    </div>\n                </div>\n                <div\n                    class=\"custom-slider w-100 level2\"\n                    style.height.px=\"50\"\n                    *ngIf=\"\n                        (item?.endDate !== undefined ||\n                            item?.startDate !== undefined) &&\n                        item['isMinimize'] === false\n                    \"\n                    fxLayout=\"row\"\n                    fxLayoutAlign=\"space-between center\"\n                    [formGroup]=\"FormRange\"\n                >\n                    <mat-form-field\n                        appearance=\"fill\"\n                        class=\"w-50\"\n                        style=\"background: #F3F6F9;\"\n                    >\n                        <mat-label>start date</mat-label>\n                        <input\n                            matInput\n                            [matDatepicker]=\"startPicker\"\n                            formControlName=\"start\"\n                            [max]=\"end\"\n                        />\n                        <mat-datepicker-toggle\n                            matSuffix\n                            [for]=\"startPicker\"\n                        ></mat-datepicker-toggle>\n                        <mat-datepicker #startPicker></mat-datepicker>\n                    </mat-form-field>\n\n                    <mat-form-field appearance=\"fill\" class=\"w-50\">\n                        <mat-label>end date</mat-label>\n                        <input\n                            matInput\n                            [matDatepicker]=\"endPicker\"\n                            formControlName=\"end\"\n                            [min]=\"start\"\n                        />\n                        <mat-datepicker-toggle\n                            matSuffix\n                            [for]=\"endPicker\"\n                        ></mat-datepicker-toggle>\n                        <mat-datepicker #endPicker></mat-datepicker>\n                    </mat-form-field>\n                </div>\n                <div\n                    [style.height.px]=\"10\"\n                    style=\"background: white\"\n                    *ngIf=\"item['isMinimize'] === false\"\n                    class=\"rounded-bottom\"\n                ></div>\n            </div>\n        </div>\n    ",
            styles: [
                "\n            ::ng-deep .mat-form-field-wrapper {\n                background: white !important;\n            }\n\n            ::ng-deep .mat-label,\n            .mat-datepicker-input {\n                font-family: Poppins !important;\n                font-weight: 600;\n            }\n\n            ::ng-deep .mat-form-field-appearance-fill .mat-form-field-flex {\n                background-color: #f3f6f9;\n                border-radius: 0 !important;\n            }\n\n            ::ng-deep .mat-form-field-appearance-fill {\n            }\n        ",
            ],
            providers: [common_1.DatePipe]
        })
    ], TimeLineComponent);
    return TimeLineComponent;
}());
exports.TimeLineComponent = TimeLineComponent;
