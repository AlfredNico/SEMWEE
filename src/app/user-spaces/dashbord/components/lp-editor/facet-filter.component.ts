import { LpViwersService } from './../../services/lp-viwers.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Component, HostListener, Input, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-facet-filter',
  template: `
  <div *ngIf="items.length > 0">
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
                <p class="font-weight-bold m-0 pr-2 pointer" style="color: #3d5be2">{{ content[0] }}</p>
                <span style="color: #a89ca2"> {{ content[1] }} </span>
              </div>
              <span class="only-show-on-hover pointer">include</span>
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
            <mat-form-field appearance="fill" class="w-100">
              <input matInput placeholder="filter ..." [formControlName]="item['head']" appearance="outline">
            </mat-form-field>
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
export class FacetFilterComponent implements OnInit, AfterViewInit {
  @Input() public items: any[];
  changeText: boolean;

  public filters = this.fb.group([]);

  constructor(private fb: FormBuilder, private lpViewer: LpViwersService) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.lpViewer.itemsSubject$.subscribe(() => {
      this.items.map((value: any) => {
        if (value['type'] === 'filter') {
          this.filters.addControl(value['head'], new FormControl(''));
        }
      })
    });

    this.filters.valueChanges
      .pipe(
        map((query) => {
          console.log('filter', query);
        })
      )
      .subscribe();
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
