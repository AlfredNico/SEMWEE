import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable } from '@app/models/setting-table';

@Component({
  selector: 'app-setting-table',
  templateUrl: './setting-table.component.html',
  styleUrls: ['./setting-table.component.scss'],
})
export class SettingTableComponent implements OnInit {
  selectedOptions: string[] = [];
  facetLists: string[] = [];
  checked: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<SettingRowsTable>
  ) {
    this.facetLists = this.data.selectedOptions;
    this.selectedOptions = this.data.checklist;
    this.checked =  this.data.checked;
    // this.selectedOptions = this.data.selectedOptions;
  }

  ngOnInit(): void {}

  onNgModelChange(options: string) {
    if (!this.selectedOptions.includes(options)) {
      this.selectedOptions.push(options);
    } else {
      this.selectedOptions = this.selectedOptions.filter((s) => s !== options);
    }
  }

  onClick(): void {
    this.dialogRef.close({selected: this.selectedOptions, checked:this.checked});
  }

  onChecked(event: any) {
     this.selectedOptions = [];
    this.selectedOptions = event=== false ? this.selectedOptions=  this.data.selectedOptions: [];
  }

}
