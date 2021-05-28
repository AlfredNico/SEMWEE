import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LpEditorService } from '@app/user-spaces/dashbord/services/lp-editor.service';
import { LpdLpdService } from '../services/lpd-lpd.service';

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
      [dataViews]='dataViews'
      (itemsEmitter)='itemsEmitter($event)'
      (removeFromItem)='removeFromItemEmitter($event)'
      (minimize)='minimizeEmitter($event)'
    ></app-search-filter>
    </ng-template>

    <ng-template #inputTemplate let-currentValue="value">
      <app-input-filter
      [items]='items'
      [item]='item'
      [dataViews]='dataViews'
      (formGroup)='formGroupEmitter($event)'
      (removeFromItem)='removeFromItemEmitter($event, "input")'
      (minimize)='minimizeEmitter($event)'
      (itemsEmitter)='itemsEmitter($event)'
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
  public form = new FormGroup({});
  private queries = {};

  /* ALL QUERY FILTERS VALUES */
  private inputQueries: boolean[] = [];
  private searchQueries: boolean[] = [];
  private numericQeury: boolean[] = [];

  /* INPUT */
  @Input('dataViews') public dataViews: any[] = [];
  @Input('dataSources') public dataSources: any[] = [];


  constructor(
    private readonly lpEditor: LpEditorService,
    private readonly lpviLped: LpdLpdService,
    private fb: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    this.lpviLped.itemsObservables$.subscribe((res: any) => {
      if (res !== undefined) {
        this.items.push(res);
      }
    });
  }

  public removeAll() {
    this.lpviLped.dataSources$.next(this.dataViews);
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

    this.lpviLped.dataSources$.next(this.dataSources);
  }

  public callAfterInputFilter(inputQeury: boolean[]) {
    this.inputQueries = inputQeury;
  }

  public callAfterSearchFilter(searchQeury: boolean[]) {
    this.searchQueries = searchQeury;
  }

  public formGroupEmitter(form: any) {
    const value = Object.values(form).toString();
    const keys = Object.keys(form).toString();

    this.queries[keys] = value;

    this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
  }

  public minimizeEmitter(item: any): void {
    const index = this.items.indexOf(item);

    if (index !== -1) {
      this.items[index] = {
        ...this.items[index],
        isMinimize: !this.items[index]['isMinimize'],
      }
    }

    this.items = this.items;
  }

  public removeFromItemEmitter(item: any, removeName?: string): void {
    if (this.items.indexOf(item) !== -1) {
      this.items.splice(this.items.indexOf(item), 1);
    }

    this.items = this.items;

    if (removeName !== undefined) {
      const newObject = Object.keys(this.queries).reduce((accumulator, key) => {
        if (key !== item['head'])
          accumulator[key] = this.queries[key];
        return accumulator;
      }, {})
      this.queries = newObject;

      this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
    }
  }

  public itemsEmitter(event: any) {
    this.items = event;

    let search: boolean;
    const data = this.dataViews.filter((value: any, index: number) => {
      let i1: number = 0;
      let queries: boolean;
      const q = this.items.map((item: any): void => {
        let i2: number = 0;
        let str = '';
        item['content']?.map((element: any) => {
          if (element['include'] === true) {

            const q = `value["${item['head']}"].toString().includes("${element[0]}")`;
            if (i2 === 0) str = q;
            else str = `${str}||${q}`;
            i2++;
          }
        });
        search = str !== '' ? eval(str) : true;
        if (i1 === 0) queries = search;
        else queries = queries && search;
        i1++;
      });
      this.searchQueries[index] = queries;

      const q1 = this.CheckInput(index);
      const q2 = this.CheckNumeric(index);
      const q3 = this.CheckSearch(index);
      return q1 && q2 && q3;
    });

    this.lpviLped.dataSources$.next(data);
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

  private inputFilterFonciont() {
    let qqq = '', i1 = 0;

    const data = this.dataViews.filter((value: any, index: number) => {
      if (Object.values(this.queries).every((x) => x === null || x === '')) {
        this.searchQueries[index] = true;
        const q1 = this.CheckInput(index);
        const q2 = this.CheckNumeric(index);
        const q3 = this.CheckSearch(index);

        return q1 && q2 && q3;
      } else {
        let s = '', i2 = 0;
        Object.keys(value).some((property) => {
          if (
            this.queries[property] != '' &&
            typeof value[property] === 'string' &&
            this.queries[property] !== undefined &&
            value[property] !== undefined
          ) {
            const lower = (this.queries[property] as any).toLowerCase();
            const ss = `value["${property}"].toString().toLowerCase().includes("${lower}")`;
            if (i2 === 0) s = ss;
            else s = s + '&&' + ss;
            i2++;
          }
        });
        if (i1 === 0) qqq = eval(s);
        else qqq = qqq + '&&' + eval(s);
        i2++;
        this.searchQueries[index] = eval(qqq) !== undefined ? eval(qqq) : true;
        const q1 = this.CheckInput(index);
        const q2 = this.CheckNumeric(index);
        const q3 = this.CheckSearch(index);

        return q1 && q2 && q3;
      }
    });
    this.lpviLped.dataSources$.next(data);
  }


}
