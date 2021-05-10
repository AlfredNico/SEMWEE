import {
  AfterViewInit,
  Directive,
  ElementRef,
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

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.domElement = this.elementRef.nativeElement as HTMLElement;

    console.log('loges');

    // register on window resize event
    fromEvent(window, "resize")
      .pipe(throttleTime(500), debounceTime(500))
      .subscribe(() => this.setHeight());
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  onMouseDown = (event: MouseEvent) => {
    console.log('pressed');
    this.pressed = true;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed) {
      console.log('pressed');

    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
    }
  };

  private setHeight() {
    const windowHeight = window?.innerHeight;
    const topOffset = this.topOffset || this.calcTopOffset();
    let height = windowHeight - topOffset;

    // set min height instead of the calculated
    if (this.minHeight && height < this.minHeight) {
      height = this.minHeight;
    }

    this.renderer.setStyle(this.domElement, "height", `${height}px`);
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
