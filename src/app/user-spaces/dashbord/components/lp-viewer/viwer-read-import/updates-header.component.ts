import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LpViwersService } from '@app/user-spaces/dashbord/services/lp-viwers.service';

@Component({
  selector: 'app-updates-header',
  template: `
     <div
      class="w-100 panel"
      [formGroup]="form"
      fxLayout="column"
    >
        <mat-dialog-content class="w-100  m-0 p-0">
          <div
            class="w-100 p-0"
          >
            <h2>Updates header Column !</h2>
          </div>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Updates column</mat-label>
            <input matInput autocomplete="off" formControlName="columName">
          </mat-form-field>

        </mat-dialog-content>

        <mat-dialog-actions class="w-100 p-0" align="end">
          <button
            mat-raised-button
            color="accent"
            (click)="onClick()"
            >
            <!-- (click)="!loading && onClick()" -->
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
  styles: [`
    .mat-dialog-container{
      padding: 5px 24px !important;
    }
  `]
})
export class UpdatesHeaderComponent implements OnInit {

  public oldname: string = '';
  public loading: boolean = false;
  edidtableColumns: string[] = [];
  public index: number = 0;

  form = new FormGroup({
    columName: new FormControl(''),
  });

  constructor(public dialogRef: MatDialogRef<any>, private lpViwer: LpViwersService,
    @Inject(MAT_DIALOG_DATA) private data: { index: number, idHeader: any, edidtableColumns: string[] }) {
    if (this.data) {
      console.log(this.data.edidtableColumns);

      this.form.patchValue({
        columName: this.data.edidtableColumns[this.data.index]
      })
      this.index = this.data.index;
      this.edidtableColumns = this.data.edidtableColumns;
    }
  }

  ngOnInit(): void {
  }

  public onClick() {
    this.edidtableColumns[this.index] = Object.values(this.form.value).toString();

    this.edidtableColumns = [...this.edidtableColumns];
    this.lpViwer.putDisplayColums(this.data.idHeader, JSON.stringify(this.edidtableColumns))
    this.dialogRef.close(true);
  }

}
