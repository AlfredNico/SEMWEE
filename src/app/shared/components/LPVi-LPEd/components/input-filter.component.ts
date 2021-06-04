import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-filter',
  template: `
      <div class="mx-1 pb-2">
        <div class="p-0 w-100 rounded" style="border: 1px solid #F2F3F7; color: #A7ABC3 !important; font-weight: 600;">
          <div class="py-2 px-2 rounded-top" style="background: #F2F3F7; color: #A7ABC3 !important;" fxLayout="row">
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
            <div class="pointer px-1" style="color: #3F4254;">invert</div>
            <div class="pointer px-1" style="color: #3F4254;">reset</div>
          </div>
          <div class="py-0" *ngIf="item['isMinimize'] === false" [formGroup]="form">
            <input autocomplete="off" type="search" class="w-100" placeholder="Filter ..." [formControlName]="item['head']" appearance="outline" class="form-control">
          </div>
          <div fxLayout="row" fxLayoutAlign="space-around center" class="py-3"
          style="background: #F3F6F9; color: #A7ABC3 !important;" *ngIf="item['isMinimize'] === false">
            <mat-checkbox>case sensitive</mat-checkbox>
            <mat-checkbox>regular expression</mat-checkbox>
          </div>
        </div>
      </div>
  `,
  styles: [`
        ::ng-deep .mat-checkbox .mat-checkbox-frame {
            border: none;
            background-color: #D4D6E0;
        }

        ::ng-deep .mat-checkbox-indeterminate.mat-accent .mat-checkbox-background, .mat-checkbox-checked.mat-accent .mat-checkbox-background {
            margin-top: 1px;
            margin-left: 1px;
            width: 18px;
            height: 18px;
            border-radius: 8px;
        }
  `
  ]
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

  public form = this.fb.group({});

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
