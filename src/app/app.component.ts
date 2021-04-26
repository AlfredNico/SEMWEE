import { IdbService } from './services/idb.service';
import { InterruptedService } from './shared/services/interrupted.service';
import { Component, HostListener } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { CommonService } from './shared/services/common.service';

@Component({
  selector: 'app-root',
  template: `
    <ngx-spinner name="root">
      <p [style.color]="'white'">loading ...</p>
    </ngx-spinner>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      ::ng-deep.spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppComponent {
  title = 'SEMWEE';

  constructor(
    private router: Router,
    private common: CommonService,
    private interrupted: InterruptedService,
    private readonly idb: IdbService
  ) {
    // this.interrupted.isInterrompted.next(false);
    this.idb.connectToIDB();

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.common.showSpinner();
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel: {
          this.common.hideSpinner();
          break;
        }
        default: {
          this.common.hideSpinner();
          break;
        }
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 27) {
      // this.interrupted.isInterrompted.next(true);
      this.common.hideSpinner();
    }
  }
}
