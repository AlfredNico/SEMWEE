import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable } from '@app/models/setting-table';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-setting-table',
  templateUrl: './setting-table.component.html',
  styleUrls: ['./setting-table.component.scss']
})
export class SettingTableComponent implements OnInit {

  public hidden = new Array<string>();
  public noHidden = new Array<string>();
  public displayRows: SettingRowsTable = { hiddenRows: [], noHiddenRows: [] };
  constructor(@Inject(MAT_DIALOG_DATA) private data: SettingRowsTable, public dialogRef: MatDialogRef<SettingRowsTable>) {
    this.displayRows = data;

    this.hidden = this.data.hiddenRows;
    this.noHidden = this.data.noHiddenRows;
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.displayRows = {
      noHiddenRows: this.noHidden,
      hiddenRows: this.hidden,
    }

  }

  onClick(): void {
    this.dialogRef.close(this.displayRows);
  }

}

