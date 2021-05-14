import { InformationSheetButtomComponent } from './../components/information-sheet-buttom/information-sheet-buttom.component';
import { NotificationService } from '@app/services/notification.service';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, take, takeUntil, takeWhile, tap, timeInterval } from 'rxjs/operators';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { CookieService } from 'ngx-cookie-service';
import { Users } from '@app/models/users';
import { AuthService } from '@app/authentification/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public user: Users;
  count: number = 0;
  private timer: any;
  intervalCount = interval(1000);
  private onDestroy$ = new Subject<number>();
  isLoading = false;
  // public isEcs$ = new BehaviorSubject<boolean>(false);

  public subscription$: Subscription = new Subscription();
  public loaderSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public loader$: Observable<number>;


  readonly config: MatBottomSheetConfig = {
    hasBackdrop: false,
    disableClose: false,
    panelClass: 'bottom-sheet-container',
    direction: 'ltr'
  };

  constructor(
    private userService: AuthService,
    private readonly spinner: NgxSpinnerService,
    private _bottomSheet: MatBottomSheet,
    private coockie: CookieService
  ) {
    this.userService.currentUserSubject
      .pipe(
        map((user: Users) => {
          if (user) {
            this.user = user;
          }
        })
      )
      .subscribe();
  }

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
                    take(11),
                    startWith(0),
                    takeUntil(this.onDestroy$))
                  .subscribe((x) => {
                    if (x === 10) {
                      this.subscription$.unsubscribe();
                      this.onDestroy$.next();
                      this.onDestroy$.complete();
                      //if users.understand == undefined/null/empty  || users.understand = 0
                      console.log("und=" + this.user.understand);
                      if (this.user.understand != 1) {
                        //console.log("understand1=" + this.user.understand);
                        this.checkAlerts(x, res);
                      }
                    }
                  });
              } else {
                this.isLoading = false;
                this.subscription$.unsubscribe();
                this.onDestroy$.next();
                this.onDestroy$.complete();
                // this.intervalCount = interval(1000);
                this._bottomSheet.dismiss();
              }
            });
            if (spinner.show === true) {
              this._bottomSheet.dismiss();
              this.isLoading = false;
              // this.intervalCount = interval(1000);
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
    if (response === 10 && this.isLoading === true) {
      this.intervalCount = interval(1000);
      this.subscription$.unsubscribe();
      this.isLoading = false;
      this._bottomSheet.open(InformationSheetButtomComponent, this.config);
    }
  }
}
