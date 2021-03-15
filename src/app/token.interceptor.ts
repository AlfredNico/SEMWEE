import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authentification/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from './services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private notifs: NotificationService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.cookieService.check('SEMEWEE') == true) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('SEMEWEE')}`
        }
      });
      // request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.cookieService.get('SEMEWEE')) });

    } else if (request.url.includes('user-space') && this.cookieService.check('SEMEWEE') === false) {
      this.notifs.warn('Session expiré');
      this.router.navigateByUrl('/sign-in');
    }

    // // default --> json
    // if (!request.headers.has('Content-Type')) {
    //   request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    // }

    return next.handle(request);
  }
}
