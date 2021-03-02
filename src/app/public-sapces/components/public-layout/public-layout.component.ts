import { Component, OnInit } from '@angular/core';
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

  constructor(public auth: AuthService) { 
  }

  ngOnInit(): void {
    console.log(this.auth.currentUserSubject.value);
  }

}
