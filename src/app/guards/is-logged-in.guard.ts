import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { Users } from '@app/models/users';
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
      mergeMap((user: Users) => {

        if (user && user.token) {
          // this.authService.currentUserSubject.next(new User(user));
          // this.authService.currentUserSubject.next(user);
          return of(true);

        } else if (localStorage.getItem('currentUser') !== null) {
          // this.authService.currentUserSubject.next(JSON.parse(localStorage.getItem('currentUser') || '{}'));
          const authUser = new User(JSON.parse(localStorage.getItem('currentUser')));
          this.authService.currentUserSubject.next(authUser);
          return of(true);

        } else if (this.cookieService.check('SEMEWEE') === true) {
          const authUser = new User({
            _id: this.cookieService.get('_id'),
            firstname: this.cookieService.get('firstname'),
            lastname: this.cookieService.get('lastname'),
            email: this.cookieService.get('email'),
            token: this.cookieService.get('SEMEWEE'),
            image: this.cookieService.get('image'),
            role: JSON.parse(this.cookieService.get('role')),
            // projet: JSON.parse(this.cookieService.get('projet')),
          });

          this.authService.currentUserSubject.next(authUser);
          return of(true);
        }
        // return of(this.router.parseUrl("/sign-in"));
        return of(true);
      })
    )
  }

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) { }

}
