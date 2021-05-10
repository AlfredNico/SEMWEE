import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-facet-filter',
  template: `
    <div class="mx-1 pb-2" appFluidHeight [minHeight]="50" *ngFor="let item of items">
      <div class="p-0 w-100" style="border: 4px solid #93cdff; border-radius: 5%;">
        <div fxLayout="row" class="py-3 px-2" style="background: #bbccff; position: relative; top: -1px">
          <mat-icon aria-label="close icon" (click)="removeFromItem(item)">highlight_off</mat-icon>
          <mat-icon aria-label="close icon">remove_circle_outline</mat-icon>
          <span style="font-weight: 600;">{{ item['head'] }}</span>
          <span fxFlex></span>
          <div>change</div>
        </div>
        <div fxLayout="row" class="py-3 px-2" style="background: #e3e9ff;">
          <div class="pr-3"> 1 choices</div>
          <div> Sort by : <span class="px-1"></span>name<span class="px-1">count</span> </div>
        </div>
        <div class="py-2" style="height: 200px; overflow: auto;let index = index">
          <div fxLayout="row" class="py-2 px-2 list-content" fxLayoutAlign="space-between center"
          *ngFor="let content of item?.content">
            <div> {{ content[0] }}  <span> {{ content[1] }} </span> </div>
            <span class="only-show-on-hover">include</span>
          </div>
        </div>
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
      .list-content span.only-show-on-hover {
        visibility: hidden;
      }
      .list-content:hover span.only-show-on-hover  {
        visibility: visible;
      }
  `]
})
export class FacetFilterComponent implements OnInit {
  @Input() public items: any[];
  changeText: boolean;

  constructor() { }

  ngOnInit(): void { }

  public removeFromItem(item: any) {
    if (this.items.indexOf(item) !== -1) {
      this.items.splice(this.items.indexOf(item), 1);
    }
  }

}
