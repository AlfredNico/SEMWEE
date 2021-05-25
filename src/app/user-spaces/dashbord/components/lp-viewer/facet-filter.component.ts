import { CommonService } from './../../../../shared/services/common.service';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { LpViwersService } from '../../services/lp-viwers.service';
import { FacetFilter } from '../../interfaces/facet-filter';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-facet-filter',
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
        *ngTemplateOutlet="item.type === 'facet' ? facetTemplate : filterTemplate; context:{value: item}">
      </ng-container>

      <ng-template #facetTemplate let-currentValue="value">
         <div class="mx-1 pb-2" appFluidHeight>
        <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
          <div class="py-2 px-2 rounded-top" style="background: #bbccff;" fxLayout="row" >
            <mat-icon aria-label="close icon" (click)="removeFromItem(item)">
              highlight_off
            </mat-icon>
            <mat-icon *ngIf="item['isMinimize'] === false" aria-label="close icon" (click)="minimize(item)">
              remove_circle_outline
            </mat-icon>
            <mat-icon *ngIf="item['isMinimize'] === true" aria-label="close icon" (click)="minimize(item)">
              add_circle_outline
            </mat-icon>
            <span style="font-weight: 600;">{{ item['head'] }}</span>
            <span fxFlex></span>
            <div class="pointer">change</div>
          </div>
           <div fxLayout="row" class="py-2 px-2" style="background: #e3e9ff;"
           *ngIf="item['isMinimize'] === false">
            <div class="pr-3 pointer"> 1 choices</div>
            <div> Sort by : <span class="px-1 pointer">name</span><span class="px-1 pointer">count</span> </div>
          </div>
          <div class="py-2" style="height: 150px; overflow: auto"
          *ngIf="item['isMinimize'] === false">
            <div fxLayout="row" class="py-0 px-2 list-content" fxLayoutAlign="space-between center"
            *ngFor="let content of item?.content">
              <div fxLayout="row">
                <p class="font-weight-bold m-0 pr-2 pointer" [ngStyle]="{'color':content['include'] === false ? '#3d5be2' : '#ff6a00' }">{{ content[0] }}</p>
                <span style="color: #a89ca2"> {{ content[1] }} </span>
              </div>
              <span class="only-show-on-hover pointer" *ngIf="content['include'] === false" (click)="include(item, content[0])">include</span>
              <span class="pointer" *ngIf="content['include'] === true" (click)="exclude(item, content[0])">exclude</span>
            </div>
          </div>
        </div>
        <div class="w-100 resizable"></div>
      </div>
      </ng-template>

      <ng-template #filterTemplate let-currentValue="value">
        <div class="mx-1 pb-2">
          <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
            <div class="py-2 px-2 rounded-top" style="background: #bbccff;" fxLayout="row">
              <mat-icon aria-label="close icon" (click)="removeFromItem(item)">
                highlight_off
              </mat-icon>
              <mat-icon *ngIf="item['isMinimize'] === false" aria-label="close icon" (click)="minimize(item)">
                remove_circle_outline
              </mat-icon>
              <mat-icon *ngIf="item['isMinimize'] === true" aria-label="close icon" (click)="minimize(item)">
                add_circle_outline
              </mat-icon>
              <span style="font-weight: 600;">{{ item['head'] }}</span>
              <span fxFlex></span>
              <div class="pointer px-1">invert</div>
              <div class="pointer px-1">reset</div>
            </div>
            <div class="py-0" *ngIf="item['isMinimize'] === false" [formGroup]="formGroup">
              <input autocomplete="off" type="search" class="w-100" placeholder="filter ..." [formControlName]="item['head']" appearance="outline">
            </div>
            <div fxLayout="row" fxLayoutAlign="space-around center" class="py-3"
            style="background: #e3e9ff;" *ngIf="item['isMinimize'] === false">
              <mat-checkbox>case sensitive</mat-checkbox>
              <mat-checkbox>regular expression</mat-checkbox>
            </div>
          </div>
        </div>
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
export class FacetFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() items: any[] = [];
  @Input() public inputFilters: any = undefined;
  @Input() public dataViews: any[] = [];
  @Input() public dataSources: any[] = [];
  @Input() public idProject: any = undefined;
  @Input() public filtersData: FacetFilter = undefined;
  // @Input() public formGroup = new FormGroup({});
  @Input() public formGroup = this.fb.group({});
  @Output() public filtersDataEmited = new EventEmitter<FacetFilter>();

  changeText: boolean;
  public facetFilter$ = new BehaviorSubject<boolean>(false);


  // public filters = this.fb.group([]);
  // public filters = this.fb.group([]);

  private facetQueries: boolean[] = [];
  private searchQueries: boolean[] = [];

  constructor(private fb: FormBuilder, private lpViewer: LpViwersService, private readonly common: CommonService) { }

  ngOnInit(): void { }

  ngOnChanges() {
    if (this.filtersData !== undefined) {
      // this.items = this.filtersData['items'];
      this.facetQueries = this.filtersData['facetQueries'];
      this.searchQueries = this.filtersData['searchQueries'];
      // this.dataViews = this.dataViews;
    }

    if (this.dataViews.length > 0) {
      this.formGroup.valueChanges
        .pipe(
          map((query) => {
            // let qqq = '', i1 = 0;
            // let lastquery: boolean;
            // this.lpViewer.addFacetFilter({
            //   idProject: this.idProject,
            //   value: JSON.stringify(query)
            // }).subscribe();
            this.saveQuery(query);

            this.dataSources = this.filterQueries(query);

            this.lpViewer.dataSources$.next(this.dataSources);
          })
        )
        .subscribe();
    }
  }

  ngAfterViewInit() {

    this.facetFilter$.subscribe((res: boolean) => {
      if (res === true) {
        this.saveParams();
      }
    });

    this.lpViewer.itemsObservables$.subscribe((res: any) => {
      if (res !== undefined) {
        if (Array.isArray(res) === true) {
          this.items = res;
          this.items.map((value: any) => {
            if (value['type'] === 'filter') {
              this.formGroup.addControl(value['head'], new FormControl(''));
            }
          });
        } else {
          this.items.push(res);
          this.items.map((value: any) => {
            if (value['type'] === 'filter') {
              this.formGroup.addControl(value['head'], new FormControl(''));
            }
          });
          this.facetFilter$.next(true);
        }
      }
    });

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
    this.items = this.items;

    this.checkIncludesExcludes();
  }

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
    this.items = this.items;

    this.checkIncludesExcludes();
  }

  public removeFromItem(item: any) {
    if (this.items.indexOf(item) !== -1) {
      this.items.splice(this.items.indexOf(item), 1);
    }
    const query = {};

    this.items = this.items;
    this.items.map((value: any) => {
      if (value['type'] === 'filter') {
        query[value['head']] = this.formGroup.value[`${value['head']}`];
        this.formGroup.addControl(
          value['head'],
          new FormControl(this.formGroup.value[`${value['head']}`])
        );
      }
    });

    this.saveQuery(query);

    this.filterQueries(query);
    this.checkIncludesExcludes();
    // this.facetFilter$.next(true);
  }

  public removeAll() {
    this.lpViewer.dataSources$.next(this.dataViews);
    this.items = [];
    this.facetQueries = [];
    this.searchQueries = [];
    // this.itemsFilters.emit(this.items);

    this.saveQuery(this.formGroup.value);

    // this.saveParams();
    this.facetFilter$.next(true);
    if (this.formGroup.value) {
      this.lpViewer.addFacetFilter({
        idProject: this.idProject,
        value: JSON.stringify(this.formGroup.value)
      }).subscribe();
    }
  }

  public resetAll() {
    this.facetQueries = [];
    this.searchQueries = [];
    this.formGroup.reset();

    this.items.map((item: any) => {
      item['content']?.map((value: any, i: number) => {
        item['content'][i] = {
          ...item['content'][i],
          include: false
        }
      });
    });

    this.items = this.items;
    this.checkIncludesExcludes();

    this.saveQuery(this.formGroup.value);

    // this.saveParams();
    this.facetFilter$.next(true);
  }

  public minimize(item: any) {
    const index = this.items.indexOf(item);

    if (index !== -1) {
      this.items[index] = {
        ...this.items[index],
        isMinimize: !this.items[index]['isMinimize'],
      }
    }

    this.items = this.items;
  }

  private checkIncludesExcludes() {
    let search: boolean, last: boolean;

    this.dataSources = this.dataViews.filter((value: any, iii: number) => {
      return Object.keys(value).some((property) => {
        if (value[property] !== (undefined || null)) {
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
          last = this.searchQueries.length > 0 ? queries && this.searchQueries[iii] : queries;
          this.facetQueries[iii] = last;

          return last;
        }
      })
    });
    this.facetQueries = this.facetQueries;
    this.searchQueries = this.searchQueries;

    //save all parames into DB
    this.facetFilter$.next(true);
    this.lpViewer.dataSources$.next(this.dataSources);
  }

  private saveParams() {
    this.filtersData = {
      items: this.items,
      facetQueries: this.facetQueries,
      searchQueries: this.searchQueries
    };

    this.lpViewer.addFilter({
      idProject: this.idProject,
      value: JSON.stringify(this.filtersData)
    }).subscribe();
  }

  private saveQuery(query: any) {
    this.lpViewer.addFacetFilter({
      idProject: this.idProject,
      value: JSON.stringify(query)
    }).subscribe();
  }

  private filterQueries(query: any): any[] {
    let qqq = '', i1 = 0;
    let lastquery: boolean;

    const data = this.dataViews.filter((value: any, i: number) => {

      if (Object.values(query).every((x) => x === null || x === '')) {

        // return this.checkFilter(i, this.searchQueries, this.facetQueries);
        this.searchQueries[i] = true;
        return this.facetQueries.length > 0
          ? this.searchQueries[i] && this.facetQueries[i]
          : this.searchQueries[i];
      } else {
        let s = '', i2 = 0;
        Object.keys(value).some((property) => {
          if (
            query[property] != '' &&
            typeof value[property] === 'string' &&
            query[property] !== undefined &&
            value[property] !== undefined
          ) {
            const lower = (query[property] as any).toLowerCase();
            const ss = `value["${property}"].toString().toLowerCase().includes("${lower}")`;
            if (i2 === 0) s = ss;
            else s = s + '&&' + ss;
            i2++;
          }
        });
        if (i1 === 0) qqq = eval(s);
        else qqq = qqq + '&&' + eval(s);
        i2++;
        lastquery = this.facetQueries.length > 0 ? this.facetQueries[i] && eval(qqq) : eval(qqq);
        this.searchQueries[i] = eval(qqq);
        return lastquery;
        // return eval(qqq);
      }
    });
    this.facetQueries = this.facetQueries;
    this.searchQueries = this.searchQueries;
    this.facetFilter$.next(true);
    return data;
  }

}
