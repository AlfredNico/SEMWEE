import { Options } from '@angular-slider/ngx-slider';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class PreviewFileComponent implements OnInit, AfterViewInit {

  minValue: number = 20;
  maxValue: number = 80;
  options: Options = {
    floor: 0,
    ceil: 100,
    // minRange: this.maxValue,
    // maxRange: this.minValue,
    // minLimit: this.minValue,
    // maxLimit: this.maxValue,
    draggableRange: true,
    showSelectionBar: true,
  };

  userChangeEnd(event: any) {
    console.log('va=', event);
  }

  x: number;
  // y: number;
  px: number;
  py: number;
  width: number;
  // height: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: Function;

  // parentDiv: ElementRef;
  minLeft: number;
  maxLeft: number;

  @ViewChild('parentDiv') parentDiv: ElementRef;

  constructor() {
    // this.x = 0;
    // this.y = 100;
    this.px = 0;
    this.py = 0;
    this.width = 600;
    // this.height = 300;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 1000;
    // this.minArea = 20000
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.x = this.minLeft = this.parentDiv.nativeElement.offsetLeft;
    this.maxLeft = this.parentDiv.nativeElement.offsetWidth;
  }

  area() {
    // return this.width * this.height;
    return this.width * 350;
  }

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }
    let offsetX = event.clientX - this.px;
    // console.log('OK', (this.x + offsetX + this.width - this.minLeft), '//', this.maxLeft);
    if ((this.x + offsetX) > this.minLeft && this.maxLeft > (this.x + offsetX + this.width - this.minLeft)) {
      // let offsetY = event.clientY - this.py;
      this.x += offsetX;
      // this.y += offsetY;
      // this.py = event.clientY;
      this.px = event.clientX;
    }

    // if () {
    // }
  }

  topLeftResize(offsetX: number, offsetY: number) {
    if (this.minLeft < (this.x + offsetX)) {
      this.x += offsetX;
      // this.y += offsetY;
      // this.height -= offsetY;
      this.width -= offsetX;
    }
  }

  topRightResize(offsetX: number, offsetY: number) {
    const xxx = this.maxLeft - this.minLeft;
    const l = this.maxLeft - ((this.x + this.width + offsetX) - this.minLeft);
    if (l > 0) {
      // this.y += offsetY;
      this.width += offsetX;
      // this.height -= offsetY;
    }
  }
  // bottomLeftResize(offsetX: number, offsetY: number) {
  //   this.x += offsetX;
  //   this.width -= offsetX;
  //   // this.height += offsetY;
  // }

  // bottomRightResize(offsetX: number, offsetY: number) {
  //   this.width += offsetX;
  //   // this.height += offsetY;
  // }

  onCornerClick(event: MouseEvent, resizer?: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;

    let lastX = this.x;
    // let lastY = this.y;
    let pWidth = this.width;
    // let pHeight = this.height;

    this.resizer(offsetX, offsetY);
    if (this.area() < this.minArea) {
      this.x = lastX;
      // this.y = lastY;
      this.width = pWidth;
      // this.height = pHeight;
    }
    this.px = event.clientX;
    this.py = event.clientY;
    // console.log('py', this.py, 'px', this.px);
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }

  // height = 150;
  // y = 100;
  // oldY = 0;
  // grabber = false;

  // constructor() { }

  // ngOnInit(): void {
  // }

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   if (!this.grabber) {
  //     return;
  //   }
  //   this.resizer(event.clientY - this.oldY);
  //   this.oldY = event.clientY;
  // }

  // @HostListener('document:mouseup', ['$event'])
  // onMouseUp(event: MouseEvent) {
  //   this.grabber = false;
  // }

  // resizer(offsetY: number) {
  //   if (offsetY > 0) {
  //     console.log('he', offsetY);
  //     this.height += offsetY;
  //   }
  // }


  // @HostListener('document:mousedown', ['$event'])
  // onMouseDown(event: MouseEvent) {
  //   this.grabber = true;
  //   this.oldY = event.clientY;
  // }

}
