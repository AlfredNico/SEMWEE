import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LpEditorService } from '@app/user-spaces/dashbord/services/lp-editor.service';
import { LpdLpdService } from '../services/lpd-lpd.service';

@Component({
  selector: 'app-facet-filter-target',
  template: `
    <div *ngIf="items.length > 0; else noItems">
      <div class="w-100 px-2 pb-3">
        <button class="rounded btn btn-custom">Refresh</button>
        <span fxFlex></span>
        <button class="rounded btn btn-custom mr-2" (click)="resetAll()">
          Reset All
        </button>
        <button class="rounded btn btn-custom" (click)="removeAll()">
          Remove All
        </button>
      </div>

      <div *ngFor="let item of items; let index = index">
        <ng-container
          *ngTemplateOutlet="
            item.type === 'search'
              ? searchTemplate
              : item.type === 'input'
              ? inputTemplate
              : item.type === 'datefilter' 
              ? dateTemplate
              : item.type === 'numeric'
              ? numericTemplate
              : timeLineTemplate;
            context: { value: item }
          "
        >
        </ng-container>

        <ng-template #searchTemplate let-currentValue="value">
          <app-search-filter
            [items]="items"
            [item]="item"
            [dataViews]="dataViews"
            (itemsEmitter)="itemsEmitter($event)"
            (removeFromItem)="removeFromItemEmitter($event, 'search')"
            (minimize)="minimizeEmitter($event)"
          ></app-search-filter>
        </ng-template>

        <ng-template #inputTemplate let-currentValue="value">
          <app-input-filter
            [items]="items"
            [item]="item"
            [index]="index"
            [dataViews]="dataViews"
            (formGroup)="formGroupEmitter($event)"
            (removeFromItem)="removeFromItemEmitter($event, 'input')"
            (minimize)="minimizeEmitter($event)"
            (itemsEmitter)="itemsEmitter($event)"
          ></app-input-filter>
        </ng-template>

        <ng-template #dateTemplate let-currentValue="value">
          <app-date-filter
          [items]="items"
          [item]="item"
          [index]="index"
          [dataViews]="dataViews"
          (formGroup)="formGroupEmitter($event)"
          (removeFromItem)="removeFromItemEmitter($event, 'input')"
          (minimize)="minimizeEmitter($event)"
          (itemsEmitter)="itemsEmitter($event)"
          ></app-date-filter>
        </ng-template>

        <ng-template #numericTemplate let-currentValue="value">
          <app-numeric-facet
            [items]="items"
            [item]="item"
            [dataViews]="dataViews"
            [dataSources]="dataSources"
            (numericQueriesEmitter)="callAfterNumericFilter($event)"
            (removeFromItem)="removeFromItemEmitter($event, 'number')"
            (minimize)="minimizeEmitter($event)"
          ></app-numeric-facet>
        </ng-template>

        <ng-template #timeLineTemplate let-currentValue="value">
          <app-time-line
            [items]="items"
            [item]="item"
            [dataViews]="dataViews"
            [dataSources]="dataSources"
            (numericQueriesEmitter)="callAfterNumericFilter($event)"
            (removeFromItem)="removeFromItemEmitter($event, 'timeLine')"
            (minimize)="minimizeEmitter($event)"
          ></app-time-line>
        </ng-template>
      </div>
    </div>

    <ng-template #noItems>
      <div style="background: #EEE5FF;" class="w-100 px-3 py-5">
        <h1>Using facets and filters</h1>
        <p class="m-0">
          Use facets and filters to select subsets of your data to act on.
          Choose facet and filter methods from the menus at the top of each data
          column.
        </p>
      </div>
    </ng-template>
  `,
  styleUrls: ['./facet-filter.component.scss'],
})
export class FacetFilterComponent implements AfterViewInit, OnInit {
  /* VARIABLES */
  public form = new FormGroup({});
  private queries = {};

  /* ALL QUERY FILTERS VALUES */
  private inputQueries: boolean[] = [];
  private searchQueries: boolean[] = [];
  private numericQeury: boolean[] = [];
  private queriesNumerisFilters = {};
  // private checkedInput = {};

  /* INPUT */
  @Input('dataViews') public dataViews: any[] = [];
  @Input('dataSources') public dataSources: any[] = [];
  @Input('idProject') public idProject = undefined;
  @Input('items') public items: any[] = [];

  constructor(
    private readonly lpEditor: LpEditorService,
    private readonly lpviLped: LpdLpdService,
    private fb: FormBuilder
  ) {
    console.log(this.items);
  }

  ngOnInit(): void {
    if (Object.keys(this.lpviLped.permaLink).length !== 0) {
      this.inputQueries = this.lpviLped.permaLink['input'];
      this.searchQueries = this.lpviLped.permaLink['search'];
      this.numericQeury = this.lpviLped.permaLink['numeric'];
      this.items = this.lpviLped.permaLink['items'];
      this.queries = this.lpviLped.permaLink['queries'];
      this.queriesNumerisFilters =
        this.lpviLped.permaLink['queriesNumerisFilters'];
    }
  }

  ngAfterViewInit(): void {
    this.lpviLped.itemsObservables$.subscribe((res: any) => {
      if (res !== undefined) {
        this.items.push(res);

        this.savePermalink(); // SAVE PERMALINK
      }
    });
  }

  public removeAll() {
    this.lpviLped.dataSources$.next(this.dataViews);
    this.items = [];
    this.inputQueries = [];
    this.searchQueries = [];
    this.numericQeury = [];
    this.dataSources = this.dataViews;
    this.queries = {};
    this.queriesNumerisFilters = {};

    this.lpviLped.permaLink = {
      input: [],
      numeric: [],
      search: [],
      items: [],
      name: [],
      queries: {},
      queriesNumerisFilters: {},
    };

    this.savePermalink(); // SAVE PERMALINK
  }

  public resetAll() {
    this.inputQueries = [];
    this.searchQueries = [];
    this.numericQeury = [];
    this.queries = {};
    this.queriesNumerisFilters = {};
    this.lpviLped.dataSources$.next(this.dataViews);
    this.dataSources = this.dataViews;

    this.items.map((item, index) => {
      if (item['type'] === 'search') {
        item['content']?.map((value, i) => {
          item['content'][i] = {
            ...value,
            include: false,
          };
        });
      } else if (item['type'] === 'search') {
        this.items[index] = {
          ...item,
          value: '',
        };
      } else if (item['type'] === 'numeric') {
        this.items[index] = {
          ...item,
          options: {
            ...item['options'],
            floor: item['minValue'],
            ceil: item['maxValue'],
          },
        };
      }
    });

    this.items = this.items;
    this.savePermalink(); // SAVE PERMALINK
  }

  /* EMITTER FUNCTION AFTER FILTER FROM COMPONENTS */
  public callAfterNumericFilter(event: any) {
    let q = [],
      ss;

    this.dataSources = this.dataViews.filter((value, index) => {
      const v = value[`${event['head']}`];
      if (Object.keys(this.queriesNumerisFilters).length === 0) {
        if (
          v >= event['minValue'] &&
          v <= event['maxValue'] &&
          Number.isFinite(v) === true
        )
          q[index] = true;
        else q[index] = false;
        return (ss = q[index]);
      } else {
        return Object.keys(this.queriesNumerisFilters).every((x) => {
          const s = this.queriesNumerisFilters[x];
          if (
            v >= event['minValue'] &&
            v <= event['maxValue'] &&
            Number.isFinite(v) === true
          )
            q[index] = true;
          else q[index] = false;

          if (x === event['head']) ss = q;

          return (ss = s[index] && q[index]);
        });
      }
    });

    this.queriesNumerisFilters[`${event['head']}`] = this.numericQeury = q;
    this.lpviLped.dataSources$.next(this.dataSources);
    this.savePermalink(); // SAVE PERMALINK
  }

  public formGroupEmitter(event: { query: any; item: any; index: number }) {
    const value = Object.values(event.query).toString();
    const keys = Object.keys(event.query).toString();

    // if (event.index !== -1) this.items[event.index] = event.item;
    // this.checkedInput[keys] = value;

    this.queries[keys] = value;

    this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
  }

  public minimizeEmitter(item: any): void {
    const index = this.items.indexOf(item);

    if (index !== -1) {
      this.items[index] = {
        ...this.items[index],
        isMinimize: !this.items[index]['isMinimize'],
      };
    }

    this.items = this.items;

    this.savePermalink(); // SAVE PERMALINK
  }

  public removeFromItemEmitter(item: any, removeName?: string): void {
    if (this.items.indexOf(item) !== -1) {
      this.items.splice(this.items.indexOf(item), 1);
    }

    this.items = this.items;

    if (removeName !== undefined) {
      if (removeName === 'input') {
        const newObject = Object.keys(this.queries).reduce(
          (accumulator, key) => {
            if (key !== item['head']) accumulator[key] = this.queries[key];
            return accumulator;
          },
          {}
        );
        this.queries = newObject;

        this.inputFilterFonciont(); // CALL SEARCH INPUT FILTER
      } else if (removeName === 'number') {
        this.numericQeury = [];
        this.dataSources = this.dataViews.filter((value, index) => {
          return this.filtersData(index);
        });

        this.lpviLped.dataSources$.next(this.dataSources);
      } else if (removeName === 'search') {
        this.searchQueries = [];
        this.dataSources = this.dataViews.filter((value, index) => {
          return this.filtersData(index);
        });

        this.lpviLped.dataSources$.next(this.dataSources);
      }
    }
    this.savePermalink(); // SAVE PERMALINK

    this.lpviLped.permaLink = {
      input: [],
      numeric: [],
      search: [],
      items: [],
      name: [],
      queries: {},
      queriesNumerisFilters: {},
    };
  }

  public itemsEmitter(event?: any) {
    if (event !== undefined) this.items = event;

    let search: boolean;

    this.dataSources = this.dataViews.filter((value, index) => {
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

      return this.filtersData(index);
    });

    this.lpviLped.dataSources$.next(this.dataSources);

    this.savePermalink(); // SAVE PERMALINK
  }

  /* VERIFY ALL QUERY FILTERS */
  private chechQueryFilter(index: number, queries: boolean[]): boolean {
    if (queries.length !== 0) return queries[index];
    return true;
  }

  private filtersData(index: number): boolean {
    const q1 = this.chechQueryFilter(index, this.numericQeury);
    const q2 = this.chechQueryFilter(index, this.searchQueries);
    const q3 = this.chechQueryFilter(index, this.inputQueries);

    return q1 && q2 && q3;
  }

  private inputFilterFonciont() {
    let qqq = '',
      i1 = 0;

    this.dataSources = this.dataViews.filter((value, index) => {
      if (Object.values(this.queries).every((x) => x === null || x === '')) {
        this.inputQueries[index] = true;

        return this.filtersData(index);
      } else {
        let s = '',
          i2 = 0;
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
        this.inputQueries[index] = eval(qqq) !== undefined ? eval(qqq) : true;

        return this.filtersData(index);
      }
    });
    this.lpviLped.dataSources$.next(this.dataSources);

    this.savePermalink(); // SAVE PERMALINK
  }

  private savePermalink(): void {
    const permalink = {
      idProject: this.idProject,
      value: JSON.stringify({
        input: this.inputQueries,
        search: this.searchQueries,
        numeric: this.numericQeury,
        items: this.items,
        queries: this.queries,
        queriesNumerisFilters: this.queriesNumerisFilters,
      }),
    };

    this.lpEditor.addFilter(permalink).subscribe();
  }
}
