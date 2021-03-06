import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit, ElementRef, Inject } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { onMainContentChange, onSideNavChange, animateText } from '@app/shared/animations/animation';
import { SidenavService } from '@app/shared/services/sidenav.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [onMainContentChange, onSideNavChange, animateText]

})
export class LayoutComponent implements OnInit {

  public onSideNavChange!: boolean;

  public sideNavState: boolean = false;
  public linkText: boolean = false;

  // Scroll button
  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll() {
    this.pageYoffset = window.pageYOffset;
    console.log(window.pageYOffset);
  }

  constructor(public auth: AuthService, private _sidenavService: SidenavService, private scroll: ViewportScroller, @Inject(DOCUMENT) private document: Document) {
    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    })
  }

  ngOnInit(): void {
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

}