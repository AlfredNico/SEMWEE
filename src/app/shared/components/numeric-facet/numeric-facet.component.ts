import { Options } from '@angular-slider/ngx-slider';
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';

@Component({
  selector: 'app-numeric-facet',
  template: `
        <div class="mx-1 pb-2">
          <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
            <div class="py-2 px-2 rounded-top" style="background: #bbccff;" fxLayout="row">
              <mat-icon aria-label="close icon">
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
              <div class="pointer px-1">change</div>
              <div class="pointer px-1">reset</div>
            </div>
            <!-- <div class="custom-slider">
              <ngx-slider
                [(value)]="minValue"
                [(highValue)]="maxValue"
                [options]="options"
                (userChangeEnd)="userChangeEnd($event)"
              ></ngx-slider>
            </div> -->
            <div fxLayout="row" fxLayoutAlign="center center" class="py-1"
            style="background: #e3e9ff;" *ngIf="item['isMinimize'] === false">
              <p class="m-0"> {{ minValue }} </p>
              <p class="mx-2 my-0">-</p>
              <p class="m-0"> {{ maxValue }}</p>
            </div>
          </div>
        </div>
  `,
  styleUrls: ['./numeric-facet.component.scss']
})
export class NumericFacetComponent {

  @Input('items') items: any[] = [];
  @Input('items') item: any = undefined;

  // minValue: number = 20;
  // maxValue: number = 80;
  // options: Options = {
  //   floor: 0,
  //   ceil: 100,
  //   // minRange: this.maxValue,
  //   // maxRange: this.minValue,
  //   // minLimit: this.minValue,
  //   // maxLimit: this.maxValue,
  //   draggableRange: true,
  //   showSelectionBar: true,
  // };

  constructor() { }

  ngOnInit(): void {
  }

  // userChangeEnd(event) {
  //   console.log('va=', event);
  // }

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
