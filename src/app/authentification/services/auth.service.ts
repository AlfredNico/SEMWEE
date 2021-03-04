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
    return this.http.get(`${environment.BASE_URL}/users`).subscribe(
      (user: any) => this.users = user
    )
  }

  public login(value: { username: string, password: string }) {
    console.log('value', value);
    
    return this.http.post<Users>(`${environment.BASE_URL}/authenticate`, value)
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.cookieService.set('SEMEWEE', user.token, 0.2, '/', 'semewee', true, 'Strict');
          this.cookieService.set('id', JSON.stringify(user.id), 0.2, '/', 'semewee', true, 'Strict');
          this.cookieService.set('firstName', user.firstName, 0.2, '/', 'semewee', true, 'Strict');
          this.cookieService.set('lastName', user.lastName, 0.2, '/', 'semewee', true, 'Strict');
          this.cookieService.set('password', user.password, 0.2, '/', 'semewee', true, 'Strict');
          this.cookieService.set('username', user.username, 0.2, '/', 'semewee', true, 'Strict');

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
    this.router.navigateByUrl('/connexion');
  }
}
