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
        // You should first log in !
        console.log('err ', err);

        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log('error', error);
            if (error == 'You should first log in') {
              this.authService.logout();
            }
            // auto logout if 401 response returned from api
            // location.reload(true);
            this.notifs.warn(error);
            // window.location.reload();
            this.router.navigateByUrl('/sign-in');
            return EMPTY;
          } else if (err.status === 0) {
            this.common.hideSpinner('root');
            this.notifs.warn('Server not responding !');
            // this.authService.logout();
          } else {
            console.log('err ', err);
          }
          // } else if (this.cookieService.check('SEMEWEE') == false) {
          //   this.notifs.warn('Session expired');
        } else if (error) {
          this.notifs.warn(error);
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
