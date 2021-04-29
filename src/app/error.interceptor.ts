import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthService } from './authentification/services/auth.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './services/notification.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CommonService } from './shared/services/common.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const error = err.error.error || err.statusText;
        console.log('err ', err);

        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log('error', error);
            if (error.includes('You should first log in!')) {
              this.authService.logout();
            }
            this.notifs.warn(error);
            // window.location.reload();
          }else if (err.status === 0) {
            this.notifs.warn('Server not responding !');
          } else {
            this.notifs.warn(error);
          }
          this.common.hideSpinner('root');
          return EMPTY;
        } else if (error) {
          this.notifs.warn(error);
          this.common.hideSpinner('root');
          return EMPTY;
          // return throwError(error);
        }
        return throwError(error);
      })
    );
  }

  constructor(
    private common: CommonService,
    private authService: AuthService,
    private router: Router,
    private notifs: NotificationService
  ) {}
}

export const errorInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
