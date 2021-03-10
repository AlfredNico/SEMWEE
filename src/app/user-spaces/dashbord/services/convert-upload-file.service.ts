import { Injectable } from '@angular/core';
import * as Users from 'src/app/shared/fake-data/users.json';

@Injectable({
  providedIn: 'root'
})
export class ConvertUploadFileService {

  public defaultData = Users as any;
  private displayColumns: string[] = ['select'];
  private hideColumns: string[] = [];
  private data: any[] = [];

  public dataView: { columns: string[], data: [] } = { columns: [], data: [] };

  constructor() { 
    this.mapingData(this.defaultData['default']);

    this.dataView = {
      columns: this.hideColumns,
      data: this.defaultData['default']
    }
  }

  private mapingData(data: any[]){
    data.map((value: any) => {
      Object.keys(value).map((key: string, index: number) => {
        // console.log(key, index);
        if (!this.displayColumns.includes(key)) {
          this.displayColumns.push(key)
        }
      })
    })
  }
}
