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

  constructor() {}
  ngOnInit() {}
  linkHistory(value, i) {
    this.indexRow = i;
    this.callOtherData.emit(value);
  }
}
