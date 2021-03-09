import { Injectable } from '@angular/core';
import * as fakeData from 'src/app/shared/fake-data/fakeData.json';

@Injectable({
  providedIn: 'root'
})
export class ConvertUploadFileService {

  public defaultData = fakeData as any;
  private columns: string[] = [];
  private data: any[] = [];

  constructor() { 
    console.log('data' + this.defaultData['default']);
  }

  private mapingData(data: any[]){
    data.map((value, index) => {
      console.log(value), index;
    })
  }
}
