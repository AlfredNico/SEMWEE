import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TriggerService {
  public trigrer$ = new BehaviorSubject<boolean>(false);
  public switchUrl$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}
}
