import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Users } from './models/users';
import { of } from 'rxjs/internal/observable/of';
import * as SEMEWEE from 'src/app/shared/fake-data/semwee.json';

export const usersData: Users[] = [
  {
    "_id": 1,
    "firstname": "Licensed",
    "lastname": " Frozen Hat",
    "email": 'zaho@gmail.com',
    'image': 'images',
    "token": "fesfefefieh283hcecugeé33",
  }, {
    "_id": 2,
    "firstname": "Licensed",
    "lastname": " Frozen Hat",
    "email": 'zaho@gmail.com',
    'image': 'images',
    "token": "fesfefefieh283hcecugeé33",
  }, {
    "_id": 3,
    "firstname": "12",
    "lastname": " Frozen Hat",
    "email": 'zaho@gmail.com',
    'image': 'images',
    "token": "fesfefefieh283hcecugeé33",
  }, {
    "_id": 4,
    "firstname": "Licensed",
    "lastname": "Frozen Hat",
    "email": 'zaho@gmail.com',
    'image': 'images',
    "token": "fesfefefieh283hcecugeé33",
  }
]

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    // all-fast-csv

    switch (true) {
      case url.endsWith('auth/login') && method === 'POST':
        const { email, password } = body;
        const user = usersData.find(x => x.email === email && x.firstname === password);
        if (!user) return throwError({ error: { error: 'Incorrect email address or password' } });
        return of(new HttpResponse({ status: 200, body: user as Users }));

      case url.endsWith('/validator/all-fast-csv') && method === 'POST':
        return of(new HttpResponse({ status: 200, body: { message: 'seccuss', nameFile: 'nico.csc' } }));

      case url.endsWith('/validator/post-one-fast-csv') && method === 'POST':
        return of(new HttpResponse({ status: 200, body: SEMEWEE as any }));

      case url.endsWith('/validator/post-infer-list') && method === 'POST':
        return of(new HttpResponse({ status: 200, body: { message: 'seccuss' } }));

      case url.endsWith('/validator/get-infer-list') && method === 'GET':
        return of(new HttpResponse({ status: 200, body: SEMEWEE as any }));

      default:
        // pass through any requests not handled above
        return next.handle(request);
    }

  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true
};
