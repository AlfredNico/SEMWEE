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
    
    return next.handle(request).pipe(catchError(err => {
      const error = err.error.error || err.statusText;

      console.log('err ', err);
      console.log('error', error);
      
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          // this.authService.logout();
          // location.reload(true);
          this.notifs.warn(error);
          // window.location.reload();
          return EMPTY;
        }
      // } else if (this.cookieService.check('SEMEWEE') == false) {
      //   this.notifs.warn('Session expired');
      //   this.router.navigateByUrl('/sign-in')
      } else if (error) {
        this.notifs.warn(error);
        return EMPTY;
        // return throwError(error);
      }
      return throwError(error);
    }))
  }

  constructor(private authService: AuthService, private router: Router,
    private notifs: NotificationService, private cookieService: CookieService) { }

}
