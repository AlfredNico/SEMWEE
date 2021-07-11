import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTuniIt]'
})
export class TuniItDirective implements OnInit {

  private element: HTMLElement;
   @Input('appTuniIt') isElement: boolean;


  constructor(private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {
    // this.element.style.display = "none";
  }

  @HostListener('mouseenter', ['$event']) onEnter( e: MouseEvent ) {
    // this.element.style.display = "none";
    this.element.childNodes.forEach(elem => {
      const button = elem.childNodes[1] as HTMLElement;
      if (this.isElement == true) {
        button.style.display = "flex";
      }
    });
  }

  @HostListener('mouseleave', ['$event']) onLeave( e: MouseEvent ) {
     // this.element.style.display = "none";
    this.element.childNodes.forEach(elem => {
      const button = elem.childNodes[1] as HTMLElement;
      if (this.isElement == true) {
        button.style.display = "none";
      }
    });
  }
}
