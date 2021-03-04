import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './authentification/services/auth.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './services/notification.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('request', request.url);

    return next.handle(request).pipe(catchError(err => {
      const error = err.error.message || err.statusText;

      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 && !this.cookieService.check('SEMEWEE')) {
          // auto logout if 401 response returned from api
          // this.authService.logout();
          // location.reload(true);
          this.notifs.warn(error);
          console.log('error', error);
          window.location.reload();
          return EMPTY;
        }
        else if (err.status === 401 && this.cookieService.check('SEMEWEE')) {
          this.notifs.warn('Session expiré');
          this.router.navigateByUrl('/sign-in')
        }
      } else {
        this.notifs.warn(error);
        return throwError(error);
      }
      return throwError(error);

    }))
  }

  constructor(private authService: AuthService, private router: Router,
    private notifs: NotificationService, private cookieService: CookieService) { }

}
