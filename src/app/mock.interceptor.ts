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
import * as SEMEWEE2 from 'src/app/shared/fake-data/semwee2.json';
import * as FILE from 'src/app/shared/fake-data/file.json';

//  | 'PREMIUM' | 'ADMIN' | 'USER';
export const usersData: Users[] = [
  {
    "_id": "1",
    "firstname": "zahoZAHO12",
    "lastname": " Frozen Hat",
    "email": 'zaho@zaho.fr',
    'image': 'images',
    "token": "fesfefefieh283hcecugeé33",
    "role": ['FREEMIUM'],
    'projet': [{ _id: 'ekfeisifie', name_project: 'Projet 1' }]
  }, {
    "_id": "2",
    "firstname": "zahoZAHO12",
    "lastname": " Frozen Hat",
    "email": 'zaho2@zaho.fr',
    'image': 'images',
    "token": "fesfefefieh283hcecugeé33",
    "role": ['FREEMIUM'],
    'projet': []
  }
]

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    // all-fast-cs

    switch (true) {
      // case url.endsWith('auth/login') && method === 'POST':
      //   const { email, password } = body;
      //   const user = usersData.find(x => x.email === email && x.firstname === password);
      //   if (!user) return throwError({ error: { error: 'Incorrect email address or password' } });
      //   return of(new HttpResponse({ status: 200, body: user as Users }));

      // case url.includes('/validator/all-fast-csv') && method === 'POST':
      //     return of(new HttpResponse({ status: 200, body: { message: 'seccuss', nameFile: 'nico.csc' } }));

      //   case url.includes('validator/import-csv') && method === 'POST':
      //     return of(new HttpResponse({ status: 200, body: SEMEWEE as any }));

      // case url.includes('validator/import-csv'):
      //     return of(new HttpResponse({ status: 200, body: SEMEWEE as any }));

      // case url.includes('validator/post-infer-list') && method === 'POST':
      //   return of(new HttpResponse({ status: 200, body: FILE as any }));

      // case url.includes('validator/post-infer-list') && method === 'POST':
      //   return of(new HttpResponse({ status: 200, body: FILE as any }));

      // case url.includes('/validator/get-infer-list') && method === 'POST':
      //   return of(new HttpResponse({ status: 200, body: FILE as any }));

      default:
        // pass through any requests not handled above
        return next.handle(request);
    }

  }
}

export let mockInterceptor = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true
};
