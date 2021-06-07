import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  @Input() eObject: any;
  @Input() nameCells: any;
  @Input() selected: string;
  @Input() vueedit: boolean;
  @Output() objectChange = new EventEmitter<any>();
  @Output() toggleChange = new EventEmitter<any[]>();

  valueObject: any;
  // valueText: string;

  constructor() {}

  // ngOnInit(): void {}
  // ngAfterViewInit(): void {
  //   console.log('Mea amor');
  //   console.log(this.cardMain);
  //   //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //   //Add 'implements AfterViewInit' to the class.
  // }
  ngOnChanges() {
    if (this.nameCells != undefined) {
      const regex3 =
        /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
      if (regex3.exec(this.eObject[1][this.nameCells])) {
        const regex2 = new RegExp('[-\\/ ]');
        const tab = this.eObject[1][this.nameCells].split(regex2);
        const tab1 = tab[2].toString().split('T');
        this.valueObject = moment(
          `${tab1[0]}-${tab[1]}-${tab[0]}`,
          'DD-MM-YYYY',
          true
        ).format('DD/MM/YYYY');

        // this.valueObject = this.eObject[1][this.nameCells];
      } else {
        this.valueObject = this.eObject[1][this.nameCells];
      }
    }
  }

  ConverterToString() {
    const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    if (regex3.exec(this.valueObject)) {
      // const date = this.valueObject._i;
      const regex2 = new RegExp('[-\\/ ]');
      const tab = this.valueObject.split(regex2);
      const tab1 = tab[2].toString().split('T');
      this.eObject[1][this.nameCells] = moment(
        `${tab1[0]}-${tab[1]}-${tab[0]}`,
        'DD-MM-YYYY',
        true
      ).format('DD/MM/YYYY');
    } else {
      this.eObject[1][this.nameCells] = this.valueObject.toString();
    }
    this.toggleEdit();
  }
  ConverterToNumber() {
    const parsed = parseInt(this.valueObject);
    if (isNaN(parsed)) {
      alert('not a valid number');
    } else {
      this.eObject[1][this.nameCells] = parsed;
      this.toggleEdit();
    }
  }
  ConverterToDate() {
    const reg =
      /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
    const reg1 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])$/;
    const regex3 =
      /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    let string_date = this.valueObject.trim();
    console.log(string_date);
    const regex2 = new RegExp('[-\\/ ]');
    if (reg1.exec(string_date)) {
      const tab = string_date.split(regex2);
      this.eObject[1][this.nameCells] = moment(
        `${tab[0]}-${tab[1]}-${tab[2]}`,
        'YYYY-MM-DD',
        true
      ).format();
      this.toggleEdit();
    } else if (reg.exec(string_date)) {
      const tab = string_date.split(regex2);
      this.eObject[1][this.nameCells] = moment(
        `${tab[0]}-${tab[1]}-${tab[2]}`,
        'DD-MM-YYYY',
        true
      ).format();
      this.toggleEdit();
      // .format('YYYY/MM/DD');
    } else if (regex3.exec(string_date)) {
      console.log("C'est un objet");
      const regex2 = new RegExp('[-\\/ ]');
      const tab = this.valueObject.split(regex2);
      const tab1 = tab[2].toString().split('T');
      this.eObject[1][this.nameCells] = moment(
        `${tab1[0]}-${tab[1]}-${tab[0]}`,
        'DD-MM-YYYY',
        true
      ).format('DD/MM/YYYY');
      this.toggleEdit();
    } else {
      alert('format date incorect');
    }
  }
  ConverterToBooleen() {
    if (this.valueObject != 'true' || !this.valueObject) {
      this.eObject[1][this.nameCells] = false;
    } else {
      this.eObject[1][this.nameCells] = true;
    }
    this.toggleEdit();
  }

  convertOne() {
    if (this.selected === 'string') {
      this.ConverterToString();
    } else if (this.selected === 'number') {
      this.ConverterToNumber();
    } else if (this.selected === 'boolean') {
      this.ConverterToBooleen();
    } else if (this.selected === 'object') {
      this.ConverterToDate();
    }
  }
  sendObject() {
    // this.vueedit = false;
    const tabvalue = [this.valueObject, this.selected];
    //, this.vueedit, btncancel];
    this.objectChange.emit(tabvalue);
    this.toggleEdit();
  }
  toggleEdit(btncancel = '') {
    this.vueedit = false;
    const tab = [this.vueedit, btncancel];
    this.toggleChange.emit(tab);
  }
}
