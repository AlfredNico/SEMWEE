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
exports.LpdLpdService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("@environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var LpdLpdService = /** @class */ (function () {
    function LpdLpdService(http, common) {
        var _this = this;
        this.http = http;
        this.common = common;
        /* Emittter value from clicked USER */
        this.itemsObservables$ = new rxjs_1.BehaviorSubject(undefined);
        this.searchReplace$ = new rxjs_1.BehaviorSubject(undefined);
        this.resetfilter = new rxjs_1.Subject();
        /* Emittter value dataSources after filter USER */
        this.dataSources$ = new rxjs_1.BehaviorSubject(undefined);
        this.dataPaginator$ = new rxjs_1.BehaviorSubject(false);
        this.inputSubject = new rxjs_1.Subject();
        // data: [],
        this.permaLink = {
            input: [],
            numeric: [],
            search: [],
            items: [],
            name: [],
            queries: {},
            queriesNumerisFilters: {},
            queriesTimeLineFilters: {}
        };
        this.formInputQuery = {};
        this.isLoading$ = new rxjs_1.BehaviorSubject(true);
        this.ROUTER_URL = environment_1.environment.baseUrl + "/lpviewer";
        this.isLoading$.subscribe(function (res) {
            if (res === true)
                _this.common.showSpinner("table", true, "");
            else
                setTimeout(function () {
                    _this.common.hideSpinner("table");
                }, 500);
        });
    }
    LpdLpdService.prototype.getSavedProjects = function (idProject) {
        var _this = this;
        return this.http
            .get(this.ROUTER_URL + "/get-permalink/" + idProject)
            .pipe(operators_1.map(function (res) {
            var _a;
            if (res[3].length !== 0)
                _this.permaLink = __assign({}, JSON.parse(res[3][0]["value"]));
            if (res[2].length !== 0)
                _this.formInputQuery = __assign({}, JSON.parse(res[2][0]["value"]));
            var header = JSON.parse(JSON.stringify((_a = res[0][0]) === null || _a === void 0 ? void 0 : _a.nameUpdate.split('"').join(""))).split(",");
            header.unshift("all");
            return {
                headerOrigin: header,
                data: res[1],
                formInputQuery: _this.formInputQuery,
                permaLink: _this.permaLink,
                name: res[4],
                projectName: res[5]
            };
        }));
    };
    //remove-all-projects
    LpdLpdService.prototype.removeAllProjects = function (idUser) {
        return this.http.post(this.ROUTER_URL + "/remove-all-projects", { idUser: idUser });
    };
    LpdLpdService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], LpdLpdService);
    return LpdLpdService;
}());
exports.LpdLpdService = LpdLpdService;
