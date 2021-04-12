import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDbClickresizable]'
})
export class DbClickresizableDirective implements OnInit {
  // @Input('appDbClickresizable') resizable: boolean;
  @Input() minWidth: number;
  @Input() maxWidth: number;
  @Input() indexCell: number;


  private width: any[] = [];

  private startWidth: number;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;



  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }



  ngOnInit(): void {
    console.log(this.indexCell)
  }

  @HostListener('dblclick', ['$event']) onLeave( e: MouseEvent ) {
  }

  // @HostListener('mouseenter', ['$event']) onEnter( e: MouseEvent ) {
  //   console.log('OKE')
  // }

}
