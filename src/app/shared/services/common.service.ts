import { InformationSheetButtomComponent } from './../components/information-sheet-buttom/information-sheet-buttom.component';
import { NotificationService } from '@app/services/notification.service';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { startWith, take, takeUntil, takeWhile, tap, timeInterval } from 'rxjs/operators';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  count: number = 0;
  private timer: any;
  intervalCount = interval(1000);
  private onDestroy$ = new Subject<number>();
  isLoading = false;
  public isEcs$ = new BehaviorSubject<boolean>(false);

  public subscription$: Subscription = new Subscription();
  // private readonly spinnerOptions: Spinner = {
  //   type: 'ball-spin-clockwise',
  //   size: 'medium',
  //   bdColor: 'rgba(131,128,128,0.8)',
  //   color: 'white',
  //   fullScreen: true,
  // };

  readonly config: MatBottomSheetConfig = {
    hasBackdrop: false,
    disableClose: false,
    panelClass: 'bottom-sheet-container',
    direction: 'ltr'
  };

  constructor(
    private readonly spinner: NgxSpinnerService,
    private _bottomSheet: MatBottomSheet,
    private coockie: CookieService
  ) { }

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
      zIndex: 999,
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
            this.isLoading$.subscribe((res) => {
              if (res === true) {
                this.isLoading = true;
                this.subscription$ = this.intervalCount
                  .pipe(
                    takeUntil(this.onDestroy$))
                  .subscribe((x) => {
                    if (x === 10) {
                      this.subscription$.unsubscribe();
                      this.onDestroy$.next();
                      this.onDestroy$.complete();
                      this.checkAlerts(x, res)
                    }
                  });
              } else {
                this.subscription$.unsubscribe();
                this.onDestroy$.next();
                this.onDestroy$.complete();
              }
            });
            if (spinner.show === true) {
              // this._bottomSheet.dismiss();
              this.onDestroy$.next();
              this.onDestroy$.complete();
              this.subscription$.unsubscribe();
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

  private checkAlerts(response: number, isRes: boolean): void {
    if (response === 10 && this.isLoading === true && !this.coockie.check('info')) {
      this.subscription$.unsubscribe();
      this._bottomSheet.open(InformationSheetButtomComponent, this.config);
    }
  }
}
