import { CommonService } from '@app/shared/services/common.service';
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
        panel1: inludes(itemType),
        panel2: !itemType
      }"
    >
      <div fxLayout="column" fxLayoutAlign="space-between center" class="w-100">
        <mat-dialog-content class="w-100">
          <div
            class="w-100 py-0 px-2"
            fxLayout="row"
            fxLayoutAlign="space-between center"
          >
            <h2>Tune it !</h2>
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
            *ngIf="item.value == 'Synonymize'"
          >
            <textarea
              matInput
              rows="3"
              cols="30"
              placeholder="Synonymize..."
              formControlName="Synonymize"
            ></textarea>
          </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions class="w-100 p-0" align="end">
          <button
            mat-raised-button
            color="accent"
            (click)="!loading && onClick()"
            cdkFocusInitial
            [ngStyle]="{ width: inludes(itemType) ? '5em' : '11em' }"
          >
            <span *ngIf="inludes(itemType) && !loading"> Apply </span>
            <span *ngIf="!inludes(itemType) && !loading"
              >Apply on the Table</span
            >
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
      <div
        fxLayout="column"
        *ngIf="!inludes(itemType)"
        style="width: 350px; margin-left: 3em;"
      >
        <mat-label class="w-100 px-1 py-2">
          <h4 class="m-0">Semantic Scope</h4>
          <i>Even hidden columns and lines are concerned !</i>
        </mat-label>
        <mat-radio-group aria-label="items" formControlName="SemanticScope">
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
    { value: 'Synonymize', viewValue: 'Synonymize' },
  ];
  readonly itemsType: { value: string; label: string }[] = [
    { value: 'item_type_only', label: 'This Item Type only' },
    { value: 'all_item', label: 'All Item Types' },
    { value: 'related_item', label: 'Related item Types' },
  ];
  itemType: any = '';
  isItem: boolean;
  public oldname: string = '';
  public loading: boolean = false;

  form = new FormGroup({
    Editspelling: new FormControl(''),
    Synonymize: new FormControl(''),
    oldname: new FormControl(''),
    // Apply_on_the_colum: new FormControl(false),
    SemanticScope: new FormControl(false),
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
      this.oldname = this.data.row[this.data.itemSeleted];

      if (this.data.checkTuneIt.length !== 0) {
        if (this.inludes(this.itemType)) {
          const value = this.data.checkTuneIt[0];
          this.form.patchValue({
            ...value,
            oldname: this.data.row[this.itemType],
          });
        } else {
          const value = this.data.checkTuneIt;
          this.form.patchValue({
            Editspelling: value[0]['Editspelling'],
            SemanticScope: value[0]['SemanticScope'],
            oldname: this.data.row[this.itemType],
          });
        }
      } else {
        //updares formValue
        this.form.patchValue({
          Editspelling: this.data.row[`${this.data.itemSeleted}`],
          SemanticScope: this.itemsType[0].value,
          oldname: this.data.row[this.itemType],
        });
      }
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}

  async onClick() {
    this.loading = true;
    const { Editspelling, Synonymize } = this.form.controls;

    if (Editspelling.value || Synonymize.value) {
      if (this.inludes(this.itemType) === true) {
        const data = {
          idinferlist: this.data.row['_id'],
          Editspelling: this.form.controls.Editspelling.value,
          Synonymize: this.form.controls.Synonymize.value,
          oldname: this.form.controls.oldname.value,
        };

        try {
          const res = await this.itemService.appygItemType(data);
          if (res && res.message) {
            this.notifs.sucess(res.message);
            this.loading = false;
            this.dialogRef.close(this.form.value);
          }
        } catch (error) {
          this.loading = false;
        }
      } else {
        const value = {
          ...this.form.value,
          Apply_on_the_table: true,
          NomProperty: this.itemType,
          idproject: this.data.row['idProduct'],
        };

        //  [disabled]="!contractTypeValid" console.log(value);
        try {
          const res = await this.propertyService.appyPropertyValue(value);
          if (res && res.message) {
            this.loading = false;
            this.notifs.sucess(res.message);
            this.dialogRef.close(this.form.value);
          }
        } catch (error) {
          this.loading = false;
        }
      }
    }
  }

  public inludes(item: string): boolean {
    return !!item.toLowerCase().match(/item[^]*type$/);
  }
}
