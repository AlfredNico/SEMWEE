import { style } from '@angular/animations';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resizeColumn]',
})
export class ResizableDirective {
  @Input('resizeColumn') resizable: boolean;
  @Input() index: number;
  @Output() tabIndex = new EventEmitter<any>();

  @Input() maxWidth: number;
  private minWidth: number;
  private isDbClicked: boolean = false;

  private startX: number;
  private startY: number;

  private startWidth: number = 0;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      const resizer = this.renderer.createElement('span');

      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
      this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
      this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed && event.buttons) {
      // Calculate width of column
      let width = this.startWidth + (event.pageX - this.startX - offset);

      const tableCells = Array.from(
        this.table.querySelectorAll('.mat-row')
      ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index));

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${width}px`);

      // render for input sreach field
      const div = this.column.childNodes[0] as HTMLElement;
      div.style.width = `${width}px`;

      const chiled = div.childNodes[1] as HTMLElement;
      chiled.style.width = `${width}px`;

      let formSearch = this.column.childNodes[1] as HTMLElement;
      if (width > 30) formSearch.style.width = `${width}px`;

      // Set table cells width
      for (const cell of tableCells) {
        this.renderer.setStyle(cell, 'width', `${width}px`);
      }

      //triggres services
      this.tabIndex.emit(this.index);
      this.minWidth = width;
      this.isDbClicked = false;
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };

  @HostListener('dblclick', ['$event']) onLeave( e: MouseEvent ) {

    this.isDbClicked = !this.isDbClicked;
    if (this.isDbClicked == true) {
      const tableCells = Array.from(
        this.table.querySelectorAll('.mat-row')
      ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index));

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.maxWidth}px`);

      // render for input sreach field
      const div = this.column.childNodes[0] as HTMLElement;
      div.style.width = `${this.maxWidth}px`;

      (div.childNodes[1] as HTMLElement).style.width = `${this.maxWidth}px`;

      const f = this.column.childNodes[1] as HTMLElement;
      if (this.maxWidth > 30) f.style.width = `${this.maxWidth}px`;

      // Set table cells width
      for (const cell of tableCells)
        this.renderer.setStyle(cell, 'width', `${this.maxWidth}px`);

    } else {
      // render for input sreach field
      const tableCells = Array.from(
        this.table.querySelectorAll('.mat-row')
      ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index));

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.minWidth}px`);

      // render for input sreach field
      const div = this.column.childNodes[0] as HTMLElement;
      div.style.width = `${this.minWidth}px`;

      (div.childNodes[1] as HTMLElement).style.width = `${this.minWidth}px`;

      const f = this.column.childNodes[1] as HTMLElement;
      if (this.minWidth > 30) f.style.width = `${this.minWidth}px`;

      // Set table cells width
      for (const cell of tableCells)
        this.renderer.setStyle(cell, 'width', `${this.minWidth}px`);

    }
  }
}
