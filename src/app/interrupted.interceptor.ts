import { CommonService } from '@app/shared/services/common.service';
import { NotificationService } from './services/notification.service';
import { switchMap, tap, finalize, map, take, delay, takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { EMPTY, interval, NEVER, Observable, Subscription } from 'rxjs';
import { ActivationEnd, Router } from '@angular/router';
import { HttpCancelService } from './shared/services/http-cancel.service';

@Injectable()
export class InterruptedInterceptor implements HttpInterceptor {
  constructor(
    private httpCancelService: HttpCancelService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()))
  }
}

export const interruptedInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterruptedInterceptor,
  multi: true,
};
