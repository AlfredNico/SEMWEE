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
exports.LPViewerProjectsComponent = void 0;
var core_1 = require("@angular/core");
var remove_component_1 = require("@app/user-spaces/dashbord/components/projects/dialog/remove.component");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var LPViewerProjectsComponent = /** @class */ (function () {
    function LPViewerProjectsComponent(lPViewerProjectsService, dialog, notifs, triggerServices, router, lpviLped) {
        this.lPViewerProjectsService = lPViewerProjectsService;
        this.dialog = dialog;
        this.notifs = notifs;
        this.triggerServices = triggerServices;
        this.router = router;
        this.lpviLped = lpviLped;
        this.allProjects$ = new rxjs_1.Observable(undefined);
        this.allProjects = [];
        this.dataSources = [];
    }
    LPViewerProjectsComponent.prototype.ngOnChanges = function () {
        var _this = this;
        this.allProjects$.subscribe(function (resulat) {
            _this.dataSources = resulat;
            _this.allProjects = resulat.slice(0, 10);
        });
        this.paginator = {
            pageIndex: 0,
            pageSize: 10,
            nextPage: 0,
            previousPageIndex: 1,
            pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
        };
    };
    LPViewerProjectsComponent.prototype.getServerData = function (event) {
        var page = event.pageIndex * event.pageSize;
        var lenghtPage = event.pageSize * (event.pageIndex + 1);
        this.paginator.nextPage = this.paginator.nextPage + event.pageSize;
        this.allProjects = this.dataSources.slice(page, lenghtPage);
        if (this.paginator.pageSize != event.pageSize)
            this.lpviLped.dataPaginator$.next(true);
        this.paginator = __assign(__assign({}, this.paginator), event);
    };
    LPViewerProjectsComponent.prototype.onDelete = function (item) {
        var _this = this;
        this.dialog
            .open(remove_component_1.RemoveComponent, {
            data: {
                message: 'Are you sure to delete this project ?'
            },
            width: '600px'
        })
            .afterClosed()
            .pipe(operators_1.map(function (result) {
            if (result === true) {
                _this.lPViewerProjectsService
                    .deleteProjects(item._id)
                    .subscribe(function (result) {
                    if (result && result.message) {
                        _this.notifs.sucess(result.message);
                        _this.lPViewerProjectsService.refresh$.next(true);
                        _this.triggerServices.trigrer$.next(true);
                    }
                });
            }
        }))
            .subscribe();
    };
    LPViewerProjectsComponent.prototype.navigateURL = function (_id) {
        this.lpviLped.isLoading$.next(true); // enable loading spinner
        this.router.navigate(['user-space/lp-viewer'], {
            queryParams: { idProject: _id }
        });
    };
    __decorate([
        core_1.Input()
    ], LPViewerProjectsComponent.prototype, "allProjects$");
    LPViewerProjectsComponent = __decorate([
        core_1.Component({
            selector: 'app-lp-viewer-projects',
            templateUrl: './lp-viewer-projects.component.html',
            styleUrls: ['./lp-viewer-projects.component.scss']
        })
    ], LPViewerProjectsComponent);
    return LPViewerProjectsComponent;
}());
exports.LPViewerProjectsComponent = LPViewerProjectsComponent;
