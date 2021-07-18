import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LpdLpdService } from '../services/lpd-lpd.service';

@Component({
  selector: 'app-input-filter',
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
          <div
            class="pointer px-1 white-color fw-600"
            (click)="invert()"
            [ngStyle]="{ color: !item['invert'] ? '#74788D' : null }"
          >
            invert
          </div>
          <div class="pointer px-1 white-color fw-600" (click)="reset()">
            reset
          </div>
        </div>
        <div
          class="py-0"
          *ngIf="item['isMinimize'] === false"
          [formGroup]="form"
          fxLayout="row"
          fxLayoutAlign="space-around center"
          style="background: #74788D"
        >
          <input
            autocomplete="off"
            type="search"
            placeholder="Filter ..."
            [formControlName]="item['head']"
            appearance="outline"
            class="form-control w-100 form-custom"
          />
          <button mat-icon-button (click)="search()">
            <mat-icon>search</mat-icon>
          </button>
        </div>
        <div
          fxLayout="row"
          class="py-3 px-3 level2 rounded-bottom"
          *ngIf="item['isMinimize'] === false"
        >
          <mat-checkbox
            class="mr-1"
            [checked]="item['complete_string']"
            (change)="changeStatus($event, 'complete_string')"
            style="font-family: Poppins!important; display: flex; justify-content: center; align-items: center;"
            >Complete string</mat-checkbox
          >
          <mat-checkbox
            class="ml-2"
            [checked]="item['sensitive']"
            (change)="changeStatus($event, 'sensitive')"
            style="font-family: Poppins!important; display: flex; justify-content: center; align-items: center;"
            >Case sensitive</mat-checkbox
          >
        </div>
      </div>
    </div>
  `,
})
export class InputFilterComponent implements AfterViewInit, OnInit {
  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('dataViews') dataViews: any[] = [];
  @Input('item') item: any = undefined;
  @Input('index') index: any = undefined;

  /* OUTPUT */
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();
  @Output('formGroup') formGroup: any = new EventEmitter();

  /* VARIABLES */
  public form = this.fb.group({});
  private inputValue = '';

  constructor(
    private fb: FormBuilder,
    private readonly lpVilpEd: LpdLpdService
  ) {}

  ngOnInit(): void {
    if (this.lpVilpEd.permaLink.queries.hasOwnProperty(`${this.item['head']}`))
      this.inputValue =
        this.lpVilpEd.permaLink.queries[`${this.item['head']}`]?.value;
    else this.inputValue = this.item['value'];

    this.form.addControl(this.item['head'], new FormControl(this.inputValue));
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe((query) => {
      if (query[`${this.item['head']}`] == '')
        this.formGroup.emit({
          query: query,
          item: this.item,
          index: this.index,
        });
    });
  }

  public search(): void {
    if (this.form.value != '')
      this.formGroup.emit({
        query: {
          value: this.form.value[this.item['head']],
          invert: this.item['invert'],
          sensitive: this.item['sensitive'],
          complete_string: this.item['complete_string'],
        },
        item: this.item,
        index: this.index,
      });
  }

  public invert() {
    this.item = {
      ...this.item,
      invert: !this.item['invert'],
    };

    this.filter();
  }

  public changeStatus(e: any, nameStatus: string) {
    if (nameStatus == 'sensitive')
      this.item = {
        ...this.item,
        sensitive: e['checked'],
      };
    else
      this.item = {
        ...this.item,
        complete_string: e['checked'],
      };

    this.filter();
  }

  public reset(): void {
    this.form.reset();
    this.item = {
      ...this.item,
      invert: true,
      sensitive: false,
      complete_string: false,
    };

    this.filter();
  }

  private filter(): void {
    this.formGroup.emit({
      query: {
        value: this.form.value[this.item['head']]
          ? this.form.value[this.item['head']]
          : '',
        invert: this.item['invert'],
        sensitive: this.item['sensitive'],
        complete_string: this.item['complete_string'],
      },
      item: this.item,
      index: this.index,
    });
  }
}
