import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { Subject } from 'rxjs';
// import { Subject } from 'rxjs';
import { LayoutService } from '../../../../../core';
// import { UserModel } from '../../../../../../modules/auth/_models/user.model';
// import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  // user$: Observable<UserModel>
  user: Subject<User> = new Subject<User>();

  // , private auth: AuthService
  constructor(private layout: LayoutService, public auth: AuthService) {
    this.user = this.auth.currentUserSubject;
    // console.log(this.user)
  }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
  }

  logout() {
    // this.auth.logout();
    document.location.reload();
  }
}
