import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-input-filter',
  template: `
      <div class="mx-1 pb-2">
        <div class="p-0 w-100 rounded" style="border: 1px solid #bbccff;">
          <div class="py-2 px-2 rounded-top" style="background: #bbccff;" fxLayout="row">
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
            <span style="font-weight: 600;">{{ item['head'] }}</span>
            <span fxFlex></span>
            <div class="pointer px-1">invert</div>
            <div class="pointer px-1">reset</div>
          </div>
          <div class="py-0" *ngIf="item['isMinimize'] === false" [formGroup]="formGroup">
            <input autocomplete="off" type="search" class="w-100" placeholder="filter ..." [formControlName]="item['head']" appearance="outline">
          </div>
          <div fxLayout="row" fxLayoutAlign="space-around center" class="py-3"
          style="background: #e3e9ff;" *ngIf="item['isMinimize'] === false">
            <mat-checkbox>case sensitive</mat-checkbox>
            <mat-checkbox>regular expression</mat-checkbox>
          </div>
        </div>
      </div>
  `,
  styles: [
  ]
})
export class InputFilterComponent implements AfterViewInit {

  /* INPUT */
  @Input('items') items: any[] = [];
  @Input('item') item: any = undefined;

  /* OUTPUT */
  @Output('minimize') minimize: any = new EventEmitter();
  @Output('removeFromItem') removeFromItem: any = new EventEmitter();

  public formGroup = this.fb.group({});

  constructor(private fb: FormBuilder) { }

  ngAfterViewInit(): void {
    this.formGroup.valueChanges.subscribe(query => {
      console.log('query=', query);
    })
  }

}
