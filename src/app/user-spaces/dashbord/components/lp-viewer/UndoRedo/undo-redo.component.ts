import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-undo-redo',
  templateUrl: './undo-redo.component.html',
  styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent implements OnInit {
  @Input() dataNameHistory: string[];
  @Output() callOtherData = new EventEmitter<any>();
  @Input() indexRow: any = undefined;

  constructor(private readonly lpviLped: LpdLpdService) {}
  ngOnInit() {}
  linkHistory(value, i) {
    this.lpviLped.resetFacetFilter.next("true");
    this.indexRow = i;
    this.callOtherData.emit(value);
  }
}
