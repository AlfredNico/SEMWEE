import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appStepperIcon]',
})
export class StepperIconDirective {
  @Input() index: number;
  @Output() stepperIndex = new EventEmitter<any>();
  constructor() {}

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent) {
    this.stepperIndex.emit(this.index);
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent) {
    this.stepperIndex.emit(undefined);
  }
}
