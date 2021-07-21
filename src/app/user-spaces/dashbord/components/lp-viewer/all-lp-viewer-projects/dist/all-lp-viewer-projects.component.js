"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AllLPViewerProjectsComponent = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var paginator_1 = require("@angular/material/paginator");
var operators_1 = require("rxjs/operators");
var remove_component_1 = require("../../projects/dialog/remove.component");
var AllLPViewerProjectsComponent = /** @class */ (function () {
    function AllLPViewerProjectsComponent(LPViewerProjectsService, dialog, notifs, auth, router, lpviLped) {
        this.LPViewerProjectsService = LPViewerProjectsService;
        this.dialog = dialog;
        this.notifs = notifs;
        this.auth = auth;
        this.router = router;
        this.lpviLped = lpviLped;
        this.user = this.auth.currentUserSubject.value;
    }
    AllLPViewerProjectsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.allProjects$ = this.LPViewerProjectsService.refresh$.pipe(operators_1.switchMap(function (_) {
            return _this.LPViewerProjectsService.getAllProjects(_this.user._id);
        }));
    };
    AllLPViewerProjectsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.allProjects$.subscribe(function (result) {
            if (result && result.length == 0) {
                _this.lpviLped.isLoading$.next(false); // disable loading spinner
                _this.router.navigateByUrl("/user-space/lp-viewer");
            }
        }, function (error) {
            if (error instanceof http_1.HttpErrorResponse) {
                _this.notifs.warn(error.message);
            }
            _this.lpviLped.isLoading$.next(false); // disable loading spinner
            _this.router.navigateByUrl("/user-space/lp-viewer");
        });
        this.lpviLped.isLoading$.next(false); // disable loading spinner
    };
    AllLPViewerProjectsComponent.prototype.removeAllProjects = function () {
        var _this = this;
        this.dialog
            .open(remove_component_1.RemoveComponent, {
            data: {
                message: "Are you sure to delete all projects ?"
            },
            width: "600px"
        })
            .afterClosed()
            .pipe(operators_1.map(function (result) {
            if (result === true) {
                _this.lpviLped
                    .removeAllProjects(_this.user._id)
                    .subscribe(function (result) {
                    if (result && result.message) {
                        _this.notifs.sucess(result.message);
                        _this.LPViewerProjectsService.refresh$.next(true);
                        _this.LPViewerProjectsService.trigrer$.next(true);
                    }
                });
            }
        }))
            .subscribe();
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: true })
    ], AllLPViewerProjectsComponent.prototype, "paginator");
    AllLPViewerProjectsComponent = __decorate([
        core_1.Component({
            selector: "app-all-lp-viewer-projects",
            templateUrl: "./all-lp-viewer-projects.component.html",
            styleUrls: ["./all-lp-viewer-projects.component.scss"]
        })
    ], AllLPViewerProjectsComponent);
    return AllLPViewerProjectsComponent;
}());
exports.AllLPViewerProjectsComponent = AllLPViewerProjectsComponent;
