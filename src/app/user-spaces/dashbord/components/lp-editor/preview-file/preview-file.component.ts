import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class PreviewFileComponent implements OnInit {

  height = 150;
  y = 100;
  oldY = 0;
  grabber = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.grabber) {
      return;
    }
    this.resizer(event.clientY - this.oldY);
    this.oldY = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  resizer(offsetY: number) {
    if (offsetY > 0) {
      console.log('he', offsetY);
      this.height += offsetY;
    }
  }


  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.grabber = true;
    this.oldY = event.clientY;
  }

}
