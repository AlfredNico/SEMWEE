import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from 'src/app/models/users';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/users';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn = true;
  // public currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUserSubject = new BehaviorSubject<User>(undefined);
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  users: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  public getAllUsers() {
    return this.http
      .get(`${environment.baseUrl}/user/allUser`)
      .subscribe((user: any) => {
        this.users = user;
      });
  }

  public login(value: { email: string; password?: string }) {
    return this.http
      .post<Users>(`${environment.baseUrl}/auth/login`, value)
      .pipe(
        map((user: Users) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.cookieService.set(
            'SEMEWEE',
            user.token,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          this.cookieService.set(
            '_id',
            user._id,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          this.cookieService.set(
            'firstname',
            user.firstname,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          this.cookieService.set(
            'lastname',
            user.lastname,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          this.cookieService.set(
            'email',
            user.email,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          this.cookieService.set(
            'image',
            user.image,
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          this.cookieService.set(
            'role',
            JSON.stringify(user.role),
            0.2,
            '/',
            undefined,
            false,
            'Strict'
          );
          // this.cookieService.set(
          //   'projet',
          //   JSON.stringify(user.projet),
          //   0.2,
          //   '/',
          //   undefined,
          //   false,
          //   'Strict'
          // );

          // this.currentUserSubject.next(new User(user));
          this.isAuthenticatedSubject.next(true);
          return user;
        }),
        catchError((err) => {
          return this.handleError(err);
        })
      )
      .toPromise();
  }

  public handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  public logout() {
    // remove user from local storage to log user out
    this.cookieService.deleteAll('/');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(new User(undefined));
    // location.reload();
    this.router.navigateByUrl('/sign-in');
  }
}
