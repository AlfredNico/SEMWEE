import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-header-options',
  template: `
    <div fxLayout="column" class="w-100">
      <div
        mat-dialog-content
        cdkDropListGroupd
        fxLayout="row"
        fxLayoutAlign="space-evenly start"
      >
        <div class="container-box" class="w-50 h-100">
          <h2>Avalable columns</h2>
          <div class="table-columns">
            <div
              cdkDropList
              #hiddenList="cdkDropList"
              [cdkDropListData]="hidden"
              [cdkDropListConnectedTo]="[noHiddenList]"
              (cdkDropListDropped)="drop($event)"
              class="containt-list"
            >
              <div *ngFor="let item of hidden">
                <div
                  *ngIf="!item?.includes('Value')"
                  class="box"
                  [ngClass]="{ setItem: selectedItems.includes(item) }"
                  cdkDrag
                  (click)="setClickedItem(item, hidden)"
                >
                  {{ item.split('_').join(' ') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div fxLayout="column" style="margin: auto 4em;">
          <button
            [disabled]="btnToRigth"
            (click)="moveToRigth()"
            type="button"
            mat-raised-button
            class="m-1"
          >
            Display
            <mat-icon>keyboard_arrow_right</mat-icon>
          </button>
          <button
            [disabled]="btnToLeft"
            (click)="moveToLeft()"
            type="button"
            mat-raised-button
            class="m-1"
          >
            Hide
            <mat-icon>keyboard_arrow_left</mat-icon>
          </button>
          <mat-checkbox color="accent">
            But keep hiding properties labels
          </mat-checkbox>
        </div>

        <div class="container-box" class="w-50 h-100">
          <h2>Table columns</h2>
          <!--  && !item.includes('ID') -->
          <div class="table-columns">
            <div
              cdkDropList
              #noHiddenList="cdkDropList"
              [cdkDropListData]="noHidden"
              [cdkDropListConnectedTo]="[hiddenList]"
              [cdkDropListEnterPredicate]="canDrop"
              (cdkDropListDropped)="drop($event)"
              class="containt-list"
            >
              <div *ngFor="let item of noHidden">
                <div
                  *ngIf="!item?.includes('Value')"
                  class="box"
                  cdkDrag
                  (click)="setClickedItem(item, noHidden)"
                  [ngClass]="{ setItem: selectedItems.includes(item) }"
                >
                  {{ item.split('_').join(' ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div mat-dialog-actions align="center">
        <button
          (click)="onClick()"
          mat-raised-button
          color="accent"
          tabindex="-1"
        >
          CLOSE
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./header-options.component.scss'],
})
export class HeaderOptionsComponent implements OnInit {
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
  public displayRows = { hiddenRows: [], noHiddenRows: [] };
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder
  ) {
    this.displayRows = this.data;

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
    return true;
  }

  onClick(): void {
    this.dialogRef.close(this.displayRows);
  }

  moveToLeft() {
    this.selectedItems.forEach((value) => {
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
    });
    this.btnToRigth = true;
    this.btnToLeft = true;
    this.selectedItems = []; //init items selecteds
    this.infItems = { previewIndex: 0, currentIndex: 0, isFacet: false };
  }

  moveToRigth() {
    this.selectedItems.forEach((value) => {
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
    });
    this.btnToRigth = true;
    this.btnToLeft = true;
    this.selectedItems = []; //init items selecteds
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

  setClickedItem(item: string, items: string[]) {
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
            if (!this.selectedItems.includes(val)) this.selectedItems.push(val);
            // if (this.selectedItems.includes(item))
            //   this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
          }
        });
      } else {
        items.forEach((val, i) => {
          if (this.selectedIndex <= i && i <= index) {
            if (!this.selectedItems.includes(val)) this.selectedItems.push(val);
            // if (this.selectedItems.includes(item))
            //   this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
          }
        });
      }
    } else {
      this.selectedItems = [];
      this.selectedItems.push(item);
    }
    this.selectedIndex = index;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.isKeyPressed = false;
  }

  @HostListener('window:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 17 || event.keyCode === 16 || event.ctrlKey) {
      this.isKeyPressed = true;
    }
  }
}
