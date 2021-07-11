import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove',
  template: `
    <div fxLayout="column">
      <h1 mat-dialog-title>Delete confirmation</h1>
      <div mat-dialog-content>
        <span> {{ data.message }} </span>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-raised-button tabindex="-1" [mat-dialog-close]="false">
          Close
        </button>
        <button
          mat-raised-button
          tabindex="-1"
          color="warn"
          [mat-dialog-close]="true"
        >
          Remove
        </button>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class RemoveComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
