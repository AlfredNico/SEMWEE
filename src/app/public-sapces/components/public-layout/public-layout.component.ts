import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { onMainContentChange } from '@app/shared/animations/animation';
import { SidenavService } from '@app/shared/services/sidenav.service';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
  animations: [onMainContentChange]
})
export class PublicLayoutComponent implements OnInit {

  isShow!: boolean;
  topPosToStartShowing = 10;

  constructor(public auth: AuthService) { 
  }

  ngOnInit(): void {
    console.log(this.auth.currentUserSubject.value);
  }



  @HostListener('window:scroll')
  checkScroll() {

    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

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
