import { Location } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, OnChanges, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { Users } from '@app/models/users';
import { AllProjectsComponent } from '@app/user-spaces/dashbord/components/projects/all-projects/all-projects.component';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  // providers: [ProjectsService, FormBuilder],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideComponent implements OnInit, AfterViewInit {
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

  public allProjects$: Observable<Projects[]> = new Observable<Projects[]>();
  public projects: Projects[] = [];
  user: Users;

  constructor(private layout: LayoutService, private loc: Location, private auth: AuthService, private projets: ProjectsService, private triggerServices: TriggerService) {
    // this.getAllProject();
    this.user = this.auth.currentUserSubject.value;
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.triggerServices.trigrer$.subscribe(
      () => {
        this.projets.getAllProjects(this.user._id).subscribe(
          result => {
            if (result.length !== this.projects.length) {
              this.projects = result;
            }
          }
        )
      });


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
