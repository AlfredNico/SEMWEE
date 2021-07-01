import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LpdLpdService } from '@app/shared/components/LPVi-LPEd/services/lpd-lpd.service';

@Component({
  selector: 'app-search-replace',
  templateUrl: './search-filter-replace.component.html',
  styleUrls: ['./search-filter-replace.component.scss'],
})
export class SearchReplaceComponent implements OnInit {
 
    @Input() nameColumn: string;
    @Input() datasourceFilter: any[] = [];
    @Output() sendData = new EventEmitter<string>();

    formSearch = new FormGroup({
        char_value: new FormControl(''),
        new_value: new FormControl(''),
      });

    constructor() {}
  ngOnInit() {}
  searchReplace(){
      const first_value = this.formSearch.value.char_value;
      const second_value  = this.formSearch.value.new_value;
      let newdataSourceFilter = [] ; 

      if(first_value !== '' && second_value !== ''){
        this.datasourceFilter.forEach(element => {
           const newElement = element[this.nameColumn].replace(first_value, second_value);
           element[this.nameColumn] = newElement
            newdataSourceFilter.push(element)
          });

        const name_dinamic = `Replace "${first_value}" to "${second_value}" on column "${this.nameColumn}".`;
        this.sendData.emit(name_dinamic);
      }else if(!first_value && !second_value){
        newdataSourceFilter = this.datasourceFilter;
      }
  }
}
