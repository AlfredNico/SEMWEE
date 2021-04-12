import { style } from '@angular/animations';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resizeColumn]',
})
export class ResizableDirective {
  @Input('resizeColumn') resizable: boolean;
  @Input() index: number;
  @Output() tabIndex = new EventEmitter<any>();

  @Input() minWidth: number;
  @Input() maxWidth: number;

  private startX: number;

  private startWidth: number;

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

      // console.log(this.renderer.parentNode(row));

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

      // console.log(this.column.childNodes[0]);

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${width}px`);

      // render for input sreach field
      let div = this.column.childNodes[0] as HTMLElement;
      div.style.width = `${width}px`;

      let chiled = div.childNodes[1] as HTMLElement;
      chiled.style.width = `${width}px`;

      let formSearch = this.column.childNodes[1] as HTMLElement;
      if (width > 30) formSearch.style.width = `${width}px`;

      // Set table cells width
      for (const cell of tableCells) {
        console.log('xx');
        this.renderer.setStyle(cell, 'width', `${width}px`);
      }

      //triggres services
      this.tabIndex.emit(this.index);
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };

  @HostListener('dblclick', ['$event']) onLeave( e: MouseEvent ) {
    console.log('min: ', this.minWidth, '  max: ', this.maxWidth);
  }
}
