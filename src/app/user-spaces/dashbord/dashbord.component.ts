import { Component, OnInit } from '@angular/core';
import { SidenavService } from '@app/shared/services/sidenav.service';
import { onMainContentChange, onSideNavChange, animateText } from '@app/shared/animations/animation';
import { AuthService } from '@app/authentification/services/auth.service';

@Component({
  selector: 'app-dashbord',
  template: `
        <mat-drawer-container class="h-100 sidenav-container" autosize>
            <mat-drawer #drawer class="sidenav-drawer" mode="side" opened>
                <app-side-menu></app-side-menu>
            </mat-drawer>

            <mat-drawer-content [@onMainContentChange]="onSideNavChange ? 'open': 'close'">
                <div class="main_content" class="h-100">
                    <mat-toolbar class="app-header px-4" [style.background]="'white'">
                        <button (click)="onSinenavToggle()" mat-icon-button aria-label="menu icon">
                                <mat-icon *ngIf="!sideNavState">menu</mat-icon>
                                <mat-icon *ngIf="sideNavState">menu_open</mat-icon>
                            </button>
                        <div class="m-auto">
                            <input type="search" autocomplete="off" placeholder="search ..." />
                        </div>

                        <div class="spacer"></div>
                        <ng-template #loginTemplete>
                            <button mat-button [routerLink]="['/connexion']" class="mx-3">
                                    <mat-icon>login</mat-icon>Connecter
                                </button>
                        </ng-template>
                        <ng-template #logoutTemplete>
                            <button mat-button>
                                        <img class="jim" src="https://a57.foxnews.com/media2.foxnews.com/BrightCove/694940094001/2018/06/21/931/524/694940094001_5800293009001_5800284148001-vs.jpg?ve=1&tl=1" alt="">
                                    John Doe
                                    <mat-icon>keyboard_arrow_down</mat-icon>
                                </button>
                            <button mat-button>
                                    <mat-icon >reorder</mat-icon>Sample menu <mat-icon>keyboard_arrow_down</mat-icon>
                                </button>
                            <button mat-button>
                                    <mat-icon  matBadge="3" matBadgePosition="before" matBadgeColor="warn">notification_important</mat-icon>Update
                                </button>
                            <button mat-button (click)="auth.logout()">
                                    <mat-icon>logout</mat-icon>Déconnecter
                                </button>
                        </ng-template>

                        <ng-container *ngTemplateOutlet="!auth.currentUserSubject?.value ? loginTemplete : logoutTemplete">
                        </ng-container>
                    </mat-toolbar>
                    <div class="p-3 w-100" fxLayout="column" fxLayoutAlign="space-between center">
                        <section class="w-100 pt-4">
                          <router-outlet></router-outlet>
                        </section>
                    </div>
                </div>

            </mat-drawer-content>

        </mat-drawer-container>
  `,
  styles: [`
      .main_content {
        width: 100%;
        height: calc(100vh - 100px);
        background: #efefef;
    }

    .sidenav-container {
        min-width: 60px;
        height: calc(100vh - 200px);
    }

    .tab-group {
        border-bottom: 2px solid #e8e8e8;
    }

    .tab-content {
        padding: 16px;
    }

    .jim {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 50%;
    }`],
  animations: [onMainContentChange, onSideNavChange, animateText]
})
export class DashbordComponent implements OnInit {

  //SideNav 
  public onSideNavChange!: boolean;
  public sideNavState: boolean = false;
  public linkText: boolean = false;

  constructor(private _sidenavService: SidenavService, public auth: AuthService) {
    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    })
  }

  ngOnInit(): void {
  }

  public onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }

}
