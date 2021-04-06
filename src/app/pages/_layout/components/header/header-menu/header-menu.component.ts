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

  constructor(
    private layout: LayoutService,
    private loc: Location,
    private auth: AuthService,
    private projectsServices: ProjectsService,
    private triggerServices: TriggerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.location = this.loc;
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void {
    this.triggerServices.trigrer$.subscribe(() => {
      this.allprojets$ = this.projectsServices.getAllProjects(this.user._id);
    });

    this.triggerServices.switchUrl$.subscribe((res) => {
      console.log('res', res);
      this.route.paramMap.subscribe(async (params: ParamMap) => {
        console.log('idProduit => ', params.get('idProduit'));
        this.idProjet = params.get('idProduit');
      });
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

  public nagivateByProject(itemId: any) {
    this.router.navigateByUrl(`/user-space/lp-validator/${itemId}`);
    // this.router.navigate(['/user-space/lp-validator'], {
    //   queryParams: { itemId },
    // });
    // this.projectServices.switchUrl$.next(true);
  }
}
