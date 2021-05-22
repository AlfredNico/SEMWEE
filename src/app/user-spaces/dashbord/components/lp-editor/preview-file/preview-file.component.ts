import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class PreviewFileComponent implements OnInit {
  x: number;
  y: number;
  px: number;
  py: number;
  width: number;
  height: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: Function;

  constructor() {
    this.x = 300;
    this.y = 100;
    this.px = 0;
    this.py = 0;
    this.width = 600;
    this.height = 300;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 20000
  }

  ngOnInit() {
  }

  area() {
    return this.width * this.height;
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
    let offsetY = event.clientY - this.py;

    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  topLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.y += offsetY;
    this.width -= offsetX;
    // this.height -= offsetY;
  }

  topRightResize(offsetX: number, offsetY: number) {
    this.y += offsetY;
    this.width += offsetX;
    // this.height -= offsetY;
  }

  bottomLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.width -= offsetX;
    // this.height += offsetY;
  }

  bottomRightResize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    // this.height += offsetY;
  }

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
    let lastY = this.y;
    let pWidth = this.width;
    let pHeight = this.height;

    this.resizer(offsetX, offsetY);
    if (this.area() < this.minArea) {
      this.x = lastX;
      this.y = lastY;
      this.width = pWidth;
      this.height = pHeight;
    }
    this.px = event.clientX;
    this.py = event.clientY;
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
