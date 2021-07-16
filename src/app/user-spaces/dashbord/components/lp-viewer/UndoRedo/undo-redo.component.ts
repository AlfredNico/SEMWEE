import { LpViwersService } from './../../../services/lp-viwers.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-undo-redo',
  templateUrl: './undo-redo.component.html',
  styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent implements OnInit {
  @Input() dataNameHistory: string[];
  @Output() callOtherData = new EventEmitter<any>();
  @Input() indexRow: any = undefined;

  constructor(private lpviwer : LpViwersService) {}
  ngOnInit() {}
  linkHistory(value, i) {
    this.lpviwer.isloadingHistory.next(true)
    this.indexRow = i;
    this.callOtherData.emit(value);
  }
}
