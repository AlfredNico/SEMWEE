import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-updates-header',
  template: `
    <div
      class="panel"
      [formGroup]="form"
      fxLayout="column"
      [style.width.px]="500"
    >
      <mat-dialog-content class="w-100  m-0 p-0">
        <div class="w-100 p-0 m-0">
          <h2>Update Header Column</h2>
        </div>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Header Column</mat-label>
          <input
            matInput
            placeholder="Header Column"
            autocomplete="off"
            formControlName="columName"
          />
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions class="w-100 p-0" align="end">
        <button mat-raised-button color="accent" (click)="onClick()">
          <span *ngIf="!loading"> Apply </span>
          <i
            *ngIf="loading"
            class="fa fa-spinner fa-spin"
            style="color: #fff"
          ></i>
        </button>
        <button mat-raised-button color="accent" mat-dialog-close>
          Cancel
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .mat-dialog-container {
        padding: 5px 24px !important;
      }
    `,
  ],
})
export class UpdatesHeaderComponent {
  public loading: boolean = false;
  edidtableColumns: string[] = [];
  public index: number = 0;

  form = new FormGroup({
    columName: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<any>,
    private lpViewer: LpViwersService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      idHeader: number;
      index: number;
      table: any[];
      edidtableColumns: any;
      idproject: any;
    }
  ) {
    if (this.data) {
      this.form.patchValue({
        columName: this.data.edidtableColumns.innerText,
      });
    }
  }

  public onClick() {
    const tabCopy = this.data.table.slice();
    const valueForm = Object.values(this.form.value)
      .toString()
      .split('_')
      .join(' ')
      .toUpperCase()
      .trim();
    this.data.edidtableColumns.innerText = valueForm;

    tabCopy[this.data.index] = valueForm;

    this.lpViewer
      .postDisplayColums(this.data.idproject, this.data.idHeader, tabCopy)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(res['idHeader']);
        }
      });
  }
}
