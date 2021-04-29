import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable } from '@app/models/setting-table';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-options',
  templateUrl: './table-options.component.html',
  styleUrls: ['./table-options.component.scss'],
})
export class TableOptionsComponent implements OnInit {
  public hidden: string[] = [];
  public noHidden: string[] = [];
  // Generate form builder rows
  public filters = this.fb.group([]);
  btnToRigth: boolean = true;
  btnToLeft: boolean = true;
  selectedItems: string[] = [];
  selectedIndex: number = 0;
  isKeyPressed: boolean = false;

  infItems = { previewIndex: 0, currentIndex: 0, isFacet: false };

  private isDrop = false;

  public displayRows: SettingRowsTable = { hiddenRows: [], noHiddenRows: [] };
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<SettingRowsTable>,
    private fb: FormBuilder
  ) {
    this.displayRows = this.data;
    
    if (this.data.noHiddenRows.includes('select')) {
      const value = this.data.noHiddenRows.shift();
    }

    this.hidden = this.data.hiddenRows;
    this.noHidden = this.data.noHiddenRows;
  }

  ngOnInit(): void {}

  drop(event: CdkDragDrop<string[]>) {
    // const previousIndex = event.previousIndex;
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    // event.currentIndex % 2 == 0 ? event.currentIndex : event.currentIndex + 1;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, previousIndex, currentIndex);

      if (event.container.data[previousIndex]?.includes('Facet')) {
        moveItemInArray(
          event.container.data,
          previousIndex + 1,
          currentIndex + 1
        );
      }
    }

    this.displayRows = {
      noHiddenRows: this.noHidden,
      hiddenRows: this.hidden,
    };
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

  moveToLeft() {
    this.selectedItems.forEach((value) =>{
      this.setItemLeft(value);

      transferArrayItem(
        this.noHidden,
        this.hidden,
        this.infItems.previewIndex,
        this.infItems.currentIndex
      );
  
      if (this.infItems.isFacet === true) {
        const facetIndex = this.noHidden.indexOf(
          this.noHidden[this.infItems.previewIndex]
          );
        transferArrayItem(
          this.noHidden,
          this.hidden,
          facetIndex,
          this.hidden.length
        );
      }
    })
     this.btnToRigth = true;
    this.btnToLeft = true;
    this.selectedItems = [] //init items selecteds
    this.infItems = { previewIndex: 0, currentIndex: 0, isFacet: false };
  }

  moveToRigth() {
    this.selectedItems.forEach((value)=>{
      this.setItemRigth(value);

      transferArrayItem(
        this.hidden,
        this.noHidden,
        this.infItems.previewIndex,
        this.infItems.currentIndex
      );
      if (this.infItems.isFacet === true) {
        const facetIndex = this.noHidden.indexOf(
          this.noHidden[this.infItems.previewIndex]
        );
        transferArrayItem(
          this.hidden,
          this.noHidden,
          facetIndex,
          this.noHidden.length
        );
      }
    })
    this.btnToRigth = true;
    this.btnToLeft = true;
    this.selectedItems = [] //init items selecteds
    this.infItems = { previewIndex: 0, currentIndex: 0, isFacet: false };
  }

  private setItemLeft(item: string) {
    this.infItems = this.getIndexDisplayColums(item);
  }

  private setItemRigth(item: string) {
    this.infItems = this.getIndexHiddenColumns(item.toString());
  }

  private getIndexDisplayColums(item: string) {
    const previewIndex = this.noHidden.indexOf(item);
    const currentIndex = this.hidden.length;
    let isFacet = false;
    if (item.includes('Facet') && !item.includes('_Value')) {
      const facetIndex = this.noHidden.indexOf(`${item}_Value`);
      isFacet = true;
    }
    return { previewIndex, currentIndex, isFacet };
  }

  private getIndexHiddenColumns(item: string) {
    const previewIndex = this.hidden.indexOf(item);
    const currentIndex = this.noHidden.length;

    let isFacet = false;
    if (item.includes('Facet') && !item.includes('_Value')) {
      const facetIndex = this.noHidden.indexOf(`${item}_Value`);
      isFacet = true;
    }
    return { previewIndex, currentIndex, isFacet };
  }

  setClickedItem(item: string, items: string[]){
    if (items === this.hidden) {
      this.btnToLeft = true;
      this.btnToRigth = false;
    } else {
      this.btnToLeft = false;
      this.btnToRigth = true;
    }

    const index = items.indexOf(item);
    if (this.selectedIndex && this.isKeyPressed === true) {
      if (this.selectedIndex > index) {
        items.forEach((val, i) => {
          if (this.selectedIndex >= i && i >= index) {
            if (!this.selectedItems.includes(val))
              this.selectedItems.push(val)
            // if (this.selectedItems.includes(item))
            //   this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
          }
        })
      } else {
         items.forEach((val, i) => {
          if (this.selectedIndex <= i && i <= index) {
            if (!this.selectedItems.includes(val))
              this.selectedItems.push(val)
            // if (this.selectedItems.includes(item))
            //   this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
          }
        })
      }
    } else {
      this.selectedItems = [];
      this.selectedItems.push(item);
    }
    this.selectedIndex = index;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
   this.isKeyPressed = false
  }

  @HostListener('window:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 17 || event.keyCode === 16 || event.ctrlKey) {
      this.isKeyPressed = true
    }
  }
}
