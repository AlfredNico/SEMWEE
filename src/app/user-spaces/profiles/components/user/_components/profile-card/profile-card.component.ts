import { Component } from '@angular/core';
import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  user: Subject<User> = new Subject<User>();
  constructor(public auth: AuthService) {
    this.user = this.auth.currentUserSubject;
  }
}
