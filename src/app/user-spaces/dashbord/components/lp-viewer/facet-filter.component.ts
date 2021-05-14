import { CommonService } from './../../../../shared/services/common.service';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { LpViwersService } from '../../services/lp-viwers.service';

@Component({
  selector: 'app-facet-filter',
  template: `
 <div *ngIf="items.length > 0; else noItems">
    <div class="w-100 px-2 pb-3">
      <button class="rounded">Refresh</button>
      <span fxFlex></span>
      <button class="rounded">Reset All</button>
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
            <div class="py-0" *ngIf="item['isMinimize'] === false" [formGroup]="filters">
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
      <p class="m-0">Not sure how to get started?<br>
      <a href="https://github.com/OpenRefine/OpenRefine/wiki/Screencasts" target="_blank">
        <b>Watch these screencasts</b>
      </a>
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
export class FacetFilterComponent implements OnInit {

  @Input() public items: any[] = [];
  @Input() public dataViews: any[] = [];
  @Input() public dataSources: any[] = [];
  private facetFilter: any[] = [];

  changeText: boolean;

  public filters = this.fb.group([]);
  private indexes = 0;
  private states = '';

  constructor(private fb: FormBuilder, private lpViewer: LpViwersService, private readonly common: CommonService) { }

  ngOnInit(): void { }

  private removeQuery(query: string): string {
    const unique = [...new Set(this.states.split('||'))];
    if (unique.indexOf(query) !== -1) {
      unique.splice(unique.indexOf(query), 1);
    }
    this.states = unique.join("||");
    return unique.join("||");
  }

  ngAfterViewInit() {
    // this.lpViewer.checkInfoSubject$.subscribe(res =>{
    //   console.log('e', res);
    // })
    this.lpViewer.itemsObservables$.subscribe((res: any) => {
      if (res !== undefined) {
        this.items.push(res);
        this.items.map((value: any) => {
          if (value['type'] === 'filter') {
            this.filters.addControl(value['head'], new FormControl(''));
          }
        })
      }
    });

    this.filters.valueChanges
      .pipe(
        map((query) => {

          this.dataSources = this.dataViews.filter((item: any) => {
            if (Object.values(query).every((x) => x === null || x === '')) {
              return this.dataViews;
            } else {
              return Object.keys(item).some((property) => {
                if (
                  query[property] != '' &&
                  typeof item[property] === 'string' &&
                  query[property] !== undefined &&
                  item[property] !== undefined
                ) {
                  let i = 0,
                    s = '';
                  Object.entries(query).map((val) => {
                    if (val[1]) {
                      i++;
                      const lower = (val[1] as any).toLowerCase();
                      if (i == 1) {
                        s =
                          s +
                          `item["${val[0]}"].toString().toLowerCase().includes("${lower}")`;
                      } else {
                        s =
                          s +
                          `&& item["${val[0]}"].toString().toLowerCase().includes("${lower}")`;
                      }
                    }
                  });
                  return eval(s);
                }
              });
            }
          });
          this.lpViewer.dataSources$.next(this.dataSources);
        })
      )
      .subscribe();
  }

  public include(headName: any, contentName: string) {
    const index = this.items.indexOf(headName);
    if (index !== -1) {
      const obj = {};

      this.items[index].content.map((val: any, i: number) => {
        if (val[0] === contentName) {
          this.items[index].content[i] = {
            ...this.items[index].content[i],
            include: !this.items[index].content[i]['include']
          }
          obj[this.items[index].content[i][0]] = headName['head'];
          this.facetFilter.push(obj);
        }
      });
    }

    this.items = this.items;

    let s = '';
    this.dataSources = this.dataViews.filter((item: any) => {
      return Object.keys(item).some((property) => {
        let x = this.facetFilter.map(res => {
          if (item[property] !== undefined || item[property] !== '') {
            Object.entries(res).forEach((val) => {

              if (val[0] && val[1] && s !== val[0]) {
                this.indexes++;
                if (this.indexes == 1) {
                  this.states = `item["${val[1]}"].toString().includes("${val[0]}")`;
                } else {
                  this.states =
                    this.states +
                    `||item["${val[1]}"].toString().includes("${val[0]}")`;
                }
              }
              s = val[0];
            });
            return eval(this.states);
          }
        })
        return x[x.length - 1];
      });
    });
    this.lpViewer.dataSources$.next(this.dataSources);

  }

  public exclude(headName: any, contentName: string) {
    let v = '';

    const index = this.items.indexOf(headName);
    if (index !== -1) {
      this.items[index].content.map((val: any, i: number) => {
        if (val[0] === contentName) {
          this.items[index].content[i] = {
            ...this.items[index].content[i],
            include: !this.items[index].content[i]['include']
          }
        }
      });
    }
    this.items = this.items;

    let s = '';
    this.dataSources = this.dataViews.filter((item: any) => {
      return Object.keys(item).some((property) => {
        let x = this.facetFilter.map(res => {
          if (item[property] !== undefined || item[property] !== '') {
            const x = `item["${headName['head']}"].toString().includes("${contentName}")`;
            return eval(this.removeQuery(x));
          }
        })
        return x[x.length - 1];
      });
    });
    this.lpViewer.dataSources$.next(this.dataSources);
  }

  public removeFromItem(item: any) {
    if (this.items.indexOf(item) !== -1) {
      this.items.splice(this.items.indexOf(item), 1);
    }
  }

  public removeAll() {
    this.items = [];
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

}
