import { BottonSheetComponent } from './shared/components/botton-sheet/botton-sheet.component';
import { IdbService } from './services/idb.service';
import { InterruptedService } from './shared/services/interrupted.service';
import { Component, HostListener, OnDestroy } from '@angular/core';
import {
  ActivationEnd,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { CommonService } from './shared/services/common.service';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpCancelService } from './shared/services/http-cancel.service';

@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner name="root">
      <p [style.color]="'white'">Loading ...</p>
    </ngx-spinner>
    <ngx-spinner name="table" [template]="payTemplate"></ngx-spinner>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      ::ng-deep.spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppComponent implements OnDestroy {
  title = 'SEMWEE';
  public readonly payTemplate = `
    <div class="bg-white row justify-content-md-center" style="border-radius: 20px; padding: 50px">
      <img src="assets/images/gif/loading.gif" width="50"/>
      <h1 class="px-4 my-auto">Please wait ...</h1>
    </div>
  `;

  readonly config: MatBottomSheetConfig = {
    hasBackdrop: false,
    disableClose: false,
    panelClass: 'bottom-sheet-container',
    direction: 'ltr'
  };

  routerLoaderTimout: any;
  public unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


  constructor(
    private router: Router,
    private common: CommonService,
    private readonly idb: IdbService,
    private _bottomSheet: MatBottomSheet,
  ) {
    // this.interrupted.isInterrompted.next(false);
    this.idb.connectToIDB();
    this.common.isLoading$.subscribe(res => {
      if (res === false) {
        // this.common.showSpinner('root')
        this.common.hideSpinner('root');
        this.common.hideSpinner('table');
      }
      // else {
      // }
    })

    this.common.loader$ = this.common.loaderSubject;
    // page progress bar percentage
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.common.loaderSubject.next(10);
      }
      if (event instanceof RouteConfigLoadStart) {
        this.common.loaderSubject.next(65);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.common.loaderSubject.next(90);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // set page progress bar loading to end on NavigationEnd event router
        this.common.loaderSubject.next(100);
        if (this.routerLoaderTimout) {
          clearTimeout(this.routerLoaderTimout);
        }
        this.routerLoaderTimout = setTimeout(() => {
          this.common.loaderSubject.next(0);
        }, 300);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    if (this.routerLoaderTimout) {
      clearTimeout(this.routerLoaderTimout);
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 27) {
      this._bottomSheet.open(BottonSheetComponent, this.config);
    }
  }
}
