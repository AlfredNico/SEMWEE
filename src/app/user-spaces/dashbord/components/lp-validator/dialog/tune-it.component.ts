import { NotificationService } from './../../../../../services/notification.service';
import { PropertyValueService } from './../../../services/property-value.service';
import { ItemTypeService } from './../../../services/item-type.service';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tune-it',

  template: `
    <div
      class="w-100 panel"
      [formGroup]="form"
      fxLayout="row"
      [ngClass]="{
        panel1: itemType == 'ItemType',
        panel2: itemType != 'ItemType'
      }"
    >
      <div fxLayout="column" fxLayoutAlign="space-between center" class="w-100">
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

        <mat-dialog-actions class="w-100 p-0" align="end">
          <button
            mat-raised-button
            color="accent"
            (click)="onClick()"
            cdkFocusInitial
          >
            <span *ngIf="itemType == 'ItemType'">Apply</span>
            <span *ngIf="itemType != 'ItemType'">Apply on the Table</span>
          </button>
          <button mat-raised-button color="accent" mat-dialog-close>
            Cancel
          </button>
        </mat-dialog-actions>
      </div>
      <div
        fxLayout="column"
        *ngIf="itemType != 'ItemType'"
        style="width: 350px; margin-left: 3em;"
      >
        <mat-label class="w-100 px-1 py-2">
          <h4 class="m-0">Semantic Scope</h4>
          <i>Even hidden columns and lines are concerned !</i>
        </mat-label>
        <mat-radio-group aria-label="items" formControlName="SemanticScope">
          <!-- [(ngModel)]="itemsType[0].value" [checked]="i === 0" -->
          <mat-radio-button
            color="accent"
            class="mx-5"
            *ngFor="let item of itemsType; let i = index"
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
    { value: 'item_type_only', label: 'This Item Type only' },
    { value: 'all_item', label: 'All Item Types' },
    { value: 'related_item', label: 'Related item Types' },
  ];
  itemType: any = '';
  isItem: boolean;

  form = new FormGroup({
    Editspelling: new FormControl(''),
    Synonimyze: new FormControl(''),
    Editsynonimize: new FormControl(''),
    SemanticScope: new FormControl(false),
    Apply_on_the_colum: new FormControl(false),
    Apply_on_the_table: new FormControl(false),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { checkTuneIt: Array<any>; itemSeleted: string; row: any },
    public dialogRef: MatDialogRef<TuneItComponent>,
    private itemService: ItemTypeService,
    private propertyService: PropertyValueService,
    private notifs: NotificationService
  ) {
    if (this.data && this.data.row) {
      this.itemType = this.data.itemSeleted;

      if (this.data.checkTuneIt.length !== 0) {
        console.log(this.data.itemSeleted);
        if (this.data.itemSeleted === 'ItemType') {
          const value = this.data.checkTuneIt[0];
          this.form.patchValue({
            ...value,
          });
        } else {
          const value = this.data.checkTuneIt;
          this.form.patchValue({
            Editspelling: value[0]['Editspelling'],
            SemanticScope: value[0]['SemanticScope'],
          });
        }
      } else {
        //updares formValue
        this.form.patchValue({
          Editspelling: this.data.row[`${this.data.itemSeleted}`],
          SemanticScope: this.itemsType[2].value,
        });
      }

      console.log('data ', this.data);
    }
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
        if (this.data.checkTuneIt && this.data.checkTuneIt.length !== 0) {
          const data = {
            ...this.form.value,
            idinferlist: this.data.row['_id'],
          };
          const res = await this.itemService.appygItemType(
            data,
            this.data.checkTuneIt[0]['_id']
          );
          if (res && res.message) this.dialogRef.close(this.form.value);
          this.notifs.sucess(res.message);
          console.log(res);
        } else {
          const data = {
            ...this.form.value,
            idinferlist: this.data.row['_id'],
          };
          const res = await this.itemService.appygItemType(data);
          if (res && res.message) this.dialogRef.close(this.form.value);
          this.notifs.sucess(res.message);
        }
      } else {
        if (this.data.checkTuneIt && this.data.checkTuneIt.length !== 0) {
          const value = {
            ...this.form.value,
            Apply_on_the_table: true,
            idinferlist: this.data.row['_id'],
            NomProperty: this.itemType,
          };
          const res = await this.propertyService.appyPropertyValue(
            value,
            this.data.checkTuneIt[0]
          );

          if (res && res.message) this.dialogRef.close(this.form.value);
          this.notifs.sucess(res.message);
        } else {
          const value = {
            ...this.form.value,
            Apply_on_the_table: true,
            idinferlist: this.data.row['_id'],
            NomProperty: this.itemType,
          };
          const res = await this.propertyService.appyPropertyValue(value);
          if (res && res.message) this.dialogRef.close(this.form.value);
          this.notifs.sucess(res.message);
        }
      }
    }

    // this.dialogRef.close(this.form.value);
  }
}
