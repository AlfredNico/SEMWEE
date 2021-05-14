import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Users } from '@app/models/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { map } from 'rxjs/operators';
import { ProfilesService } from '@app/user-spaces/profiles/services/profiles.service';

@Component({
  selector: 'app-information-sheet-buttom',
  templateUrl: './information-sheet-buttom.component.html',
  styleUrls: ['./information-sheet-buttom.component.scss'],
})
export class InformationSheetButtomComponent implements OnInit {
  public user: Users;

  constructor(
    private userService: AuthService,
    private profileService: ProfilesService,
    public _bottomSheetRef: MatBottomSheetRef<InformationSheetButtomComponent>,
    private readonly coockie: CookieService
  ) {
    this.userService.currentUserSubject
      .pipe(
        map((user: Users) => {
          if (user) {
            this.user = user;
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void { }

  async noSee() {
    //appel api update user.understand to 1
    this._bottomSheetRef.dismiss();
    let newUnderstand = 1;
    await this.profileService.updateUnderstand(newUnderstand, this.user._id);
    this.user.understand = newUnderstand;
    this.coockie.set(
      'understand',
      '' + newUnderstand,
      0.2,
      '/',
      undefined,
      false,
      'Strict'
    );
    // let localSto = JSON.parse(localStorage.getItem("currentUser"));
    // console.log("sto=" + localSto.understand);
    // localSto.understand = newUnderstand;
    // localStorage.setItem("currentUser", localSto);
  }
}
