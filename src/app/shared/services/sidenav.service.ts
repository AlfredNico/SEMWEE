import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  public sideNavState$: Subject<boolean> = new Subject();
  
  constructor() { }
}
