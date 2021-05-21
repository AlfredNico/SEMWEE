import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-lp-editor',
  templateUrl: './lp-editor.component.html',
  styleUrls: ['./lp-editor.component.scss'],
})
export class LpEditorComponent implements OnInit, AfterViewInit {

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  public dataAfterUploaded: any | undefined;


  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() { }

  public nextReadFile(value: any) {
    this.dataAfterUploaded = value;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }
}
