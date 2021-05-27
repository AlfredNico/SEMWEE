import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { LpEditorService } from '@app/user-spaces/dashbord/services/lp-editor.service';

@Component({
  selector: 'app-facet-filter-target',
  template: `
<div *ngIf="items.length > 0; else noItems">
  <div class="w-100 px-2 pb-3">
    <button class="rounded">Refresh</button>
    <span fxFlex></span>
    <button class="rounded" (click)="resetAll()">Reset All</button>
    <button class="rounded" (click)="removeAll()">Remove All</button>
  </div>

  <div *ngFor="let item of items">
     <ng-container
      *ngTemplateOutlet="item.type === 'search' ? searchTemplate : item.type === 'input' ? inputTemplate : numericTemplate; context:{value: item}">
    </ng-container>

    <ng-template #searchTemplate let-currentValue="value">
    <app-search-filter
      [items]='items'
      [item]='item'
    ></app-search-filter>
    </ng-template>

    <ng-template #inputTemplate let-currentValue="value">
      <app-input-filter
      [items]='items'
      [item]='item'
      ></app-input-filter>
    </ng-template>

    <ng-template #numericTemplate let-currentValue="value">
      <app-numeric-facet
      [items]='items'
      [item]='item'
      [minValue]="item['minValue']"
      [maxValue]="item['maxValue']"
      [options]="item['options']"
      [dataViews]='dataViews'
      [dataSources]='dataSources'
      (numericQueriesEmitter)="callAfterNumericFilter($event)"
      ></app-numeric-facet>
    </ng-template>
  </div>
</div>

<ng-template #noItems>
  <div style="background: #e3e9ff;" class="rounded w-100 px-3 py-5">
    <h1>Using facets and filters</h1>
    <p class="m-0">
      Use facets and filters to select subsets of your data to act on. Choose facet and filter methods from the menus at the top of each data column.
    </p>
</div>
</ng-template>

  `,
  styles: [
  ]
})
export class FacetFilterComponent implements AfterViewInit {
  /* VARIABLES */
  public items: any[] = [];

  /* ALL QUERY FILTERS VALUES */
  private inputQueries: boolean[] = [];
  private searchQueries: boolean[] = [];
  private numericQeury: boolean[] = [];

  /* INPUT */
  @Input() public dataViews: any[] = [];
  @Input() public dataSources: any[] = [];


  constructor(private readonly lpEditor: LpEditorService) { }

  ngAfterViewInit(): void {
    this.lpEditor.itemsObservables$.subscribe((res: any) => {
      if (res !== undefined) {
        this.items.push(res);
      }
    });
  }


  public removeFromItem(item: any) {
    if (this.items.indexOf(item) !== -1) {
      this.items.splice(this.items.indexOf(item), 1);
    }
    const query = {};

    this.items = this.items;
  }

  public removeAll() {
    this.lpEditor.dataSources$.next(this.dataViews);
    this.items = [];
    this.inputQueries = [];
    this.searchQueries = [];
    this.numericQeury = [];
  }

  public resetAll() {
    this.inputQueries = [];
    this.searchQueries = [];
    this.numericQeury = [];

    this.items.map((item: any) => {
      item['content']?.map((value: any, i: number) => {
        item['content'][i] = {
          ...item['content'][i],
          include: false
        }
      });
    });
  }

  /* EMITTER FUNCTION AFTER FILTER FROM COMPONENTS */
  public callAfterNumericFilter(numericQeury: boolean[]) {
    this.numericQeury = numericQeury;

    this.dataSources = this.dataViews.filter((value: any, index: number) => {
      const q1 = this.CheckNumeric(index);
      const q2 = this.CheckInput(index);
      const q3 = this.CheckSearch(index);

      return q1 && q2 && q3;
    });

    this.lpEditor.dataSources$.next(this.dataSources);
  }

  public callAfterInputFilter(inputQeury: boolean[]) {
    this.inputQueries = inputQeury;
  }

  public callAfterSearchFilter(searchQeury: boolean[]) {
    this.searchQueries = searchQeury;
  }



  /* VERIFY ALL QUERY FILTERS */
  private CheckNumeric(index: number): boolean {
    if (this.numericQeury.length !== 0) return this.numericQeury[index];
    return true;
  }
  private CheckInput(index: number): boolean {
    if (this.inputQueries.length !== 0) return this.inputQueries[index];
    return true;
  }

  private CheckSearch(index: number): boolean {
    if (this.searchQueries.length !== 0) return this.searchQueries[index];
    return true;
  }


}
