import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tune-it',

  template: `
    <div class="w-100">
      <mat-dialog-content class="w-100" [formGroup]="form">
        <div
          class="w-100 py-0 px-2"
          fxLayout="row"
          fxLayoutAlign="space-between center"
        >
          <div>Tune it !</div>
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

      <mat-dialog-actions class="w-100 p-0" align="end">
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
    </div>
  `,
  styleUrls: ['./tune-it.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TuneItComponent implements OnInit, AfterViewInit {
  items: any[] = [
    { value: 'edit_spelling', viewValue: 'Edit spelling' },
    { value: 'synonymize', viewValue: 'Synonymize' },
    { value: 'edit_synonyms', viewValue: 'Edit synonyms' },
  ];

  form = new FormGroup({
    edit_spelling: new FormControl(''),
    synonymize: new FormControl(''),
    edit_synonyms: new FormControl(''),
  });

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {}
}
