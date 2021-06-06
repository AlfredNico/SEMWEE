import { LabelType, Options } from '@angular-slider/ngx-slider';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-time-line',
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
            <!-- ; else noNumber" class="custom-slider" -->
            <div *ngIf="isValidNumber() && item?.maxValue !== 0">
              <ngx-slider
              [(value)]="value"
              [options]="options"
              (userChangeEnd)="userChangeEnd($event)"
            ></ngx-slider>
            </div>
            <!-- <ng-template noNumber>
              <div class="text-center" [style.color]="'#ff6a00'" [style.height.px]="50">
                No date
              </div>
            </ng-template>  -->
            <div [style.height.px]="70" style="background: #e3e9ff;">
              <div fxLayout="row" fxLayoutAlign="center center" class="py-1">
                <p class="m-0"> {{ item?.minValue }} </p>
                <p class="mx-1 my-0">-</p>
                <p class="m-0"> {{ item?.maxValue }}</p>
              </div>
              <div fxLayout="row" fxLayoutAlign="center center" class="py-1">
                  <mat-checkbox class="mx-1">Time</mat-checkbox>
                  <mat-checkbox class="mx-1">Non-Time</mat-checkbox>
                  <mat-checkbox class="mx-1">Blank</mat-checkbox>
                  <mat-checkbox class="mx-1">Error</mat-checkbox>
              </div>
            </div>
          </div>
        </div>
  `,
  styles: [
  ]
})
export class TimeLineComponent implements AfterViewInit {

  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('item') item: any = undefined;
  @Input('dataViews') public dataViews: any[] = [];

  /* OUTPUT */
  @Output('numericQueriesEmitter') numericQueriesEmitter = new EventEmitter<any>(undefined);
  @Output('itemsEmitter') itemsEmitter: any = new EventEmitter();
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();

  /* VARIALBES */
  dateRange: Date[] = this.customDateRange();
  value: number = this.dateRange[0].getTime();


   options: Options = {
    stepsArray: this.dateRange.map((date: Date) => {
      return { value: date.getTime() };
    }),
    translate: (value: number, label: LabelType): string => {
      return new Date(value).toDateString();
    }
  };


  constructor(private readonly lpViewer: LpViwersService) { }

  ngAfterViewInit(): void { }

  userChangeEnd(event: any) {
    console.log('date=', event);
  }

  public isValidNumber(): boolean {
    return Number.isFinite(this.item['minValue']) && Number.isFinite(this.item['maxValue']);
  }

  customDateRange(): Date[] {
    const dates: Date[] = [];
    for (let i: number = 1; i <= 31; i++) {
      dates.push(new Date(2021, 6, i));
    }
    return dates;
  }

  private createTimeRange(){
    return [];
  }


}


// minValue: number = 200;
  // maxValue: number = 300;
  // options: Options = {
  //     floor: 0,
  //     ceil: 500,
  //     translate: (value: number, label: LabelType): string => {
  //         switch (label) {
  //             case LabelType.Low:
  //                 return "<b>Min price:</b> $" + value;
  //             case LabelType.High:
  //                 return "<b>Max price:</b> $" + value;
  //             default:
  //                 return "$" + value;
  //         }
  //     }
  // };

