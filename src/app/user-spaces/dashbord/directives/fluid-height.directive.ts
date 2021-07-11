import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";

@Directive({
  selector: '[appFluidHeight]'
})
export class FluidHeightDirective {
  @Input() minHeight: number;
  @Input("fluidHeight") topOffset: number;

  private domElement: HTMLElement;
  private pressed: boolean;
  private startY: number = 0;
  private startHeigth: number = 0;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.domElement = this.elementRef.nativeElement as HTMLElement;

    // register on window resize event
    fromEvent(window, "resize")
      .pipe(throttleTime(500), debounceTime(500))
      .subscribe(() => this.setHeight());
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  // @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent) {
  //   console.log('mouse enter');
  // }

  // @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent) {
  //   console.log('mouse leave');
  // }

  @HostListener('mousedown', ['$event'])
  mouseHandling(event) {
    event.preventDefault();
    this.pressed = true;
    // console.log(event.pageX, '//', event.pageY);
    this.startY = event.pageY;
    this.startHeigth = this.domElement.offsetHeight;

    // this.startX = event.pageX;
  }

  // onMouseMove = (event: MouseEvent) => {
  //   const offset = 35;
  //   if (this.pressed) {
  //     console.log('pressed');

  //   }
  // };

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.pressed) {
      // this.setHeight(event);
      // console.log();
      // console.log(event.screenY, ' - ', this.startY)
      const height = this.startHeigth + (event.screenY - this.startY)

      // console.log('heie', height)

      const dom = this.domElement.childNodes;
      this.renderer.setStyle(dom[0], "height", `${height}px`);
    }
  }


  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event) {
    if (this.pressed) {
      this.pressed = false;
    }
  }

  private setHeight() {
    // const windowHeight = window?.innerHeight;
    // const topOffset = this.topOffset || this.calcTopOffset();
    // let height = windowHeight - topOffset;

    // // set min height instead of the calculated
    // if (this.minHeight && height < this.minHeight) {
    //   height = this.minHeight;
    // }
    // const dom = this.domElement.childNodes;
    // const height = startHeigth + (event)

    // console.log('heie', height)
    // console.log(dom[0])

    // this.renderer.setStyle(dom[0], "height", `${height}px`);
  }

  private calcTopOffset(): number {
    try {
      const rect = this.domElement.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      return rect.top + scrollTop;
    } catch (e) {
      return 0;
    }
  }

}
