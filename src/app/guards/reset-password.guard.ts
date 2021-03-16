import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (Object.keys(route.queryParams).includes('token') && route.queryParamMap.get('token').length >= 10) {
      return true;
    }
    return of(this.router.parseUrl("/sign-in"));
    // return false;
  }

  constructor(private router: Router) {
    // const token = this.router
  }

}
