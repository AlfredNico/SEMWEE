import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Users } from './models/users';
import { of } from 'rxjs/internal/observable/of';
import * as INFERLIST from 'src/app/shared/fake-data/inferlist.json';
import * as PRODUCT from 'src/app/shared/fake-data/product.json';
import * as PROJECT from 'src/app/shared/fake-data/project.json';


//  | 'PREMIUM' | 'ADMIN' | 'USER';
/* export const usersData: Users[] = [
  {
    _id: '1',
    firstname: 'zahoZAHO12',
    lastname: ' Frozen Hat',
    email: 'zaho@zaho.fr',
    image: 'images',
    token: 'fesfefefieh283hcecugeé33',
    role: ['FREEMIUM'],
  },
  {
    _id: '2',
    firstname: 'zahoZAHO12',
    lastname: 'Frozen Hat',
    email: 'zaho2@zaho.fr',
    image: 'images',
    token: 'fesfefefieh283hcecugeé33',
    role: ['FREEMIUM'],
  },
];

export const projects: Projects[] = [
  {
    _id: '1',
    country_project: 'Madagascar',
    created_project: new Date(Date.now()),
    domain_project: 'www.google.com',
    image_project: '',
    image_project_Landscape: '',
    image_project_Squared: '',
    language_project: 'fr',
    last_update_data: new Date(Date.now()),
    letter_thumbnails_project: [
      {
        background: '#99b685',
        color: '#4285f4',
        letter: 'A',
      },
    ],
    name_project: 'Management',
    numberLPVa: '1',
    numberPLI: '2',
    number_of_item: '2',
    path_project: '/fr/*',
    product: 'Nico',
    protocol_project: 'SSL',
    user_id: '1',
  },
  {
    _id: '2',
    country_project: 'Madagascar',
    created_project: new Date(Date.now()),
    domain_project: 'www.google.com',
    image_project: '',
    image_project_Landscape: '',
    image_project_Squared: 'assets/images/png/project_img.png',
    language_project: 'fr',
    last_update_data: new Date(Date.now()),
    letter_thumbnails_project: [
      {
        background: '#99b685',
        color: '#4285f4',
        letter: 'B',
      },
    ],
    name_project: 'Protocol',
    numberLPVa: '1',
    numberPLI: '2',
    number_of_item: '2',
    path_project: '/fr/*',
    product: 'Nico',
    protocol_project: 'SSL',
    user_id: '1',
  },
  {
    _id: '3',
    country_project: 'Madagascar',
    created_project: new Date(Date.now()),
    domain_project: 'www.google.com',
    image_project: '',
    image_project_Landscape: '',
    image_project_Squared: '',
    language_project: 'fr',
    last_update_data: new Date(Date.now()),
    letter_thumbnails_project: [
      {
        background: '#99b685',
        color: '#4285f4',
        letter: 'P',
      },
    ],
    name_project: 'Heroko',
    numberLPVa: '1',
    numberPLI: '2',
    number_of_item: '2',
    path_project: '/fr/*',
    product: 'Nico',
    protocol_project: 'SSL',
    user_id: '1',
  },
];*/

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    switch (true) {
      /* case url.includes('auth/login') && method === 'POST':
        const { email, password } = body;
        const user = usersData.find(
          (x) => x.email === email && x.firstname === password
        );
        if (!user)
          return throwError({
            error: { error: 'Incorrect email address or password' },
          });
        return of(new HttpResponse({ status: 200, body: user as Users }));

      case url.includes('/get-project-product/1'):
        return of(
          new HttpResponse({
            status: 200,
            body: Array(
              (INFERLIST as any)['default'],
              (FILE as any)['default']
            ),
          })
        );

      case url.includes('/get-project-product/2'):
        return of(
          new HttpResponse({
            status: 200,
            body: Array((INFERLIST as any)['default'], []),
          })
        );

      case url.includes('/get-project-product/3'):
        return of(
          new HttpResponse({
            status: 200,
            body: Array([], []),
          })
        );

      case url.includes('project/get-project'):
        return of(
          new HttpResponse({
            status: 200,
            body: projects,
          })
        ); */

      case url.includes('validator/import-csv') && method === 'POST':
        return of(
          new HttpResponse({
            status: 200,
            body: (INFERLIST as any)['default'],
          })
        );

      case url.includes('validator/post-infer-list') && method === 'POST':
        return of(
          new HttpResponse({
            status: 200,
            body: (PRODUCT as any)['default'],
          })
        );

      // case url.includes('/project/get-project'):
      //   return of(
      //     new HttpResponse({
      //       status: 200,
      //       body: Array(
      //         (INFERLIST as any)['default'],
      //         (PROJECT as any)['default']
      //       ),
      //     })
      //   );

      // pass through any requests not handled above
      default:
        return next.handle(request);
    }
  }
}

// use fake backend in place of Http service for backend-less development
export const mockInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true,
};
