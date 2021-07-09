import { Injectable } from '@angular/core';
import { userProject } from '@app/models/users';
import { CookieService } from 'ngx-cookie-service';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class UpdatesUserInfoService {

  constructor(private cookieService: CookieService) { }

  updatesUsers(projectList: any[]) {
    console.log(projectList)
    this.cookieService.set('projet', JSON.stringify(projectList), 0.2, '/', undefined, false, 'Strict');
  }
}
