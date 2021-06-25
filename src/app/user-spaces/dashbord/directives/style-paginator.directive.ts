import {
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

interface PageObject {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  selector: '[appStylePaginator]',
})
export class StylePaginatorDirective {
  // private _pageGapTxt = '...';
  private _rangeStart: number;
  private _rangeEnd: number;
  private _buttons = [];
  private _curPageObj: PageObject = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0,
  };
  private _isFetchData = false;

  @Input()
  get showTotalPages(): number {
    return this._showTotalPages;
  }
  set showTotalPages(value: number) {
    this._showTotalPages = value % 2 == 0 ? value + 1 : value;
  }
  private _showTotalPages = 2;

  get inc(): number {
    return this._showTotalPages % 2 == 0
      ? this.showTotalPages / 2
      : (this.showTotalPages - 1) / 2;
  }

  get numOfPages(): number {
    return this.matPag.getNumberOfPages();
  }

  get lastPageIndex(): number {
    return this.matPag.getNumberOfPages() - 1;
  }

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef,
    private ren: Renderer2,
    private readonly lpviLped: LpdLpdService
  ) {
    //to rerender buttons on items per page change and first, last, next and prior buttons
    this.matPag.page.subscribe((e: PageObject) => {
      if (
        this._curPageObj.pageSize != e.pageSize &&
        this._curPageObj.pageIndex != 0
      ) {
        e.pageIndex = 0;
        this._rangeStart = 0;
        this._rangeEnd = this._showTotalPages - 1;
      }
      this._curPageObj = e;

      this.initPageRange();
    });

    this.lpviLped.dataSources$.subscribe((res) => {
      if (res) {
        this._curPageObj = {
          length: 0,
          pageIndex: 0,
          pageSize: 0,
          previousPageIndex: 0,
        };
        this._rangeStart = 0;
        this._rangeEnd = 0;

        this._isFetchData = true;
        this.initPageRange();
        //   this.createButton(0, 0);
      }
    });
  }

  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions'
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-next'
    );
    const prevButtonCount = this._buttons.length;

    // remove buttons before creating new ones
    if (this._buttons.length > 0) {
      this._buttons.forEach((button) => {
        this.ren.removeChild(actionContainer, button);
        // if (this._isFetchData) {
        //   this.ren.removeAttribute(actionContainer, 'disabled');
        //   // if (button.hasAttribute('disabled')) console.log('OKOK');
        //   // return this._actionContainers[index].removeAttribute('disabled');
        //   // this.ren.setStyle(actionContainer, 'background-color', 'red');
        //   //Empty state array
        // }
        // this._isFetchData = false;
      });

      this._buttons.length = 0;
    }

    //initialize next page and last page buttons
    if (this._buttons.length == 0) {
      // console.log('btn=', this._isFetchData);

      let nodeArray =
        this.vr.element.nativeElement.childNodes[0].childNodes[0].childNodes[2]
          .childNodes;
      setTimeout(() => {
        for (let i = 0; i < nodeArray.length; i++) {
          if (nodeArray[i].nodeName === 'BUTTON') {
            if (!this._isFetchData) {
              if (
                nodeArray[i].innerHTML.length > 100 &&
                nodeArray[i].disabled
              ) {
                this.ren.setStyle(
                  nodeArray[i],
                  'background-color',
                  'rgba(236, 241, 246, 1)'
                );
                this.ren.setStyle(
                  nodeArray[i],
                  'color',
                  'rgba(181, 181, 195, 1)'
                );
                this.ren.setStyle(nodeArray[i], 'box-shadow', 'none');
                this.ren.setStyle(nodeArray[i], 'border-radius', '5px');
                this.ren.setStyle(nodeArray[i], 'margin', '.5%');
              } else if (
                nodeArray[i].innerHTML.length > 100 &&
                !nodeArray[i].disabled
              ) {
                this.ren.setStyle(
                  nodeArray[i],
                  'background-color',
                  'rgba(236, 241, 246, 1)'
                );
                this.ren.setStyle(
                  nodeArray[i],
                  'color',
                  'rgba(181, 181, 195, 1)'
                );
                this.ren.setStyle(nodeArray[i], 'box-shadow', 'none');
                this.ren.setStyle(nodeArray[i], 'border-radius', '5px');
                this.ren.setStyle(nodeArray[i], 'margin', '.5%');
              } else if (nodeArray[i].disabled) {
                // } else if (this._isFetchData) {
                this.ren.setStyle(
                  nodeArray[i],
                  'background-color',
                  'rgba(54, 153, 255, 1)'
                );
                this.ren.setStyle(nodeArray[i], 'color', 'white');
              } else if (!nodeArray[i].disabled) {
                // } else if (!this._isFetchData) {
                this.ren.setStyle(
                  nodeArray[i],
                  'background-color',
                  'transparent'
                );
                this.ren.setStyle(
                  nodeArray[i],
                  'color',
                  'rgba(138, 140, 159, 1)'
                );
              }
            }
          } else if (this._isFetchData) {
            console.log(nodeArray[i]);
            // if (i == 0) {
            //   this.ren.setStyle(
            //     nodeArray[i],
            //     'background-color',
            //     'rgba(54, 153, 255, 1)'
            //   );
            //   this.ren.setStyle(nodeArray[i], 'color', 'white');
            // } else {
            //   this.ren.setStyle(
            //     nodeArray[i],
            //     'background-color',
            //     'transparent'
            //   );
            //   this.ren.setStyle(
            //     nodeArray[i],
            //     'color',
            //     'rgba(138, 140, 159, 1)'
            //   );
            // }
          }
        }
        // this._isFetchData = false;
      });
    }

    for (let i = 0; i < this.numOfPages; i++) {
      if (i >= this._rangeStart && i <= this._rangeEnd) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(i, this.matPag.pageIndex),
          nextPageNode
        );
      }

      // if (i == this._rangeEnd) {
      //   this.ren.insertBefore(
      //     actionContainer,
      //     this.createButton(this._pageGapTxt, this._rangeEnd),
      //     nextPageNode
      //   );
      // }
    }
  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn: MatButton = this.ren.createElement('button');
    this.ren.addClass(linkBtn, 'mat-mini-fab');
    this.ren.setStyle(linkBtn, 'margin', '1%');
    this.ren.setStyle(linkBtn, 'background-color', 'white');

    const pagingTxt = isNaN(i) ? '...' : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');

    this.ren.addClass(linkBtn, 'mat-custom-page');
    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        break;
      // case this._pageGapTxt:
      // let newIndex = this._curPageObj.pageIndex + this._showTotalPages;

      // if (newIndex >= this.numOfPages) newIndex = this.lastPageIndex;

      // if (pageIndex != this.lastPageIndex) {
      //   this.ren.listen(linkBtn, 'click', () => {
      //     console.log('working: ', pageIndex);
      //     this.switchPage(newIndex);
      //   });
      // }

      // if (pageIndex == this.lastPageIndex) {
      //   this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
      // }
      // break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(i);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    //Add button to private array for state
    this._buttons.push(linkBtn);
    return linkBtn;
  }
  //calculates the button range based on class input parameters and based on current page index value. Used to render new buttons after event.
  private initPageRange(): void {
    const middleIndex = (this._rangeStart + this._rangeEnd) / 2;

    this._rangeStart = this.calcRangeStart(middleIndex);
    this._rangeEnd = this.calcRangeEnd(middleIndex);

    this.buildPageNumbers();
  }

  //Helper function To calculate start of button range
  private calcRangeStart(middleIndex: number): number {
    switch (true) {
      case this._curPageObj.pageIndex == 0 && this._rangeStart != 0:
        return 0;
      case this._curPageObj.pageIndex > this._rangeEnd:
        return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex - this.inc * 2
          : this._curPageObj.pageIndex - this.inc;
      case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex > middleIndex &&
        this._rangeEnd < this.lastPageIndex:
        return this._rangeStart + 1;
      case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex < middleIndex &&
        this._rangeStart > 0:
        return this._rangeStart - 1;
      default:
        return this._rangeStart;
    }
  }
  //Helpter function to calculate end of button range
  private calcRangeEnd(middleIndex: number): number {
    switch (true) {
      case this._curPageObj.pageIndex == 0 &&
        this._rangeEnd != this._showTotalPages:
        return this._showTotalPages - 1;
      case this._curPageObj.pageIndex > this._rangeEnd:
        return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex
          : this._curPageObj.pageIndex + 1;
      case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex > middleIndex &&
        this._rangeEnd < this.lastPageIndex:
        return this._rangeEnd + 1;
      case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
        this._curPageObj.pageIndex < middleIndex &&
        this._rangeStart >= 0 &&
        this._rangeEnd > this._showTotalPages - 1:
        return this._rangeEnd - 1;
      default:
        return this._rangeEnd;
    }
  }
  //Helper function to switch page on non first, last, next and previous buttons only.
  private switchPage(i: number): void {
    // console.log('switch', i);
    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag['_emitPageEvent'](previousPageIndex);
    this.initPageRange();
  }
  //Initialize default state after view init
  public ngAfterViewInit() {
    this._rangeStart = 0;
    this._rangeEnd = this._showTotalPages - 1;
    this.initPageRange();
  }
}
