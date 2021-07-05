import { Options } from '@angular-slider/ngx-slider';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-numeric-facet',
  template: `
    <div class="ml-5 pb-2">
      <div class="p-0 w-100 rounded style-border">
        <div class="py-2 px-2 level1" fxLayout="row">
          <mat-icon aria-label="close icon" (click)="removeFromItem.emit(item)">
            highlight_off
          </mat-icon>
          <mat-icon
            *ngIf="item['isMinimize'] === false"
            aria-label="close icon"
            (click)="minimize.emit(item)"
          >
            remove_circle_outline
          </mat-icon>
          <mat-icon
            *ngIf="item['isMinimize'] === true"
            aria-label="close icon"
            (click)="minimize.emit(item)"
          >
            add_circle_outline
          </mat-icon>
          <span class="fw-600">{{ item['head'] }}</span>
          <span fxFlex></span>
          <div class="pointer px-1 white-color fw-600">change</div>
          <div class="pointer px-1 white-color fw-600">reset</div>
        </div>
        <div
          class="custom-slider"
          *ngIf="item?.maxValue !== 0 && item['isMinimize'] === false"
        >
          <ngx-slider
            [(value)]="item.minValue"
            [(highValue)]="item.maxValue"
            [options]="item.options"
            (userChangeEnd)="userChangeEnd($event)"
          ></ngx-slider>
        </div>
        <!-- <ng-template #noNumber>
          <div
            class="text-center"
            [style.height.px]="50"
            *ngIf="item['isMinimize'] === false"
          >
            <p [style.color]="'#F64E60'">No nunber</p>
          </div>
        </ng-template> -->
        <div
          fxLayout="row"
          fxLayoutAlign="center center"
          class="py-1 level2 rounded-bottom"
          *ngIf="item?.maxValue !== 0 && item['isMinimize'] === false"
        >
          <p class="m-0 ftp fw-600">{{ item?.minValue }}</p>
          <p class="mx-1 my-0 ftp fw-600">-</p>
          <p class="m-0 ftp fw-600">{{ item?.maxValue }}</p>
        </div>
      </div>
    </div>
  `,
  // styleUrls: ['./numeric-facet.component.scss']
})
export class NumericFacetComponent implements AfterViewInit {
  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('item') item: any = undefined;
  @Input('dataViews') public dataViews: any[] = [];
  // @Input('dataSources') public dataSources: any[] = [];
  // @Input('minValue') minValue: number = 0;
  // @Input('maxValue') maxValue: number = 2000;
  // @Input('options') options: Options = undefined;

  /* OUTPUT */
  @Output('numericQueriesEmitter') numericQueriesEmitter =
    new EventEmitter<any>(undefined);
  @Output('itemsEmitter') itemsEmitter: any = new EventEmitter();
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();

  /* VARIALBES */
  private numericQueries: boolean[] = [];

  constructor(private readonly lpViewer: LpViwersService) {}

  ngAfterViewInit(): void {}

  userChangeEnd(event: any) {
    const valueFiltered = {
      minValue: event['value'],
      maxValue: event['highValue'],
      head: this.item['head'],
    };

    this.numericQueriesEmitter.emit(valueFiltered);
  }

  // public isValidNumber(): boolean {
  //   return (
  //     Number.isFinite(this.item['minValue']) &&
  //     Number.isFinite(this.item['maxValue'])
  //   );
  // }
}
