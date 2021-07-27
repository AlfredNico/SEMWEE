import { LpViwersService } from "./../../../services/lp-viwers.service";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LpdLpdService } from "@app/shared/components/LPVi-LPEd/services/lpd-lpd.service";

@Component({
    selector: "app-undo-redo",
    templateUrl: "./undo-redo.component.html",
    styleUrls: ["./undo-redo.component.scss"],
})
export class UndoRedoComponent {
    @Input() dataNameHistory: string[];
    @Output() callOtherData = new EventEmitter<any>();
    @Input() indexRow: any = undefined;

    constructor(
        private lpviwer: LpViwersService,
        private readonly lpviLped: LpdLpdService
    ) {}

    public linkHistory(value, i) {
        this.lpviwer.isloadingHistory.next(true);
        this.lpviLped.resetfilter.next("true");
        this.indexRow = i;
        this.callOtherData.emit(value);
    }
}
