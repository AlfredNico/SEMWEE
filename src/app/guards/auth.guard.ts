import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../authentification/services/auth.service';
import { User } from '../classes/users';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    return this.authService.currentUserSubject.pipe(
      mergeMap(user => {
        if (user) {
          return of(true);
        } else if (localStorage.getItem('currentUser')){
          this.authService.currentUserSubject.next(localStorage.getItem('currentUser'));
          return of(true);
        } else if (this.cookie.get('semewee')){
          this.authService.currentUserSubject.next(new User({
            id: +this.cookie.get('id'),
            firstName: this.cookie.get('firstName'),
            lastName: this.cookie.get('lastName'),
            password: this.cookie.get('password'),
            token: this.cookie.get('token'),
            username: this.cookie.get('username'),
          }));

          this.router.navigateByUrl('/espace-user');
          return of(true);
        }
        else{
          return of(this.router.parseUrl("/connexion"));
        }
      })
    )
  }
  
  constructor(private authService: AuthService, private router: Router, private cookie: CookieService) {}
}
