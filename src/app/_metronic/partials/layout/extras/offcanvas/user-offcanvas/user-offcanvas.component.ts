import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { Subject } from 'rxjs';
// import { Subject } from 'rxjs';
// import { Observable } from 'rxjs';
// import { UserModel } from '../../../../../../modules/auth/_models/user.model';
// import { AuthService } from '../../../../../../modules/auth/_services/auth.service';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  // user$: Observable<UserModel>;
  user: Subject<User> = new Subject<User>();
  // user!: User;

  // , private auth: AuthService
  constructor(private layout: LayoutService, public auth: AuthService) {
    this.user = this.auth.currentUserSubject;
  }

  
    

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
  }

  logout() {
    // this.auth.logout();
    document.location.reload();
  }
}
