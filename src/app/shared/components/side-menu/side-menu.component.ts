import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { animateText, onSideNavChange } from '@app/shared/animations/animation';
import { SidenavService } from '@app/shared/services/sidenav.service';

interface Page {
  link: string;
  name: string;
  icon: string;
}


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class SideMenuComponent implements OnInit, AfterViewInit {

  public pages: Page[] = [
    { name: 'Inbox', link: 'some-link', icon: 'inbox' },
    { name: 'Starred', link: 'some-link', icon: 'star' },
    { name: 'Send email', link: 'some-link', icon: 'send' },
  ];
  public sideNavState: boolean = false;
  public linkText: boolean = false;

  constructor(private _sidenavService: SidenavService) { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this._sidenavService.sideNavState$.subscribe(res => {
      this.sideNavState = res;
      this.linkText = res;
    })
  }

}
