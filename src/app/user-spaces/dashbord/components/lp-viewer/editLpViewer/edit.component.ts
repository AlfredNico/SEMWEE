import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @Input() oneObject: any;
  @Input() nameCells: any;
  @Input() selected: string;
  @Input() vueedit: boolean;
  @Output() objectChange = new EventEmitter<number>();
  @Output() toggleChange = new EventEmitter<boolean>();

  valueObject: any;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges() {
    // console.log(this.nameCells);
    // console.log(this.oneObject);
    if (this.nameCells != undefined) {
      // console.log(this.oneObject[this.nameCells]);
      this.valueObject = this.oneObject[this.nameCells];
    }
  }
  // detect
  sendObject() {
    // this.objectChange.emit(this.oneObject);
  }
  toggleEdit() {
    this.vueedit = false;
    console.log(this.vueedit);
    this.toggleChange.emit(this.vueedit);
  }
}
