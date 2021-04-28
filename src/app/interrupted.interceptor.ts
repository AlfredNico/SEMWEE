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
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request);
  }
}

export const interruptedInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterruptedInterceptor,
  multi: true,
};
