import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from 'src/app/models/users';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/users';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn = true;
  // public currentUserSubject = new BehaviorSubject<User| any>(new User());
  public currentUserSubject = new BehaviorSubject<Users | any>(undefined);
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  users: any[] = [];

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    console.log('user', this.currentUserSubject.value);
  }

  public getAllUsers() {
    return this.http.get(`${environment.URL_API}/user/allUser`).subscribe(
      (user: any) => this.users = user
    )
  }

  public login(value: { email: string, password: string }) {

    return this.http.post<any>(`${environment.URL_API}/auth/login`, value).pipe()
      .pipe(
        map((user: Users) => {
          console.log('user', user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.cookieService.set('SEMEWEE', user.token, 0.2, '/', undefined, false, 'Strict');
          this.cookieService.set('_id', JSON.stringify(user._id), 0.2, '/', undefined, false, 'Strict');
          this.cookieService.set('firstname', user.firstname, 0.2, '/', undefined, false, 'Strict');
          this.cookieService.set('lastname', user.lastname, 0.2, '/', undefined, false, 'Strict');
          this.cookieService.set('email', user.email, 0.2, '/', undefined, false, 'Strict');
          this.cookieService.set('image', JSON.stringify(user.image), 0.2, '/', undefined, false, 'Strict');
          this.currentUserSubject.next(new User(user));
          this.isAuthenticatedSubject.next(true);
          return user;
        })).toPromise();
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.cookieService.deleteAll();
    this.currentUserSubject.next(new User(undefined));
    // location.reload();
    this.router.navigateByUrl('/sign-in');
  }
}
