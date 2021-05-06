import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editor-dialog',
  template: `
    <h1 mat-dialog-title>Hi {{ data }}</h1>
    <div mat-dialog-content>
      <p>Close me by clicking outside</p>
      <mat-form-field>
        <input matInput />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Ok</button>
    </div>
  `,
  styles: [],
})
export class EditorDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
