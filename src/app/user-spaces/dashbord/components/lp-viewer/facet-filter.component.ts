import { CommonService } from './../../../../shared/services/common.service';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { LpViwersService } from '../../services/lp-viwers.service';
import { FacetFilter } from '../../interfaces/facet-filter';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-facet-filter',
  templateUrl: './facet-filter.component.html',
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
  private numericFilters: boolean[] = [];

  public inputFilterQuery: any = {};

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
            this.saveQuery(query);
            this.inputFilterQuery = query;

            this.filterQueries(query);
            // this.lpViewer.dataSources$.next(this.dataSources);
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
    this.inputFilterQuery = query;

    this.filterQueries(query);
    this.checkIncludesExcludes();
    // this.facetFilter$.next(true);
  }

  public removeAll() {
    this.lpViewer.dataSources$.next(this.dataViews);
    this.items = [];
    this.facetQueries = [];
    this.searchQueries = [];
    this.numericFilters = [];
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

  public checkNumericFacet(numericFilters: boolean[]) {
    this.numericFilters = numericFilters;

    this.dataSources = this.dataViews.filter((value: any, iii: number) => {
      const q1 = numericFilters[iii];
      const q2 = this.facetQueryFunction(iii);
      const q3 = this.searchQueriesFunction(iii);

      return q1 && q2 && q3;
    });

    //save all parames into DB
    // this.facetFilter$.next(true);
    this.lpViewer.dataSources$.next(this.dataSources);
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
          // last = this.searchQueries.length > 0 ? queries && this.searchQueries[iii] : queries;
          this.facetQueries[iii] = queries;

          const q1 = this.numericQueryFunction(iii);
          const q2 = this.facetQueryFunction(iii);
          const q3 = this.searchQueriesFunction(iii);

          return q1 && q2 && q3;
          // return last;
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

  public filterQueries(query: any): any[] {
    let qqq = '', i1 = 0;

    let lastquery: boolean;

    const data = this.dataViews.filter((value: any, i: number) => {

      if (typeof (query) === 'object' && Object.values(query).every((x) => x === null || x === '')) {
        // return this.checkFilter(i, this.searchQueries, this.facetQueries);
        this.searchQueries[i] = true;
        // return this.facetQueries.length > 0
        //   ? this.searchQueries[i] && this.facetQueries[i]
        //   : this.searchQueries[i];
        const q1 = this.numericQueryFunction(i);
        const q2 = this.facetQueryFunction(i);
        const q3 = this.searchQueriesFunction(i);

        return q1 && q2 && q3;
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
        this.searchQueries[i] = eval(qqq) !== undefined ? eval(qqq) : true;
        // lastquery = this.facetQueries.length > 0 ? this.facetQueries[i] && eval(qqq) : eval(qqq);
        const q1 = this.numericQueryFunction(i);
        const q2 = this.facetQueryFunction(i);
        const q3 = this.searchQueriesFunction(i);

        lastquery = q1 && q2 && q3;

        return q1 && q2 && q3;
        // return eval(qqq);
      }
    });
    this.facetQueries = this.facetQueries;
    this.searchQueries = this.searchQueries;
    this.facetFilter$.next(true);

    this.lpViewer.dataSources$.next(data);
    return data;
  }

  private numericQueryFunction(index: number): boolean {
    if (this.numericFilters?.length !== 0) return this.numericFilters[index];
    return true;
  }

  private facetQueryFunction(index: number): boolean {
    if (this.facetQueries?.length !== 0) return this.facetQueries[index];
    return true;
  }

  private searchQueriesFunction(index: number): boolean {
    if (this.searchQueries?.length !== 0) return this.searchQueries[index];
    return true;
  }

}
