"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UndoRedoComponent = void 0;
var core_1 = require("@angular/core");
var UndoRedoComponent = /** @class */ (function () {
    function UndoRedoComponent(lpviwer, lpviLped) {
        this.lpviwer = lpviwer;
        this.lpviLped = lpviLped;
        this.callOtherData = new core_1.EventEmitter();
        this.indexRow = undefined;
    }
    UndoRedoComponent.prototype.linkHistory = function (value, i) {
        this.lpviwer.isloadingHistory.next(true);
        this.lpviLped.resetfilter.next("true");
        this.indexRow = i;
        this.callOtherData.emit(value);
    };
    __decorate([
        core_1.Input()
    ], UndoRedoComponent.prototype, "dataNameHistory");
    __decorate([
        core_1.Output()
    ], UndoRedoComponent.prototype, "callOtherData");
    __decorate([
        core_1.Input()
    ], UndoRedoComponent.prototype, "indexRow");
    UndoRedoComponent = __decorate([
        core_1.Component({
            selector: "app-undo-redo",
            templateUrl: "./undo-redo.component.html",
            styleUrls: ["./undo-redo.component.scss"]
        })
    ], UndoRedoComponent);
    return UndoRedoComponent;
}());
exports.UndoRedoComponent = UndoRedoComponent;
