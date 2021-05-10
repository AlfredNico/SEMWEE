import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-facet-filter',
  template: `
    <div class="mx-1">
      <div class="p-5" style="border: 4px solid #93cdff">
        facet-filter works!
      </div>
      <div class="w-100 resizable"></div>
    </div>
  `,
  styles: [`
      div.resizable{
        cursor: row-resize;
        height: 10px;
        top: -10px;
        position: relative;
      }
  `]
})
export class FacetFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   console.log('edoti');
  // }

}
