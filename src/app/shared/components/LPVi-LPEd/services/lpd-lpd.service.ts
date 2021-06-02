import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LpdLpdService {

  /* Emittter value from clicked USER */
  public itemsObservables$ = new BehaviorSubject<any>(undefined);
  /* Emittter value dataSources after filter USER */
  public dataSources$ = new BehaviorSubject<any>(undefined);

  constructor() { }
}
