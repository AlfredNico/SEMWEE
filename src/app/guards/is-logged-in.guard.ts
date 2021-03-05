import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return this.authService.currentUserSubject.pipe(
      mergeMap((user: User) => {
        if (user && user.token) {
          return of(true);
        } else if (localStorage.getItem('currentUser')) {
          console.log('currentUser', JSON.parse(localStorage.getItem('currentUser') || '{}'));
          this.authService.currentUserSubject.next(JSON.parse(localStorage.getItem('currentUser') || '{}'));
          return of(true);
        } else if (this.cookieService.get('SEMEWEE')) {
          this.authService.currentUserSubject.next(new User({
            _id: +this.cookieService.get('_id'),
            firstname: this.cookieService.get('firstname'),
            lastname: this.cookieService.get('lastname'),
            email: this.cookieService.get('email'),
            token: this.cookieService.get('SEMEWEE'),
            image: this.cookieService.get('image'),
          }));
          return of(true);
        } else {
          return of(true);
        }
      })
    )
  }

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) { }

}
