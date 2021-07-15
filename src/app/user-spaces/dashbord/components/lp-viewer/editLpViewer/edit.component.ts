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
  @Input() tab_arraw: boolean[] = [];
  @Output() objectChange = new EventEmitter<any>();
  @Output() toggleChange = new EventEmitter<any[]>();

  valueObject: any;
  arrow_left: any;
  arrow_right: any;

  constructor() { }

  ngOnChanges() {
    this.arrow_left = this.tab_arraw[0]
    this.arrow_right = this.tab_arraw[1]
    if (this.nameCells != undefined) {
      const regex3 =
        /^\d{4}[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
      if (regex3.exec(this.eObject[1][this.nameCells])) {
        const regex2 = new RegExp('[-\\/ ]');
        const tab = this.eObject[1][this.nameCells].split(regex2);
        const tab1 = tab[2].toString().split('T');
  console.log(tab1)
        this.valueObject = moment(
          `${tab[0]}-${tab[1]}-${tab1[0]}`,
          'YYYY-MM-DD',
          true
        ).format('YYYY-MM-DD');

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
      const regex2 = new RegExp('[-]');
      const tab = this.valueObject.split(regex2);
      const tab1 = tab[2].toString().split('T');
    
      this.eObject[1][this.nameCells] = moment(
          `${tab[0]}-${tab[1]}-${tab1[0]}`,
          'YYYY-MM-DD',
          true
        ).format('YYYY-MM-DD');
    } else {
      this.eObject[1][this.nameCells] = this.valueObject.toString();
    }
    this.toggleEdit();
  }
  
 filterInt(value) {
    if (/^[0-9]+[\.,]?[0-9]*$/.test(value)) {
      return true
    } else {
      return false
    }
  }
  ConverterToNumber() {
    
    console.log(typeof(this.valueObject))
    if(typeof(this.valueObject) === "string" ){
       if( !this.filterInt(this.valueObject.trim()) ){
        alert("Not a valid number !")
      }else{
        const replace = typeof (this.valueObject) === "string" ? this.valueObject.replace(',', '.') : this.valueObject;
        const parsed = parseFloat(replace);
        this.eObject[1][this.nameCells] = parsed;
        this.toggleEdit();
      }
    }else if(typeof(this.valueObject) ===  "object"){
        alert("Not a valid number !")
    }else{
      this.toggleEdit();
    }
   
  }
  ConverterToDate() {
    const reg =
      /^([0-2][0-9]|(3)[0-1])[-\\/ ](((0)[0-9])|((1)[0-2]))[-\\/ ]\d{4}$/;
    const reg1 =
      /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])$/;
    const regex3 =
      /^\d{4}[-](((0)[0-9])|((1)[0-2]))[-]([0-2][0-9]|(3)[0-1])[T]\d{2}:\d{2}:\d{2}[-\+]\d{2}:\d{2}$/;
    let string_date = typeof(this.valueObject) === "string"? this.valueObject.trim() : this.valueObject;
   
    const regex2 = new RegExp('[-]');
    // yyyy-mm-dd
    if (reg1.exec(string_date)) {
      const tab = string_date.split(regex2);
      this.eObject[1][this.nameCells] = moment(
        `${tab[0]}-${tab[1]}-${tab[2]}`,
        'YYYY-MM-DD',
        true
      ).format();
      this.toggleEdit();
    } 
    //dd-mm-yyyy
    else if (reg.exec(string_date)) {
      alert("Make the date in iso format")
     
    } // .format('YYYY/MM/DD'); 
    else if (regex3.exec(string_date)) {
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
    const tabvalue = [this.valueObject, this.selected];
    this.objectChange.emit(tabvalue);
    this.toggleEdit();
  }
  toggleEdit(btncancel = '') {
    this.vueedit = false;
    const tab = [this.vueedit, btncancel];
    this.toggleChange.emit(tab);
  }
}
