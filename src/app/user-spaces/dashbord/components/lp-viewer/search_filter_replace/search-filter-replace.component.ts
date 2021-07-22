import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-search-replace',
  templateUrl: './search-filter-replace.component.html',
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

  constructor(private readonly nofits: NotificationService) { }
  ngOnInit() { }
  searchReplace() {
    const first_value = this.formSearch.value.char_value;
    let second_value = this.formSearch.value.new_value;
    let found = false;

    if (first_value !== '') {
      for (let i = 0; i < this.datasourceFilter.length; i++) {
        if (
          typeof this.datasourceFilter[i][this.nameColumn] === 'string' &&
          this.datasourceFilter[i][this.nameColumn].includes(first_value)
        ) {
          const newElement = this.datasourceFilter[i][
            this.nameColumn
          ].replaceAll(first_value, second_value);
          this.datasourceFilter[i][this.nameColumn] = newElement;
          found = true;
        }
      }
      if (found) {
        second_value = second_value === "" ? "empty" : second_value;
        const name_dinamic = `Replace "${first_value}" to "${second_value}" on column "${this.nameColumn}".`;
        this.sendData.emit(name_dinamic);
      } else
        this.nofits.info(`${first_value} on type text not found in colomn ${this.nameColumn}`);
    }
  }
}
