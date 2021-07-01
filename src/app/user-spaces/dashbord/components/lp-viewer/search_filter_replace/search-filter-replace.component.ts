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
    @Output('removeFromItem') removeFromItem: any = new EventEmitter();

    formSearch = new FormGroup({
        char_value: new FormControl(''),
        new_value: new FormControl(''),
      });

    constructor() {}
  ngOnInit() {}
  searchReplace(){
      const first_value = this.formSearch.value.char_value;
      const second_value  = this.formSearch.value.new_value;
      let found = false;

      if(first_value !== '' && second_value !== ''){
        for (let i = 0; i < this.datasourceFilter.length; i++) {
            if(typeof(this.datasourceFilter[i][this.nameColumn]) === "string" && this.datasourceFilter[i][this.nameColumn].includes(first_value)){
              const newElement = this.datasourceFilter[i][this.nameColumn].replaceAll(first_value, second_value);
              this.datasourceFilter[i][this.nameColumn] = newElement;
              found = true
            }
        }
            if(found){
                const name_dinamic = `Replace "${first_value}" to "${second_value}" on column "${this.nameColumn}".`;
                this.sendData.emit(name_dinamic);
            }else{
                alert(`${ first_value } on type text not found in colomn ${this.nameColumn}`);
            }
      }else if(!first_value && !second_value){
      }

  }

  
}
