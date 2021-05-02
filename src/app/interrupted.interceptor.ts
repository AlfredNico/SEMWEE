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

@Injectable()
export class InterruptedInterceptor implements HttpInterceptor {
  private count: number = 0;
  source = interval(1000);
  subscribe: Subscription;
  timer: any;
  pendingRequestsCount = 0;
  isLoading = false;
  constructor(private common: CommonService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      finalize(() => {
        this.common.isEcs$.pipe(
          switchMap((res: boolean) => {
            if (res === true) {
              console.log('ok')
              this.common.isEcs$.next(false);
              return EMPTY;
            }
          })
        )
      })
    )
  }
}

export const interruptedInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterruptedInterceptor,
  multi: true,
};
