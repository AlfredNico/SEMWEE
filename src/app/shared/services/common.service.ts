import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly spinnerOptions: Spinner = {
    type: 'ball-spin-clockwise',
    size: 'medium',
    bdColor: 'rgba(131,128,128,0.8)',
    color: 'white',
    fullScreen: true,
  }

  constructor(private spinner: NgxSpinnerService) { }

  public showSpinner(name = 'root') {
    return this.spinner.show(name, this.spinnerOptions);
  }

  public hideSpinner(name = 'root') {
    return this.spinner.hide(name);
  }
}
