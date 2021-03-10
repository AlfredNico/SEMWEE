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
import * as User from 'src/app/shared/fake-data/users.json';

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
    "firstname": "Licensed",
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
        if (!user) return throwError({ error: { message: 'Adresse e-mail ou mot de passe incorrecte' } });
        return of(new HttpResponse({ status: 200, body: user as Users }));

      case url.endsWith('validator/all-fast-csv') && method === 'GET':
        console.log('/validator/all-fast-csv');
        return of(new HttpResponse({ status: 200, body: User as any }));

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
