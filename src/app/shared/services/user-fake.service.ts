import { Injectable } from '@angular/core';
import { SettingRowsTable } from '@app/models/setting-table';
import * as Users from 'src/app/shared/fake-data/users.json';


@Injectable({
  providedIn: 'root'
})
export class UserFakeService {

  private countryList = this.changeDate(Users);
  public views: { columnes: SettingRowsTable, data: any[] } = {
    data: [],
    columnes: {
      hiddenRows: [],
      noHiddenRows: [],
    }
  };
  private difference: string[] = [];


  constructor() {
    this.countryList['default'].forEach((element: string[]) => {
      for (let index = 0; index < Object.keys(element).length; index++) {
        if (!this.difference.includes(Object.keys(element)[index])) {
          this.difference.push(Object.keys(element)[index])
        }
      }
      this.views.data = this.countryList['default'];
      this.views.columnes.noHiddenRows = this.difference;
    });
  }

  public changeDate(data: any[]) {
    console.log(data);
    
    return data as any;
  }
}
