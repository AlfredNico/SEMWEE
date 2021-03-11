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

  private isDrop = false;

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
    // const previousIndex = event.previousIndex;

    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex % 2 == 0 ? event.currentIndex : event.currentIndex + 1;
    if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, previousIndex, currentIndex);
        
        if (event.container.data[previousIndex]?.includes('Facet')) {
          moveItemInArray(event.container.data,previousIndex + 1, currentIndex + 1);
        }
    } else {
      console.log(event.previousContainer.data[previousIndex]);
      if (!event.previousContainer.data[previousIndex].includes('Value')) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          previousIndex,
          currentIndex
        );
  
        const current = event.previousContainer.data[previousIndex];
        const index = event.previousContainer.data.indexOf(`${current}`);
  
      if (event.previousContainer.data[previousIndex]?.includes('Facet')) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            index,
            currentIndex + 1
          );
        }
      }

    }

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

