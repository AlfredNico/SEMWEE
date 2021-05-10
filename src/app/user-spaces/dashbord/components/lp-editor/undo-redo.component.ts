import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-undo-redo',
  template: `
    <div class="mx-1">
      <div class="p-5" style="border: 4px solid #93cdff">
        undo-redo works!
      </div>
      <span style="cursor: col-resize; heigth: 5px"></span>
    </div>
  `,
  styles: [
  ]
})
export class UndoRedoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
