import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-time-line',
  template: `
    <div class="mx-1 pb-2">
      <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
        <div
          class="py-2 px-2 rounded-top"
          style="background: #bbccff;"
          fxLayout="row"
        >
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
          <span style="font-weight: 600;">{{ item['head'] }}</span>
          <span fxFlex></span>
          <div class="pointer px-1">change</div>
          <div class="pointer px-1">reset</div>
        </div>
        <div
          class="custom-slider w-100"
          style.height.px="50"
          *ngIf="
            (item?.endDate !== undefined || item?.startDate !== undefined) &&
              item['isMinimize'] === false;
            else noDate
          "
          fxLayout="row"
          fxLayoutAlign="space-between center"
          [formGroup]="FormRange"
          style="background: rgb(227, 233, 255);"
        >
          <mat-form-field
            appearance="fill"
            class="w-50"
            style="background: rgb(227, 233, 255);"
          >
            <mat-label>start date</mat-label>
            <input
              matInput
              [matDatepicker]="startPicker"
              formControlName="start"
              [max]="end"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="startPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-50">
            <mat-label>end date</mat-label>
            <input
              matInput
              [matDatepicker]="endPicker"
              formControlName="end"
              [min]="start"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="endPicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
          <!-- </div> -->
        </div>
        <ng-template #noDate>
          <div
            class="text-center"
            [style.color]="'#F64E60'"
            [style.height.px]="50"
            *ngIf="item['isMinimize'] === false"
          >
            No Date
          </div>
        </ng-template>
        <div
          [style.height.px]="50"
          style="background: #e3e9ff;"
          *ngIf="item['isMinimize'] === false"
        >
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
    `
      div.mat-form-field-flex {
        background: whitesmoke !important;
      }
    `,
  ],
  providers: [DatePipe],
})
export class TimeLineComponent implements AfterViewInit, OnInit {
  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('item') item: any = undefined;

  /* OUTPUT */
  @Output('timeLineQueriesEmitter') timeLineQueriesEmitter =
    new EventEmitter<any>(undefined);
  @Output('itemsEmitter') itemsEmitter: any = new EventEmitter();
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();

  /* VARIALBES */
  // public form = this.fb.group({});

  FormRange = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl([Validators.required]),
  });

  constructor(
    private readonly lpViewer: LpViwersService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-US');
  }

  ngOnInit(): void {
    this.FormRange.patchValue({
      start: this.item['startDate'],
      end: this.item['endDate'],
    });
  }

  get end() {
    return this.FormRange.get('end').value;
  }

  get start() {
    return this.FormRange.get('start').value;
  }

  ngAfterViewInit(): void {
    this.FormRange.valueChanges.subscribe((query) => {
      this.timeLineQueriesEmitter.emit({
        head: this.item['head'],
        start: Date.parse(query['start']),
        end: Date.parse(query['end']),
      });
    });
  }
}
