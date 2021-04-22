import { Users } from '@app/models/users';
import { Component, OnInit } from '@angular/core';
import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit {
  user: Subject<User> = new Subject<User>();
  constructor(public auth: AuthService) {
    this.user = this.auth.currentUserSubject;
  }

  public pdp: any = 'url(./assets/images/top_bar/blank.png)';
  ngOnInit(): void {
    this.auth.currentUserSubject.subscribe((user: Users) => {
      if (user['image'] !== 'not image')
        this.pdp = `url('${environment.baseUrlImg}${user['image']}')`;
      else this.pdp = 'url(./assets/images/top_bar/blank.png)';
    });
  }
}
