import { InformationSheetButtomComponent } from './../components/information-sheet-buttom/information-sheet-buttom.component';
import { NotificationService } from '@app/services/notification.service';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { startWith, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  count: number = 0;
  intervalCount = interval(1000);
  private onDestroy$ = new Subject<number>();
  isLoading = true;
  public subscription$: Subscription = new Subscription();
  // private readonly spinnerOptions: Spinner = {
  //   type: 'ball-spin-clockwise',
  //   size: 'medium',
  //   bdColor: 'rgba(131,128,128,0.8)',
  //   color: 'white',
  //   fullScreen: true,
  // };

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly notifs: NotificationService,
    private _bottomSheet: MatBottomSheet
  ) {}

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
    this.isLoading = true;
    return this.spinner
      .getSpinner(name)
      .pipe(
        tap((spinner) => {
          if (spinner) {
            this.isLoading$.subscribe((res) => {
              if (res == true) {
                this.subscription$ = this.intervalCount
                  .pipe(
                    takeUntil(this.onDestroy$),
                    // takeWhile(() => res),
                    tap((x) => this.checkAlerts(x, res))
                  )
                  .subscribe();
              } else {
                this.onDestroy$.next();
                this.onDestroy$.complete();
                this.notifs.dismiss();
                this.subscription$.unsubscribe();
              }
            });
            if (spinner.show === true) {
              this.isLoading = false;
              this.spinner.hide(name);
            }
          }
        }),
        take(1)
        // takeWhile(() => this.isLoading)
      )
      .subscribe();
  }

  public getSpinner(name: string) {
    return this.spinner.getSpinner(name);
  }

  private checkAlerts(response: number, isRes: boolean): void {
    if (response === 10 && isRes) {
      // this.notifs.infoIterropt('You can interrupt this processing with Esc');
      this._bottomSheet.open(InformationSheetButtomComponent);
    }
  }
}
