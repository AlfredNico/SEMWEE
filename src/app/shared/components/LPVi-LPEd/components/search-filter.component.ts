import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  template: `
    <div class="mx-1 pb-2" appFluidHeight>
      <div class="p-0 w-100 rounded style-border">
        <div class="py-2 px-2 rounded-top level1 bb" fxLayout="row">
          <mat-icon aria-label="close icon" (click)="removeFromItem.emit(item)">
            highlight_off
          </mat-icon>
          <mat-icon
            *ngIf="item['isMinimize'] === false"
            aria-label="close icon"
            (click)="minimize.emit(item)"
          >
            remove_circle_outline
          </mat-icon>
          <mat-icon
            *ngIf="item['isMinimize'] === true"
            aria-label="close icon"
            (click)="minimize.emit(item)"
          >
            add_circle_outline
          </mat-icon>
          <span class="fw-600">{{ item['head'] }}</span>
          <span fxFlex></span>
          <div class="pointer px-1 black-color fw-600">change</div>
        </div>
        <div
          fxLayout="row"
          class="py-2 px-2 level2"
          *ngIf="item['isMinimize'] === false"
        >
          <div class="pr-3 pointer black-color fw-600">
            {{ couter }} choices
          </div>
          <div>
            Sort by :
            <span
              class="px-1 pointer black-color fw-600"
              [ngStyle]="{
                color: isSortName ? 'rgb(27, 197, 189)' : null
              }"
              (click)="sortByName()"
              >name</span
            >
            <span
              class="px-1 pointer black-color fw-600"
              [ngStyle]="{
                color: isSortCount ? 'rgb(27, 197, 189)' : null
              }"
              (click)="sortByCount()"
              >count</span
            >
          </div>
        </div>
        <div
          class="py-2"
          style="height: 150px; overflow: auto"
          *ngIf="item['isMinimize'] === false"
        >
          <div
            fxLayout="row"
            class="py-0 px-2 list-content"
            fxLayoutAlign="space-between center"
            *ngFor="let content of item?.content"
          >
            <div fxLayout="row">
              <p
                class="font-weight-bold m-0 pr-2 pointer"
                [ngStyle]="{
                  color: content['include'] === false ? '#2464a4' : '#1BC5BD'
                }"
              >
                {{ content[0] }}
              </p>
              <span style="color: #7E849C"> {{ content[1] }} </span>
            </div>
            <span
              class="only-show-on-hover pointer in-ex"
              *ngIf="content['include'] === false"
              (click)="include(item, content[0])"
            >
              include
            </span>
            <span
              class="pointer in-ex"
              *ngIf="content['include'] === true"
              (click)="exclude(item, content[0])"
            >
              exclude
            </span>
          </div>
        </div>
      </div>
      <div class="w-100 resizable"></div>
    </div>
  `,
  styles: [],
})
export class SearchFilterComponent implements OnInit {
  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('dataViews') dataViews: any[] = [];
  @Input('item') item: any = undefined;
  @Input('index') index: any = undefined;

  /* OUTPUT */
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();
  @Output('itemsEmitter') itemsEmitter: any = new EventEmitter();

  //VARIABLE
  public couter: number = 0;
  public isSortName: boolean = false;
  public isSortCount: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public exclude(headName: any, contentName: string) {
    const index = this.items.indexOf(headName);
    if (index !== -1) {
      this.items[index].content.map((val: any, i: number) => {
        if (val[0] === contentName) {
          this.items[index].content[i] = {
            ...this.items[index].content[i],
            include: !this.items[index].content[i]['include'],
          };
          this.couter--;
        }
      });
    }

    this.itemsEmitter.emit(this.items);
  }

  public include(headName: any, contentName: string) {
    // this.couter = 0;
    const index = this.items.indexOf(headName);
    if (index !== -1) {
      this.items[index].content.map((val, i) => {
        if (val[0] === contentName) {
          this.items[index].content[i] = {
            ...this.items[index].content[i],
            include: !this.items[index].content[i]['include'],
          };
          this.couter++;
        }
      });
    }

    this.itemsEmitter.emit(this.items);
  }

  public sortByName(): void {
    this.isSortName = !this.isSortName;
    this.items[this.index].content.sort((prev, next) =>
      this.isSortName ? this.ASC(prev, next, 0) : this.DESC(prev, next, 0)
    );
  }
  public sortByCount(): void {
    this.isSortCount = !this.isSortCount;
    this.items[this.index].content.sort((prev, next) =>
      this.isSortCount ? this.ASC(prev, next, 1) : this.DESC(prev, next, 1)
    );
  }

  private DESC(i, ii, key) {
    return i[key] > ii[key] ? -1 : i[key] < ii[key] ? 1 : 0;
  }

  private ASC(i, ii, key) {
    return i[key] > ii[key] ? 1 : i[key] < ii[key] ? -1 : 0;
  }
}
