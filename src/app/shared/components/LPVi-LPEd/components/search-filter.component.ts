import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  template: `
    <div class="mx-1 pb-2" appFluidHeight>
      <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
        <div class="py-2 px-2 rounded-top" style="background: #bbccff;" fxLayout="row" >
          <mat-icon aria-label="close icon" (click)="removeFromItem.emit(item)">
            highlight_off
          </mat-icon>
          <mat-icon *ngIf="item['isMinimize'] === false" aria-label="close icon"
          (click)="minimize.emit(item)">
            remove_circle_outline
          </mat-icon>
          <mat-icon *ngIf="item['isMinimize'] === true" aria-label="close icon"
          (click)="minimize.emit(item)">
            add_circle_outline
          </mat-icon>
          <span style="font-weight: 600;">{{ item['head'] }}</span>
          <span fxFlex></span>
          <div class="pointer">change</div>
        </div>
         <div fxLayout="row" class="py-2 px-2" style="background: #e3e9ff;"
         *ngIf="item['isMinimize'] === false">
          <div class="pr-3 pointer"> 1 choices</div>
          <div> Sort by :
            <span class="px-1 pointer">name</span>
            <span class="px-1 pointer">count</span>
          </div>
        </div>
        <div class="py-2" style="height: 150px; overflow: auto"
        *ngIf="item['isMinimize'] === false">
          <div fxLayout="row" class="py-0 px-2 list-content" fxLayoutAlign="space-between center"
          *ngFor="let content of item?.content">
            <div fxLayout="row">
              <p class="font-weight-bold m-0 pr-2 pointer" [ngStyle]="{'color':content['include'] === false ? '#3d5be2' : '#ff6a00' }">
                {{ content[0] }}
              </p>
              <span style="color: #a89ca2"> {{ content[1] }} </span>
            </div>
            <span class="only-show-on-hover pointer" *ngIf="content['include'] === false" (click)="include(item, content[0])">
              include
            </span>
            <span class="pointer" *ngIf="content['include'] === true" (click)="exclude(item, content[0])">
              exclude
            </span>
          </div>
        </div>
      </div>
      <div class="w-100 resizable"></div>
    </div>
  `,
  styles: [
  ]
})
export class SearchFilterComponent implements OnInit {

  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('dataViews') dataViews: any[] = [];
  @Input('item') item: any = undefined;

  /* OUTPUT */
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();
  @Output('itemsEmitter') itemsEmitter: any = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  public exclude(headName: any, contentName: string) {

    const index = this.items.indexOf(headName);
    if (index !== -1) {
      this.items[index].content.map((val: any, i: number) => {
        if (val[0] === contentName) {
          this.items[index].content[i] = {
            ...this.items[index].content[i],
            include: !this.items[index].content[i]['include']
          }
        };
      });
    };

    this.itemsEmitter.emit(this.items);

    // this.checkIncludesExcludes();
  }

  public include(headName: any, contentName: string) {

    const index = this.items.indexOf(headName);
    if (index !== -1) {
      this.items[index].content.map((val: any, i: number) => {
        if (val[0] === contentName) {
          this.items[index].content[i] = {
            ...this.items[index].content[i],
            include: !this.items[index].content[i]['include']
          }
        }
      })
    }

    this.itemsEmitter.emit(this.items);
    // this.checkIncludesExcludes();
  }

}
