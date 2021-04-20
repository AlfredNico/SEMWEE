import { HostListener, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { CommonService } from './shared/services/common.service';

@Injectable()
export class InterruptedInterceptor implements HttpInterceptor {
  isInterrompte: boolean = false;
  constructor(private common: CommonService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('url is ', request.url);
    if (this.isInterrompte) {
      return EMPTY;
    }
    return next.handle(request);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log('key');
    if (event.keyCode === 27) {
      this.isInterrompte = true;
      console.log('escepe');
      this.common.hideSpinner();
    }
  }
}

export const interruptedInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterruptedInterceptor,
  multi: true,
};
