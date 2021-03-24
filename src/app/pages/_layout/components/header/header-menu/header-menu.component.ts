import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../../_metronic/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { map } from 'rxjs/operators';
import { userProject, Users } from '@app/models/users';
import { BehaviorSubject } from 'rxjs';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { FormControl, FormGroup } from '@angular/forms';

function getCurrentURL(location) {
  return location.split(/[?#]/)[0];
}

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit, AfterViewInit {
  ulCSSClasses: string;
  rootArrowEnabled: boolean;
  location: Location;
  headerMenuDesktopToggle: string;

  public form = new FormGroup({
    selected: new FormControl(''),
  })

  // projects = [
  //   {_id: 'project-1', name_project: 'Project 1'},
  //   { value: 'project-2', name_project: 'Project 2'},
  //   { value: 'project-3', name_project: 'Project 3'}
  // ];

  // projects: userProject[] = [];
  projects: BehaviorSubject<userProject[]> = new BehaviorSubject<userProject[]>([]);

  constructor(private layout: LayoutService, private loc: Location, private auth: AuthService) {
    this.location = this.loc;
  }

  ngOnInit(): void {
    this.auth.currentUserSubject.pipe(
      map((user: Users) => {
        if (user && user.token && user.projet.length > 0) {
          console.log(user.projet['0']._id);
          this.form.get('selected').setValue(user.projet['0']._id);
          this.projects.next(user.projet);
        }
      })
    )
    .subscribe();
    this.ulCSSClasses = this.layout.getStringCSSClasses('header_menu_nav');
    this.rootArrowEnabled = this.layout.getProp('header.menu.self.rootArrow');
    this.headerMenuDesktopToggle = this.layout.getProp(
      'header.menu.desktop.toggle'
    );
  }

  ngAfterViewInit(){
    
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
