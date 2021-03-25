import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { Users } from '@app/models/users';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  location: Location;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;

  // public user: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  allprojets$: Observable<Projects[]>;
  user: Users;

  constructor(private layout: LayoutService, private loc: Location, private auth: AuthService, private projets: ProjectsService) {
    // this.getAllProject();
    this.user = this.auth.currentUserSubject.value;

  }

  ngOnInit(): void {
    this.allprojets$ = this.projets.refresh$.pipe(
      switchMap(_ => this.projets.getAllProjects(this.user._id))
    )
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    // this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;
    // Routing
    this.location = this.loc;
  }

  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/images/logo.png';
    } else {
      return './assets/images/logo.png';
    }
  }
}
