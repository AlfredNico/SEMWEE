import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from './services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private notifs: NotificationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      request.url.includes('user-space') &&
      this.cookieService.check('SEMEWEE') === false
    ) {
      this.notifs.warn('Session expiré');
      this.router.navigateByUrl('/sign-in');
    } else if (localStorage.getItem('currentUser') !== null) {
      const token = JSON.parse(localStorage.getItem('currentUser'))['token'];
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (this.cookieService.check('SEMEWEE') === true) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('SEMEWEE')}`,
        },
      });
    }
    // // default --> json
    // if (!request.headers.has('Content-Type')) {
    //   request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    // }

    return next.handle(request);
  }
}

export const tokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};
