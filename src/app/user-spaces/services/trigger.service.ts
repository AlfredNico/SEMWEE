import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  public trigrer$ = new BehaviorSubject<boolean>(false);
  public subject = new Subject<any>();
  public currentSubject = this.subject.asObservable();

  constructor() { }
}
