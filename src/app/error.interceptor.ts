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

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    return next.handle(request).pipe(catchError(err => {
      const error = err.error.message || err.statusText;

      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authService.logout();
          // location.reload(true);
          window.location.reload();
          return EMPTY;
        }
      }else{
        this.notifs.warn(error);
        return throwError(error);
      }
      return throwError(error);

    }))
  }

  constructor(private authService: AuthService, private notifs: NotificationService) { }

}
