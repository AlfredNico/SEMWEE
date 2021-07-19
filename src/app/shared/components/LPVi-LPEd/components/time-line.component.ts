import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-time-line',
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
          class="custom-slider w-100 level2"
          style.height.px="50"
          *ngIf="
            (item?.endDate !== undefined || item?.startDate !== undefined) &&
            item['isMinimize'] === false
          "
          fxLayout="row"
          fxLayoutAlign="space-between center"
          [formGroup]="FormRange"
        >
          <mat-form-field
            appearance="fill"
            class="w-50"
            style="background: #F3F6F9;"
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
        </div>
        <div
          [style.height.px]="10"
          style="background: white"
          *ngIf="item['isMinimize'] === false"
          class="rounded-bottom"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-form-field-wrapper {
        background: white !important;
      }

      ::ng-deep .mat-label,
      .mat-datepicker-input {
        font-family: Poppins !important;
        font-weight: 600;
      }

      ::ng-deep .mat-form-field-appearance-fill .mat-form-field-flex {
        background-color: #f3f6f9;
        border-radius: 0 !important;
      }

      ::ng-deep .mat-form-field-appearance-fill {
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

  constructor(private dateAdapter: DateAdapter<Date>) {
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

  public isValidDate() {
    return !(
      this.item['startDate'].length == 25 && this.item['endDate'].length == 25
    );
  }
}
