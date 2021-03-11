import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable } from '@app/models/setting-table';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-options',
  templateUrl: './table-options.component.html',
  styleUrls: ['./table-options.component.scss']
})
export class TableOptionsComponent implements OnInit {


  public hidden = new Array<string>();
  public noHidden: string[] = [];
  // Generate form builder rows
  public filters = this.fb.group([]);

  public displayRows: SettingRowsTable = { hiddenRows: [], noHiddenRows: [] };
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<SettingRowsTable>, private fb: FormBuilder) {
    this.displayRows = this.data;
    // console.log(data);
    if (this.data.noHiddenRows.includes('select')) {
      const value = this.data.noHiddenRows.shift();
    }

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

      console.log(event.previousContainer.data);
        
      if (event.previousContainer.data[event.previousIndex].includes('Facet')) {
        // console.log(this.noHidden);
        console.log(event.previousContainer.data[event.previousIndex]);
        console.log(event.currentIndex);

        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
    }
    // this.noHidden.forEach((column, index) => {
    //   this.filters.addControl(column, new FormControl(''));
    // });

    console.log(this.hidden);
    // console.log(event.previousContainer.data[event.previousIndex]);
    // console.log(event.currentIndex);


    this.displayRows = {
      noHiddenRows: this.noHidden,
      hiddenRows: this.hidden,
    }

  }

  canDrop() {
    // return this.data.length < 6;
    return true;
  }

  onClick(): void {
    if (!this.noHidden.includes('select')) {
      const value = this.noHidden.unshift('select');
    }
    this.dialogRef.close(this.displayRows);
  }

}

