import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-filter',
  template: `
      <div class="mx-1 pb-2">
        <div class="p-0 w-100 rounded style-border">
          <div class="py-2 px-2 rounded-top level1" fxLayout="row">
            <mat-icon aria-label="close icon"
            (click)="removeFromItem.emit(item)">
              highlight_off
            </mat-icon>
            <mat-icon *ngIf="item['isMinimize'] === false" aria-label="close icon"
            (click)="minimize.emit(item)">
              remove_circle_outline
            </mat-icon>
            <mat-icon *ngIf="item['isMinimize'] === true" aria-label="close icon"
            (click)="minimize.emit(item)">
              add_circle_outline
            </mat-icon>
            <span class="fw-600">{{ item['head'] }}</span>
            <span fxFlex></span>
            <div class="pointer px-1 black-color fw-600">invert</div>
            <div class="pointer px-1 black-color fw-600">reset</div>
          </div>
          <div class="py-0" *ngIf="item['isMinimize'] === false" [formGroup]="form">
              <mat-form-field appearance="fill">
                    <mat-label>Enter a date range</mat-label>
                    <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
                      <input matStartDate formControlName="start" placeholder="Start date">
                      <input matEndDate formControlName="end" placeholder="End date">
                    </mat-date-range-input>
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-date-range-picker #picker></mat-date-range-picker>

                    <mat-error *ngIf="range.controls.start.hasError('matStartDateInvalid')">Invalid start date</ mat-error>

                    <mat-error *ngIf="range.controls.end.hasError('matEndDateInvalid')">Invalid end date</mat-error>
              </mat-form-field>
          <div fxLayout="row" fxLayoutAlign="space-around center" class="py-3 level2" *ngIf="item['isMinimize'] === false">
          </div>
        </div>
      </div>
  `,
  styles: [
    `mat-form-field {
      margin-top: 2px;
}`
  ]
})
export class DateFilterComponent implements AfterViewInit, OnInit {

  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('dataViews') dataViews: any[] = [];
  @Input('item') item: any = undefined;
  @Input('index') index: any = undefined;

  /* OUTPUT */
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();
  @Output('formGroup') formGroup: any = new EventEmitter();

  public form = this.fb.group({});

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.addControl(this.item['head'], new FormControl(this.item['value']));
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(query => {
      this.item = {
        ...this.item,
        value: query[`${this.item['head']}`]
      };

      this.formGroup.emit({
        query: query,
        item: this.item,
        index: this.index
      });
    });
  }

}