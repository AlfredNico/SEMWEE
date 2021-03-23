import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../../_metronic/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { map } from 'rxjs/operators';
import { userProject } from '@app/models/users';
import { BehaviorSubject } from 'rxjs';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';

function getCurrentURL(location) {
  return location.split(/[?#]/)[0];
}

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  ulCSSClasses: string;
  rootArrowEnabled: boolean;
  location: Location;
  headerMenuDesktopToggle: string;

  // projects = [
  //   {_id: 'project-1', name_project: 'Project 1'},
  //   { value: 'project-2', name_project: 'Project 2'},
  //   { value: 'project-3', name_project: 'Project 3'}
  // ];

  // projects: userProject[] = [];
  projects: BehaviorSubject<Projects[]> = new BehaviorSubject<Projects[]>([]);

  constructor(private layout: LayoutService, private loc: Location, private auth: AuthService) {
    this.location = this.loc;
  }

  ngOnInit(): void {
    this.auth.currentUserSubject.pipe(
      map((user: User) => {
        console.log(user.projets[0].name_project);
        this.projects.next(user.projets);
        console.log(this.projects);
      })
    )
    .subscribe();
    this.ulCSSClasses = this.layout.getStringCSSClasses('header_menu_nav');
    this.rootArrowEnabled = this.layout.getProp('header.menu.self.rootArrow');
    this.headerMenuDesktopToggle = this.layout.getProp(
      'header.menu.desktop.toggle'
    );
  }

  getMenuItemActive(url) {
    return this.checkIsActive(url) ? 'menu-item-active' : '';
  }

  checkIsActive(url) {
    const location = this.location.path();
    const current = getCurrentURL(location);
    if (!current || !url) {
      return false;
    }

    if (current === url) {
      return true;
    }

    if (current.indexOf(url) > -1) {
      return true;
    }

    return false;
  }
}
