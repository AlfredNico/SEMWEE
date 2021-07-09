import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterruptedService {
  public isInterrompted = new BehaviorSubject<boolean>(false);
  public isInterromptedValue = this.isInterrompted.asObservable();

  constructor() {}
}
