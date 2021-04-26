import { CommonService } from '@app/shared/services/common.service';
import { NotificationService } from './services/notification.service';
import { switchMap, tap, finalize, map, take, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { EMPTY, interval, NEVER, Observable, Subscription } from 'rxjs';
import { InterruptedService } from './shared/services/interrupted.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class InterruptedInterceptor implements HttpInterceptor {
  private count: number = 0;
  source = interval(1000);
  subscribe: Subscription;
  timer: any;
  pendingRequestsCount = 0;
  isLoading = false;
  constructor(
    private interrupted: InterruptedService,
    private notifs: NotificationService,
    private comoon: CommonService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.count = 0;
    // setInterval(() => {
    //   this.count++;
    // }, 1000).pip
    this.pendingRequestsCount++;
    return next.handle(request).pipe(
      tap(() => {
        // console.log(this.count);
        // if (this.count > 10) {
        //   this.notifs.info('You can interrupt this processing with Esc');
        // }
      }),
      finalize(() => {
        this.pendingRequestsCount--;
        // if (this.count < 10) {
        //   this.notifs.dismiss();
        // }
        this.comoon.hideSpinner('root');
      })
    );
  }
}

export const interruptedInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterruptedInterceptor,
  multi: true,
};
