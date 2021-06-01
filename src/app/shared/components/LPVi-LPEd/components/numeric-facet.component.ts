import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-numeric-facet',
  template: `
        <div class="mx-1 pb-2">
          <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
            <div class="py-2 px-2 rounded-top" style="background: #bbccff;" fxLayout="row">
              <mat-icon aria-label="close icon" (click)="removeFromItem.emit(item)">
                highlight_off
              </mat-icon>
              <mat-icon *ngIf="item['isMinimize'] === false" aria-label="close icon" (click)="minimize.emit(item)">
                remove_circle_outline
              </mat-icon>
              <mat-icon *ngIf="item['isMinimize'] === true" aria-label="close icon" (click)="minimize.emit(item)">
                add_circle_outline
              </mat-icon>
              <span style="font-weight: 600;">{{ item['head'] }}</span>
              <span fxFlex></span>
              <div class="pointer px-1">change</div>
              <div class="pointer px-1">reset</div>
            </div>
            <div class="custom-slider" *ngIf="isValidNumber() && maxValue !== 0; else noNumber">
              <ngx-slider
                [(value)]="minValue"
                [(highValue)]="maxValue"
                [options]="options"
                (userChangeEnd)="userChangeEnd($event)"
              ></ngx-slider>
            </div>
            <ng-template #noNumber>
              <div class="text-center" [style.color]="'#ff6a00'" [style.height.px]="50">
                No nunber
              </div>
            </ng-template>
            <div fxLayout="row" fxLayoutAlign="center center" class="py-1"
            style="background: #e3e9ff;" *ngIf="isValidNumber() && maxValue!==0">
              <p class="m-0"> {{ minValue }} </p>
              <p class="mx-1 my-0">-</p>
              <p class="m-0"> {{ maxValue }}</p>
            </div>
          </div>
        </div>
  `,
  styleUrls: ['./numeric-facet.component.scss']
})
export class NumericFacetComponent {

  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('item') item: any = undefined;
  @Input('dataViews') public dataViews: any[] = [];
  @Input('dataSources') public dataSources: any[] = [];
  @Input('minValue') minValue: number = 0;
  @Input('maxValue') maxValue: number = 2000;
  @Input('options') options: Options = undefined;

  private numericQueries: boolean[] = [];

  @Output('numericQueriesEmitter') numericQueriesEmitter = new EventEmitter<boolean[]>(undefined);
  @Output('itemsEmitter') itemsEmitter: any = new EventEmitter();
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();


  constructor(private readonly lpViewer: LpViwersService) { }

  ngOnInit(): void { }

  userChangeEnd(event: any) {
    this.dataViews.map((value, index) => {
      const v = value[`${this.item['head']}`];
      if (v >= event['value'] && v <= event['highValue'] && Number.isFinite(v) === true)
        this.numericQueries[index] = true;
      else this.numericQueries[index] = false;
    })
    this.numericQueriesEmitter.emit(this.numericQueries);
  }

  public isValidNumber(): boolean {
    return Number.isFinite(this.minValue) && Number.isFinite(this.maxValue);
  }

}
