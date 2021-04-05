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
      [ngClass]="{ panel: isItem == true }"
    >
      <div
        fxLayout="column"
        fxLayoutAlign="space-between center"
        [ngClass]="{ 'w-100': isItem == true }"
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
            *ngIf="item.value == 'edit_spelling'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Edit spelling..."
              formControlName="edit_spelling"
            ></textarea>
          </mat-form-field>

          <mat-form-field
            appearance="outline"
            class="w-100"
            *ngIf="item.value == 'synonymize'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Synonymize..."
              formControlName="synonymize"
            ></textarea>
          </mat-form-field>

          <mat-form-field
            appearance="outline"
            class="w-100"
            *ngIf="item.value == 'edit_synonyms'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Edit synonyms..."
              formControlName="edit_synonyms"
            ></textarea>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions
          class="w-100 p-0"
          align="end"
          *ngIf="isItem == true"
        >
          <button
            mat-raised-button
            color="accent"
            [mat-dialog-close]="true"
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
          *ngIf="isItem == false"
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
            [mat-dialog-close]="true"
            cdkFocusInitial
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
        *ngIf="isItem == false"
        style="width: 250px; margin-left: 2em;"
      >
        <mat-label class="w-100 px-1 py-2">
          <h4 class="m-0">Semantic Scope</h4>
          <i>Even hidden columns and lines are concerned !</i>
        </mat-label>
        <mat-radio-group aria-label="items" formControlName="schematic_scope">
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
    { value: 'edit_spelling', viewValue: 'Edit spelling' },
    { value: 'synonymize', viewValue: 'Synonymize' },
    { value: 'edit_synonyms', viewValue: 'Edit synonyms' },
  ];
  readonly itemsType: { value: string; label: string }[] = [
    { value: 'item type only', label: 'This Item Type only' },
    { value: 'all item', label: 'All Item Types' },
    { value: 'related item', label: 'Related item Types' },
  ];
  itemType: any = '';
  isItem: boolean;

  form = new FormGroup({
    edit_spelling: new FormControl(''),
    synonymize: new FormControl(''),
    edit_synonyms: new FormControl(''),
    schematic_scope: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TuneItComponent>
  ) {
    this.isItem = this.data.item;
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}
}
