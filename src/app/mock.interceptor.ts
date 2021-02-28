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

export const usersData: Users[] = [
  {
    "id": 1,
    "firstName": "Licensed",
    "lastName": " Frozen Hat",
    "username": "licensed@gmail.com",
    "password": "1234",
    "token": "fesfefefieh283hcecugeé33",
  }, {
    "id": 2,
    "firstName": "Licensed",
    "lastName": " Frozen Hat",
    "username": "licensed2@gmail.com",
    "password": "1234",
    "token": "fesfefefieh283hcecugeé33",
  }, {
    "id": 3,
    "firstName": "Licensed",
    "lastName": " Frozen Hat",
    "username": "licensed3@gmail.com",
    "password": "1234",
    "token": "fesfefefieh283hcecugeé33",
  }, {
    "id": 4,
    "firstName": "Licensed",
    "lastName": " Frozen Hat",
    "username": "nyhavana@iokaii.mg",
    "password": "1234",
    "token": "fesfefefieh283hcecugeé33",
  }
]

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;


    // return of(null)
    //   .pipe(mergeMap(handleRoute))
    //   .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    //   .pipe(delay(500))
    //   .pipe(dematerialize());

    // function handleRoute() {
      switch (true) {
        case url.endsWith('authenticate') && method === 'POST':
          const { username, password } = body;

          const user = usersData.find(x => x.username === username && x.password === password);
          if (!user) return throwError({ error: { message: 'Adresse e-mail ou mot de passe incorrecte' } });
          return of(new HttpResponse({ status: 200, body: user as Users }));

        case url.endsWith('/users') && method === 'GET':
          if (headers.get('Authorization')) {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
          }
          return of(new HttpResponse({ status: 200, body: (usersData) as Users[] }));

        default:
          // pass through any requests not handled above
          return next.handle(request);;
      }

  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true
};
