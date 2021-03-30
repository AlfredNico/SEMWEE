import { Location } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, OnChanges, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { Users } from '@app/models/users';
import { AllProjectsComponent } from '@app/user-spaces/dashbord/components/projects/all-projects/all-projects.component';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  providers: [ProjectsService, FormBuilder],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideComponent implements OnInit, AfterViewInit, OnChanges {
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

  public allProjects$: Observable<Projects[]>;
  public refresh$ = new BehaviorSubject<boolean>(false);
  user: Users;

  constructor(private layout: LayoutService, private loc: Location, private auth: AuthService, private projets: ProjectsService) {
    // this.getAllProject();
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnChanges() {
    this.refresh$.pipe(
      tap(result => console.log('result', result)),
    )

    this.projets.
      invokeFirstComponentFunction.subscribe(
        () => {
          console.log('name');
        },
        error => console.log('erro', error)
      );

    this.projets.getClickEvent().subscribe(
      _ => {
        console.log('value');
      },
      error => console.log('erro', error)
    );

    this.projets.refresh$.pipe(
      tap(result => console.log(result))
    ).subscribe();
  }

  ngAfterViewInit() {
    this.refresh$.pipe(
      tap(result => console.log('result', result)),
    )

    this.projets.
      invokeFirstComponentFunction.subscribe(
        (name: any) => {
          console.log('name', name);
        },
        error => console.log('erro', error)
      );

    this.projets.getClickEvent().subscribe(
      () => {
        console.log('value');
      },
      error => console.log('erro', error)
    );

    this.projets.refresh$.pipe(
      tap(result => console.log(result))
    ).subscribe();
  }

  ngOnInit() {
    if (this.projets.subsVar == undefined) {
      this.projets.subsVar = this.projets.
        invokeFirstComponentFunction.subscribe(() => {
          console.log('value');
        },
          error => console.log('erro', error));
    }

    this.allProjects$ = this.projets.refresh$.pipe(
      tap(result => console.log(result)),
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
