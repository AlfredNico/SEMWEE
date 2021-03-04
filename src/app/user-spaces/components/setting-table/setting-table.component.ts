import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable, SettingTable } from '@app/models/setting-table';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-setting-table',
  templateUrl: './setting-table.component.html',
  styleUrls: ['./setting-table.component.scss']
})
export class SettingTableComponent implements OnInit {

  public hidden: any[] = [];
  public noHidden: any[] = [];
  public displayRows: SettingRowsTable = {hiddenRows: [], noHiddenRows: []};
  constructor(@Inject(MAT_DIALOG_DATA) private data: SettingRowsTable) {
    this.displayRows = data;

    this.hidden = this.data.hiddenRows;
    this.noHidden = this.data.noHiddenRows;
    console.log(this.data);

  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.displayRows = {
      hiddenRows: event.container.data,
      noHiddenRows: event.previousContainer.data
    }
    // console.log('data', event.previousContainer.data, event.container.data);

    console.log(this.displayRows);
    
  }

}
