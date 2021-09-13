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
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-input-filter',
  template: `
    <div class="ml-5 mgb-30 sub-panel">
      <div class="p-0 w-100">
        <div class="pd-8-18 level1 border-level1" fxLayout="row">
           <span class="ftp title-text">{{ item["head"] }}</span>
            <span fxFlex></span>
            <div
            class="pointer px-1 invert-text"
            (click)="invert()"
            [ngStyle]="{ color: !item['invert'] ? '#000000' : null }"
          >
            Invert
          </div>
            <div
                class="pointer px-1 reset-text"
                (click)="reset()"
            >
                Reset
            </div>
            <span class="svg-icon svg-icon-custom" style="margin-right: 18px;" *ngIf="item['isMinimize'] === false"
                aria-label="close icon"
                (click)="minimize.emit(item)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.07252 6.81434L0.177077 1.68092C-0.0590258 1.43335 -0.0590258 1.03196 0.177077 0.784405L0.748052 0.185678C0.983752 -0.0614781 1.36575 -0.0619538 1.60201 0.184621L5.50001 4.25294L9.39799 0.184621C9.63425 -0.0619538 10.0162 -0.0614781 10.2519 0.185678L10.8229 0.784405C11.059 1.03198 11.059 1.43337 10.8229 1.68092L5.92751 6.81434C5.6914 7.06189 5.30862 7.06189 5.07252 6.81434Z" fill="#3B85FE"/>
                </svg>
            </span>
            <span class="svg-icon svg-icon-custom svg-rotate" style="margin-right: 18px;" *ngIf="item['isMinimize'] === true"
                aria-label="close icon"
                (click)="minimize.emit(item)">
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.07252 6.81434L0.177077 1.68092C-0.0590258 1.43335 -0.0590258 1.03196 0.177077 0.784405L0.748052 0.185678C0.983752 -0.0614781 1.36575 -0.0619538 1.60201 0.184621L5.50001 4.25294L9.39799 0.184621C9.63425 -0.0619538 10.0162 -0.0614781 10.2519 0.185678L10.8229 0.784405C11.059 1.03198 11.059 1.43337 10.8229 1.68092L5.92751 6.81434C5.6914 7.06189 5.30862 7.06189 5.07252 6.81434Z" fill="#3B85FE"/>
                </svg>
            </span>
            <span class="svg-icon svg-icon-custom" aria-label="close icon"
                (click)="removeFromItem.emit(item)">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.6669 5.50017L10.1925 1.97456L10.9196 1.24751C11.0268 1.14025 11.0268 0.965968 10.9196 0.858715L10.1416 0.0807838C10.0344 -0.0264695 9.86009 -0.0264695 9.75284 0.0807838L5.50017 4.33345L1.24751 0.08044C1.14025 -0.0268133 0.965968 -0.0268133 0.858714 0.08044L0.08044 0.858371C-0.0268133 0.965624 -0.0268133 1.13991 0.08044 1.24716L4.33345 5.50017L0.08044 9.75284C-0.0268133 9.86009 -0.0268133 10.0344 0.08044 10.1416L0.858371 10.9196C0.965624 11.0268 1.13991 11.0268 1.24716 10.9196L5.50017 6.6669L9.02578 10.1925L9.75284 10.9196C9.86009 11.0268 10.0344 11.0268 10.1416 10.9196L10.9196 10.1416C11.0268 10.0344 11.0268 9.86009 10.9196 9.75284L6.6669 5.50017Z" fill="#3B85FE"/>
                </svg>
            </span>          
        </div>
        <div
          class="py-0"
          *ngIf="item['isMinimize'] === false"
          [formGroup]="form"
          fxLayout="row"
          fxLayoutAlign="space-around center"
          style="background: #FFFFFF"
        >
          <input
            autocomplete="off"
            matInput
            type="search"
            placeholder="Filter ..."
            [formControlName]="item['head']"
            appearance="outline"
            class="form-control w-100 form-custom mgl pdl-5"
          />
          <button mat-icon-button (click)="search()" style="color: #7E8299;top: -5px;
    left: 7px;
    background-color: transparent!important;" class="mgr icon-search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 21.646L17.7452 15.441C18.9216 13.836 19.6171 11.862 19.6171 9.73C19.6171 4.365 15.2171 0 9.80806 0C4.40002 0 0 4.365 0 9.73C0 15.096 4.40002 19.46 9.80806 19.46C11.8584 19.46 13.7625 18.833 15.3391 17.762L21.6271 24L24 21.646ZM2.8769 9.73C2.8769 5.938 5.98664 2.853 9.80906 2.853C13.6315 2.853 16.7412 5.938 16.7412 9.73C16.7412 13.522 13.6315 16.607 9.80906 16.607C5.98564 16.607 2.8769 13.522 2.8769 9.73Z" fill="#7E8299"/>
</svg>
          </button>
          
        
        </div>
        <div
          fxLayout="row"
          class="pdt pdb level2 rounded-bottom"
          *ngIf="item['isMinimize'] === false"
          style="justify-content: center"
        >
          <mat-checkbox
            class="mr-1"
            [checked]="item['complete_string']"
            (change)="changeStatus($event, 'complete_string')"
            style="font-family: Poppins!important; display: flex; justify-content: center; align-items: center;width: 35%;"
            >Complete string</mat-checkbox
          >
          <mat-checkbox
            class="ml-2"
            [checked]="item['sensitive']"
            (change)="changeStatus($event, 'sensitive')"
            style="font-family: Poppins!important; display: flex; justify-content: center; align-items: center;width: 35%;"
            >Case sensitive</mat-checkbox
          >
        </div>
      </div>
    </div>
  `,
  styles: [
    `
            ::ng-deep .mat-checkbox .mat-checkbox-ripple {
                position: absolute;
                left: calc(50% - 20px)!important;
                top: calc(50% - 20px)!important;
                z-index: 0!important;
                pointer-events: none;
            }
            ::ng-deep .mat-checkbox-layout .mat-checkbox-label {
                line-height: 24px;
                margin-left: 4px!important;
            }

            
        `,
  ],
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
  ) { }

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
    console.log("testest")
    //   console.log(this.items)
    //   console.log(this.item)
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
    console.log("Filtererererer")
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
