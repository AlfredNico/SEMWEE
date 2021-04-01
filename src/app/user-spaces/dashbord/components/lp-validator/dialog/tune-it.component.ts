import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tune-it',
  template: `
    <div class="w-100 px-0 pt-0 pb-1">
      <mat-dialog-content class="w-100" [formGroup]="form">
        <div class="w-100" fxLayout="row" fxLayoutAlign="space-between center">
          <div> Tune it ! </div>
          <mat-form-field appearance="outline">
            <mat-select [value]="items[0].value" #item>
              <mat-option *ngFor="let item of items" [value]="item.value">
                {{item.viewValue}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="w-100">
          <textarea matInput></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions class="w-100" align="end">
        <button mat-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>Apply</button>
        <button mat-button color="primary" mat-dialog-close>Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrls: ['./tune-it.component.scss']
})
export class TuneItComponent implements OnInit {

  items: any[] = [
    { value: 'edit_spelling', viewValue: 'Edit spelling' },
    { value: 'synonymize', viewValue: 'Synonymize' },
    { value: 'edit_synonyms', viewValue: 'Edit synonyms' }
  ];

  form = new FormGroup({
    edit_spelling: new FormControl(''),
    synonymize: new FormControl(''),
    edit_synonyms: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }

}
