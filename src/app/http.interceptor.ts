import { CommonService } from './shared/services/common.service';
import { Injectable, HostListener } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { MockInterceptor } from './mock.interceptor';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  isInterrompte: boolean = false;
  constructor(private common: CommonService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isInterrompte) {
      return EMPTY;
    }
    return next.handle(request);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 27) {
      this.this.isInterrompte = true;
      console.log('escepe');
      this.common.hideSpinner();
    }
  }
}

// use fake backend in place of Http service for backend-less development
export const httpInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true,
};
