import { CommonService } from '@app/shared/services/common.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../../_metronic/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { map, switchMap } from 'rxjs/operators';
import { userProject, Users } from '@app/models/users';
import { BehaviorSubject, Observable } from 'rxjs';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { FormControl, FormGroup } from '@angular/forms';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

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
  });

  projects: BehaviorSubject<userProject[]> = new BehaviorSubject<userProject[]>(
    []
  );

  allprojets$: Observable<Projects[]>;
  user: Users;
  idProjet: any = '';
  selectedProject: Projects;
  ProjectName!: string;

  constructor(
    private layout: LayoutService,
    private loc: Location,
    private auth: AuthService,
    private projectsServices: ProjectsService,
    public triggerServices: TriggerService,
    private common: CommonService,
    private router: Router
  ) {
    this.location = this.loc;
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void {
    this.triggerServices.trigrer$.subscribe(() => {
      this.allprojets$ = this.projectsServices.getAllProjects(this.user._id);
    });

    this.triggerServices.switchproject$.subscribe((id: any) => {
      if (id) {
        this.allprojets$.subscribe((res: any) => {
          if (res) {
            this.selectedProject = res.filter((x) => x._id == id);
            this.ProjectName = this.selectedProject[0]['name_project'];
          }
        });
      }
    });

    this.ulCSSClasses = this.layout.getStringCSSClasses('header_menu_nav');
    this.rootArrowEnabled = this.layout.getProp('header.menu.self.rootArrow');
    this.headerMenuDesktopToggle = this.layout.getProp(
      'header.menu.desktop.toggle'
    );
  }

  ngAfterViewInit(): void {}

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

  public selectedItemProjects(): string {
    return this.ProjectName ? this.ProjectName : 'Project';
  }

  public triggres(_id: any) {
    this.triggerServices.switchproject$.next(_id);
    this.triggerServices.switchUrl$.next(true);
    this.common.isLoading$.next(true);
    this.router.navigate(['/user-space/lp-validator', _id]);
  }
}
