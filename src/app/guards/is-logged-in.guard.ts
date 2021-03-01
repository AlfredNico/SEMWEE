import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
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
        } else {
          return of(true);
        }
      })
    )
  }

  constructor(private authService: AuthService) { }

}
