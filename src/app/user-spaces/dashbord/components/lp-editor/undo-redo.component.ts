import { Component, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-undo-redo',
  template: `
  <div class="w-100 px-2 pb-3" style="background: #e3e9ff; border-bottom: 2px solid rgb(147, 205, 255);">
      <span fxFlex></span>
      <button class="rounded">Extract</button>
      <button class="rounded">Appy</button>
    </div>
     <div class="px-2 py-2" style="background: #e3e9ff; border-bottom: 2px solid rgb(147, 205, 255);">
       <label>Filter</label>
      <input autocomplete="off" type="search" class="w-100" placeholder="filter ..."
      [formControl]="filter" appearance="outline">
    </div>
   <div class="bg-white px-4 py-2" style="border-bottom: 1px black dotted;">
      <a class="link-secondary">
        <span class="history-entry-index">0.</span>
        <span class="pl-4">Create project</span>
      </a>
    </div>
    <div class="bg-white px-4 py-2" style="border-bottom: 1px black dotted;">
      <a class="link-secondary">
        <span>2.</span>
        <span class="pl-4">Edit single cell on row 1, column CEO</span>
      </a>
    </div>
  `,
  styles: [
  ]
})
export class UndoRedoComponent implements OnInit, AfterViewInit {

  @Output() messageEvent = new EventEmitter<string>();
  public redoItmes: any[] = [];

  public filter = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.filter.valueChanges
      .pipe(
        map((query) => {
          console.log('filter')
        })
      )
      .subscribe();
  }


}
