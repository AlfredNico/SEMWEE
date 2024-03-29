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
      mergeMap((user: User) => {

        if (user && user.token) {
          return of(true);
        } else if (localStorage.getItem('currentUser')) {
          // this.authService.currentUserSubject.next(JSON.parse(localStorage.getItem('currentUser') || '{}'));
          this.router.navigateByUrl('/user-space');
          return of(true);
        } else if (this.cookieService.check('SEMEWEE') === true) {
          this.router.navigateByUrl('/user-space');
          return of(true);
        }
        else {
          return of(this.router.parseUrl("/sign-in"));
        }
      })
    )
  }

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) { }
}
