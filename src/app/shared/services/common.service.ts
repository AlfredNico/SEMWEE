import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  count: number = 0;
  // private readonly spinnerOptions: Spinner = {
  //   type: 'ball-spin-clockwise',
  //   size: 'medium',
  //   bdColor: 'rgba(131,128,128,0.8)',
  //   color: 'white',
  //   fullScreen: true,
  // };

  constructor(private spinner: NgxSpinnerService) {}

  // public hideSpinner(name = 'root') {
  //   return this.spinner.hide(name);
  // }

  public showSpinner(name = 'root', fullScreen = true, template?: any) {
    const options: Spinner = {
      type: 'ball-spin-clockwise',
      size: 'medium',
      bdColor: 'rgba(131,128,128,0.8)',
      color: 'white',
      fullScreen,
    };
    if (template) {
      delete options.type;
      // options.template = template;
    }
    return this.spinner.show(name, options);
  }

  public hideSpinner(name = 'root') {
    return this.spinner
      .getSpinner(name)
      .pipe(
        tap((spinner) => {
          if (spinner) {
            if (spinner.show === true) {
              this.spinner.hide(name);
            }
          }
        }),
        take(1)
      )
      .subscribe();
  }

  public getSpinner(name: string) {
    return this.spinner.getSpinner(name);
  }
}
