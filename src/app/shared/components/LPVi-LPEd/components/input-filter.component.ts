import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LpEditorService } from '@app/user-spaces/dashbord/services/lp-editor.service';
import { LpdLpdService } from '../services/lpd-lpd.service';

@Component({
  selector: 'app-input-filter',
  template: `
    <div class="mx-1 pb-2">
      <div class="p-0 w-100 rounded style-border">
        <div class="py-2 px-2 rounded-top level1" fxLayout="row">
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
          <div class="pointer px-1 black-color fw-600">invert</div>
          <div class="pointer px-1 black-color fw-600">reset</div>
        </div>
        <div
          class="py-0"
          *ngIf="item['isMinimize'] === false"
          [formGroup]="form"
        >
          <input
            autocomplete="off"
            type="search"
            class="w-100"
            placeholder="Filter ..."
            [formControlName]="item['head']"
            appearance="outline"
            class="form-control"
          />
        </div>
        <div
          fxLayout="row"
          fxLayoutAlign="space-around center"
          class="py-3 level2"
          *ngIf="item['isMinimize'] === false"
        >
          <mat-checkbox>case sensitive</mat-checkbox>
          <mat-checkbox>regular expression</mat-checkbox>
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
      this.inputValue = this.lpVilpEd.permaLink.queries[`${this.item['head']}`];
    else this.inputValue = this.item['value'];

    this.form.addControl(this.item['head'], new FormControl(this.inputValue));
  
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe((query) => {
      this.formGroup.emit({
        query: query,
        item: this.item,
        index: this.index,
      });
    });

    this.lpVilpEd.inputSubject.subscribe((_) => {
      this.form.reset();
    });
  }

}
