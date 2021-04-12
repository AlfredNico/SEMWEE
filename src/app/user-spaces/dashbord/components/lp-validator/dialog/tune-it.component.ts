import { TuneItService } from './../../../services/tune-it.service';
import { TuneIt, TuneItVlaue } from './../../../interfaces/tune-it';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tune-it',

  template: `
    <div
      class="w-100"
      [formGroup]="form"
      fxLayout="row"
      [ngClass]="{ panel: itemType == 'ItemType' }"
    >
      <div
        fxLayout="column"
        fxLayoutAlign="space-between center"
        [ngClass]="{ 'w-100': itemType == 'ItemType' }"
      >
        <mat-dialog-content class="w-100">
          <div
            class="w-100 py-0 px-2"
            fxLayout="row"
            fxLayoutAlign="space-between center"
          >
            <h4>Tune it !</h4>
            <mat-form-field appearance="outline">
              <mat-select [value]="items[0].value" #item>
                <mat-option *ngFor="let item of items" [value]="item.value">
                  {{ item.viewValue }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field
            appearance="outline"
            class="w-100"
            *ngIf="item.value == 'Editspelling'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Edit spelling..."
              formControlName="Editspelling"
            ></textarea>
          </mat-form-field>

          <mat-form-field
            appearance="outline"
            class="w-100"
            *ngIf="item.value == 'Synonimyze'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Synonimyze..."
              formControlName="Synonimyze"
            ></textarea>
          </mat-form-field>

          <mat-form-field
            appearance="outline"
            class="w-100"
            *ngIf="item.value == 'Editsynonimize'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Edit synonyms..."
              formControlName="Editsynonimize"
            ></textarea>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions
          class="w-100 p-0"
          align="end"
          *ngIf="itemType == 'ItemType'"
        >
          <button
            mat-raised-button
            color="accent"
            (click)="onClick()"
            cdkFocusInitial
          >
            Apply
          </button>
          <button mat-raised-button color="accent" mat-dialog-close>
            Cancel
          </button>
        </mat-dialog-actions>
        <mat-dialog-actions
          class="w-100 p-0"
          align="center"
          *ngIf="itemType != 'ItemType'"
        >
          <button
            mat-raised-button
            color="accent"
            [mat-dialog-close]="true"
            cdkFocusInitial
          >
            Apply on the Column
          </button>
          <button
            mat-raised-button
            color="accent"
            cdkFocusInitial
            (click)="onClick()"
          >
            Apply on the Table
          </button>
          <button mat-raised-button color="accent" mat-dialog-close>
            Cancel
          </button>
        </mat-dialog-actions>
      </div>
      <div
        fxLayout="column"
       *ngIf="itemType != 'ItemType'"
        style="width: 250px; margin-left: 2em;"
      >
        <mat-label class="w-100 px-1 py-2">
          <h4 class="m-0">Semantic Scope</h4>
          <i>Even hidden columns and lines are concerned !</i>
        </mat-label>
        <mat-radio-group aria-label="items" formControlName="SemanticScope">
          <mat-radio-button
            color="accent"
            class="mx-5"
            *ngFor="let item of itemsType"
            [value]="item.value"
          >
            {{ item.label }}
          </mat-radio-button>
        </mat-radio-group>
      </div>
    </div>
  `,
  styleUrls: ['./tune-it.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TuneItComponent implements OnInit, AfterViewInit {
  readonly items: any[] = [
    { value: 'Editspelling', viewValue: 'Edit spelling' },
    { value: 'Synonimyze', viewValue: 'Synonimyze' },
    { value: 'Editsynonimize', viewValue: 'Edit synonyms' },
  ];
  readonly itemsType: { value: string; label: string }[] = [
    { value: 'item type only', label: 'This Item Type only' },
    { value: 'all item', label: 'All Item Types' },
    { value: 'related item', label: 'Related item Types' },
  ];
  itemType: any = '';
  isItem: boolean;

  form = new FormGroup({
    Editspelling: new FormControl(''),
    Synonimyze: new FormControl(''),
    Editsynonimize: new FormControl(''),
    SemanticScope: new FormControl(false),
    Apply_on_the_colum : new FormControl(false),
    Apply_on_the_table : new FormControl(false),
  });

  tuneIt: TuneIt<TuneItVlaue>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {checkTuneIt: Array<any>, itemSeleted: string, row: any},
    public dialogRef: MatDialogRef<TuneItComponent>,
    private tuneItService: TuneItService
  ) {
    if (this.data.checkTuneIt.length != 0) {
      console.log(this.data.itemSeleted)
      if (this.data.itemSeleted == 'ItemType') {
        const value = this.data.checkTuneIt[0];
        this.form.patchValue({
          ...value
        })
        console.log('v', value)
      }else{
        const value = this.data.checkTuneIt[`${this.data.itemSeleted}`];
        console.log(value);
      }

    }
    console.log('data ', this.data.checkTuneIt);
    this.itemType = this.data.itemSeleted;

  }

  ngOnInit(): void {}

  ngAfterViewInit() {}

  async onClick() {
    const {
      Editspelling,
      Synonimyze,
      Editsynonimize,
      SemanticScope,
    } = this.form.controls;

    if (Editspelling.value || Synonimyze.value || Editsynonimize.value) {
      if (this.itemType == 'ItemType') {
        if (this.data.checkTuneIt && this.data.checkTuneIt.length != 0) {
          const data = {
            ...this.form.value,
            'idinferlist': this.data.row['_id']
          }
          const res = await this.tuneItService.appy(data, this.data.checkTuneIt[0]['_id']);
          if (res && (res as any).message)
            this.dialogRef.close();
        } else {
          const data = {
            ...this.form.value,
            'idinferlist': this.data.row['_id']
          }
          console.log(data)
          const res = await this.tuneItService.appy(data);
          if (res && (res as any).message)
            this.dialogRef.close();
        }
      } else {
          if (!this.data.checkTuneIt) {
          const data = {
            ...this.form.value,
            'idinferlist': this.data.row['_id']
          }
          this.tuneItService.appy(data, this.data.checkTuneIt);
        } else {
          const data = {
            ...this.form.value,
            'idinferlist': this.data.row['_id']
          }
          console.log(data)
          this.tuneItService.appy(data);
        }
      }
    }

    // this.dialogRef.close(this.form.value);
  }
}
