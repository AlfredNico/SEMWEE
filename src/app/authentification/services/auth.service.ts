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

  constructor(private http: HttpClient, private router: Router, private cookie: CookieService) {
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
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(new User(user));
          this.isAuthenticatedSubject.next(true);
          return user;
        })).toPromise();
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.cookie.deleteAll();
    this.currentUserSubject.next(new User(undefined));
    this.router.navigate(['/connexion']);
  }
}
