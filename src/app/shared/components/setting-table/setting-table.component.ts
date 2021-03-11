import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable } from '@app/models/setting-table';

@Component({
  selector: 'app-setting-table',
  templateUrl: './setting-table.component.html',
  styleUrls: ['./setting-table.component.scss']
})
export class SettingTableComponent implements OnInit {

  selectedOptions: string[] = [];
  facetLists: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<SettingRowsTable>) {
    this.facetLists = this.data.facetLists;
  }

  ngOnInit(): void {
    this.facetLists.forEach((item: string, index: number) => {
      if (index < 14 && item.includes('Facet') && !item.includes('Value')) {
        this.selectedOptions.push(item);
      }
    });
    console.log(this.selectedOptions);

  }

  onNgModelChange(options: string) {
    if (!this.selectedOptions.includes(options)) {
      this.selectedOptions.push(options);
    } else {
      this.selectedOptions = this.selectedOptions.filter(s => s !== options);
    }
    //console.log(options);
    // this.selectedOptions = options.selectedOptions.selected.map((item: any) => item.value);
    console.log(this.selectedOptions);

    // map these MatListOptions to their values
    // options.map(o => o.value);
  };

  onClick(): void {
    this.dialogRef.close(this.selectedOptions);
  }

}

