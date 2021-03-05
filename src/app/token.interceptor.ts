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

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private cookieService: CookieService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.cookieService.check('SEMEWEE')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('SEMEWEE')}`
        }
      });
    }
    return next.handle(request);
  }
}
