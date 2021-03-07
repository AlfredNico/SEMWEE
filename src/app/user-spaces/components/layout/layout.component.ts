import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
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
  isShow!: boolean;
  topPosToStartShowing = 10;

  constructor(public auth: AuthService, private _sidenavService: SidenavService) {
    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    })
  }

  // @HostListener('scroll', ['$event']) public scrolled($event: Event) {
  //   console.log("scrolling...", $event);
  // }
    // @HostListener('mousewheel', ['$event']) onMousewheel(event: any) {
    //   // console.log("scrolling...", event);
    //   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    //   console.log('[scroll1]', window.pageYOffset);
    //   console.log('[scroll2]', document.documentElement.scrollTop);
    //   console.log('[scroll3]', document.body.scrollTop);


    //   if (scrollPosition >= this.topPosToStartShowing) {
    //     this.isShow = true;
    //   } else {
    //     this.isShow = false;
    //   }
  // (mousewheel) = "mousewheel($event)"
  //}
  // @HostListener('window:scroll', ['$event']) onScroll(event: any) {
  //   this.pageYoffset = window.pageYOffset;
  //   console.log("scrolling...", event);
  // }

  // mousewheel(event: any) {
  //   console.log(event)
  // }

  ngOnInit(): void {
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }

  @HostListener('window:scroll')
  checkScroll() {

    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


}