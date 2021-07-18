"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.StylePaginatorDirective = void 0;
var core_1 = require("@angular/core");
var StylePaginatorDirective = /** @class */ (function () {
    function StylePaginatorDirective(matPag, vr, ren, lpviLped) {
        var _this = this;
        this.matPag = matPag;
        this.vr = vr;
        this.ren = ren;
        this.lpviLped = lpviLped;
        this._buttons = [];
        this._curPageObj = {
            length: 0,
            pageIndex: 0,
            pageSize: 0,
            previousPageIndex: 0
        };
        this._isFetchData = false;
        this._showTotalPages = 2;
        //to rerender buttons on items per page change and first, last, next and prior buttons
        this.matPag.page.subscribe(function (e) {
            if (_this._curPageObj.pageSize != e.pageSize &&
                _this._curPageObj.pageIndex != 0) {
                e.pageIndex = 0;
                _this._rangeStart = 0;
                _this._rangeEnd = _this._showTotalPages - 1;
            }
            _this._curPageObj = e;
            _this.initPageRange();
        });
        this.lpviLped.dataPaginator$.subscribe(function (res) {
            if (res) {
                _this._curPageObj = {
                    length: 0,
                    pageIndex: 0,
                    pageSize: 0,
                    previousPageIndex: 0
                };
                _this._rangeStart = 0;
                _this._rangeEnd = 0;
                _this._isFetchData = true;
                _this.initPageRange();
            }
        });
    }
    Object.defineProperty(StylePaginatorDirective.prototype, "showTotalPages", {
        get: function () {
            return this._showTotalPages;
        },
        set: function (value) {
            this._showTotalPages = value % 2 == 0 ? value + 1 : value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StylePaginatorDirective.prototype, "inc", {
        get: function () {
            return this._showTotalPages % 2 == 0
                ? this.showTotalPages / 2
                : (this.showTotalPages - 1) / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StylePaginatorDirective.prototype, "numOfPages", {
        get: function () {
            return this.matPag.getNumberOfPages();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StylePaginatorDirective.prototype, "lastPageIndex", {
        get: function () {
            return this.matPag.getNumberOfPages() - 1;
        },
        enumerable: false,
        configurable: true
    });
    StylePaginatorDirective.prototype.buildPageNumbers = function () {
        var _this = this;
        var _a, _b, _c, _d, _e;
        var actionContainer = this.vr.element.nativeElement.querySelector('div.mat-paginator-range-actions');
        var nextPageNode = this.vr.element.nativeElement.querySelector('button.mat-paginator-navigation-next');
        // remove buttons before creating new ones
        if (((_a = this._buttons) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this._buttons.forEach(function (button) {
                _this.ren.removeChild(actionContainer, button);
            });
            this._buttons.length = 0;
        }
        //initialize next page and last page buttons
        if (((_b = this._buttons) === null || _b === void 0 ? void 0 : _b.length) == 0) {
            var nodeArray_1 = (_e = (_d = (_c = this.vr.element) === null || _c === void 0 ? void 0 : _c.nativeElement) === null || _d === void 0 ? void 0 : _d.childNodes[0]) === null || _e === void 0 ? void 0 : _e.childNodes[0].childNodes[2].childNodes;
            setTimeout(function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                for (var i = 0; i < (nodeArray_1 === null || nodeArray_1 === void 0 ? void 0 : nodeArray_1.length); i++) {
                    if (_this._isFetchData) {
                        if (i == 0 || i == 1) {
                            (_a = _this.ren) === null || _a === void 0 ? void 0 : _a.setAttribute(nodeArray_1[i], 'disabled', 'true');
                        }
                        else if (i == 5 || i == 6)
                            (_b = _this.ren) === null || _b === void 0 ? void 0 : _b.setAttribute(nodeArray_1[i], 'disabled', 'false');
                    }
                    if (nodeArray_1[i].nodeName === 'BUTTON') {
                        if (nodeArray_1[i].innerHTML.length > 100 && nodeArray_1[i].disabled) {
                            _this.ren.setStyle(nodeArray_1[i], 'background-color', 'rgba(236, 241, 246, 1)');
                            _this.ren.setStyle(nodeArray_1[i], 'color', 'rgba(181, 181, 195, 1)');
                            (_c = _this.ren) === null || _c === void 0 ? void 0 : _c.setStyle(nodeArray_1[i], 'box-shadow', 'none');
                            (_d = _this.ren) === null || _d === void 0 ? void 0 : _d.setStyle(nodeArray_1[i], 'border-radius', '5px');
                            (_e = _this.ren) === null || _e === void 0 ? void 0 : _e.setStyle(nodeArray_1[i], 'margin', '.5%');
                        }
                        else if (nodeArray_1[i].innerHTML.length > 100 &&
                            !nodeArray_1[i].disabled) {
                            _this.ren.setStyle(nodeArray_1[i], 'background-color', 'rgba(236, 241, 246, 1)');
                            _this.ren.setStyle(nodeArray_1[i], 'color', 'rgba(181, 181, 195, 1)');
                            (_f = _this.ren) === null || _f === void 0 ? void 0 : _f.setStyle(nodeArray_1[i], 'box-shadow', 'none');
                            (_g = _this.ren) === null || _g === void 0 ? void 0 : _g.setStyle(nodeArray_1[i], 'border-radius', '5px');
                            (_h = _this.ren) === null || _h === void 0 ? void 0 : _h.setStyle(nodeArray_1[i], 'margin', '.5%');
                        }
                        else if (nodeArray_1[i].disabled) {
                            // } else if (this._isFetchData) {
                            _this.ren.setStyle(nodeArray_1[i], 'background-color', 'rgba(54, 153, 255, 1)');
                            (_j = _this.ren) === null || _j === void 0 ? void 0 : _j.setStyle(nodeArray_1[i], 'color', 'white');
                        }
                        else if (!nodeArray_1[i].disabled) {
                            // } else if (!this._isFetchData) {
                            (_k = _this.ren) === null || _k === void 0 ? void 0 : _k.setStyle(nodeArray_1[i], 'background-color', 'transparent');
                            (_l = _this.ren) === null || _l === void 0 ? void 0 : _l.setStyle(nodeArray_1[i], 'color', 'rgba(138, 140, 159, 1)');
                        }
                    }
                }
            });
        }
        for (var i = 0; i < this.numOfPages; i++) {
            if (i >= this._rangeStart && i <= this._rangeEnd) {
                if (this._isFetchData) {
                    this._isFetchData = false;
                    this.matPag.pageIndex = 0;
                }
                this.ren.insertBefore(actionContainer, this.createButton(i, this.matPag.pageIndex), nextPageNode);
            }
        }
    };
    StylePaginatorDirective.prototype.createButton = function (i, pageIndex) {
        var _this = this;
        var linkBtn = this.ren.createElement('button');
        this.ren.addClass(linkBtn, 'mat-mini-fab');
        this.ren.setStyle(linkBtn, 'margin', '1%');
        this.ren.setStyle(linkBtn, 'background-color', 'white');
        var pagingTxt = isNaN(i) ? '...' : +(i + 1);
        var text = this.ren.createText(pagingTxt + '');
        this.ren.addClass(linkBtn, 'mat-custom-page');
        switch (i) {
            case pageIndex:
                this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
                break;
            default:
                this.ren.listen(linkBtn, 'click', function () {
                    _this.switchPage(i);
                });
                break;
        }
        this.ren.appendChild(linkBtn, text);
        //Add button to private array for state
        this._buttons.push(linkBtn);
        return linkBtn;
    };
    //calculates the button range based on class input parameters and based on current page index value. Used to render new buttons after event.
    StylePaginatorDirective.prototype.initPageRange = function () {
        var middleIndex = (this._rangeStart + this._rangeEnd) / 2;
        this._rangeStart = this.calcRangeStart(middleIndex);
        this._rangeEnd = this.calcRangeEnd(middleIndex);
        this.buildPageNumbers();
    };
    //Helper function To calculate start of button range
    StylePaginatorDirective.prototype.calcRangeStart = function (middleIndex) {
        switch (true) {
            case this._curPageObj.pageIndex == 0 && this._rangeStart != 0:
                return 0;
            case this._curPageObj.pageIndex > this._rangeEnd:
                return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
                    ? this.lastPageIndex - this.inc * 2
                    : this._curPageObj.pageIndex - this.inc;
            case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
                this._curPageObj.pageIndex > middleIndex &&
                this._rangeEnd < this.lastPageIndex:
                return this._rangeStart + 1;
            case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
                this._curPageObj.pageIndex < middleIndex &&
                this._rangeStart > 0:
                return this._rangeStart - 1;
            default:
                return this._rangeStart;
        }
    };
    //Helpter function to calculate end of button range
    StylePaginatorDirective.prototype.calcRangeEnd = function (middleIndex) {
        switch (true) {
            case this._curPageObj.pageIndex == 0 &&
                this._rangeEnd != this._showTotalPages:
                return this._showTotalPages - 1;
            case this._curPageObj.pageIndex > this._rangeEnd:
                return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
                    ? this.lastPageIndex
                    : this._curPageObj.pageIndex + 1;
            case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
                this._curPageObj.pageIndex > middleIndex &&
                this._rangeEnd < this.lastPageIndex:
                return this._rangeEnd + 1;
            case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
                this._curPageObj.pageIndex < middleIndex &&
                this._rangeStart >= 0 &&
                this._rangeEnd > this._showTotalPages - 1:
                return this._rangeEnd - 1;
            default:
                return this._rangeEnd;
        }
    };
    //Helper function to switch page on non first, last, next and previous buttons only.
    StylePaginatorDirective.prototype.switchPage = function (i) {
        // console.log('switch', i);
        var previousPageIndex = this.matPag.pageIndex;
        this.matPag.pageIndex = i;
        this.matPag['_emitPageEvent'](previousPageIndex);
        this.initPageRange();
    };
    //Initialize default state after view init
    StylePaginatorDirective.prototype.ngAfterViewInit = function () {
        this._rangeStart = 0;
        this._rangeEnd = this._showTotalPages - 1;
        this.initPageRange();
    };
    __decorate([
        core_1.Input()
    ], StylePaginatorDirective.prototype, "showTotalPages");
    StylePaginatorDirective = __decorate([
        core_1.Directive({
            selector: '[appStylePaginator]'
        }),
        __param(0, core_1.Host()), __param(0, core_1.Self()), __param(0, core_1.Optional())
    ], StylePaginatorDirective);
    return StylePaginatorDirective;
}());
exports.StylePaginatorDirective = StylePaginatorDirective;
