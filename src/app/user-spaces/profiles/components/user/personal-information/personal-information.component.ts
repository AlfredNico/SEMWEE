import { NotificationService } from '@app/services/notification.service';
import { ProfilesService } from './../../../services/profiles.service';
import { Users } from './../../../../../models/users';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/authentification/services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    id: new FormControl(''),
    image: new FormControl(''),
  });

  pdp: any = '';
  isPdp: boolean = false;
  isUploaded: boolean = false;
  pdpSource: File;
  public user: Users;
  isLoading$ = new BehaviorSubject<boolean>(false);
  isdeletePic: boolean = false;
  // user: UserModel;
  // firstUserState: UserModel;
  // subscriptions: Subscription[] = [];
  // avatarPic = 'none';
  // isLoading$: Observable<boolean>;
  // projet: userProject[];

  constructor(
    private userService: AuthService,
    private profileService: ProfilesService,
    private notifs: NotificationService
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

  get firstname() {
    return this.formGroup.get('firstname');
  }
  get lastname() {
    return this.formGroup.get('lastname');
  }
  get email() {
    return this.formGroup.get('email');
  }

  ngOnInit(): void {
    if (this.user) {
      this.formGroup.patchValue({
        ...this.user,
        id: this.user['_id'],
      });
    }
  }

  ngOnDestroy(): void {}

  uploadPdp(e: any) {}

  public uploadChanged(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.pdp = '';
      const file = (event.target as HTMLInputElement).files[0] as any;
      const reader = new FileReader();
      reader.onload = (e) => (this.pdp = reader.result);
      reader.readAsDataURL(file);
      this.pdpSource = file;
      this.isUploaded = true;
    }
  }

  public getPic(): string {
    if (
      this.user.image !== 'not image' &&
      this.isUploaded === false &&
      this.isdeletePic === false
    ) {
      this.isPdp = true;
      return `url('${environment.baseUrlImg}${this.user.image}')`;
    } else if (this.isUploaded === true && this.isdeletePic === false) {
      this.isPdp = true;
      return `url('${this.pdp}')`;
    }
    return 'none';
  }

  public deletePic() {
    this.isdeletePic = true;
    this.pdpSource = undefined;
    this.isUploaded = false;
    this.isPdp = false;
    this.formGroup.patchValue({
      image: '',
    });
  }

  public async save() {
    this.isLoading$.next(true);

    if (!this.formGroup.valid) {
      this.isLoading$.next(false);
      return;
    }

    if (this.pdpSource instanceof File) {
      try {
        const urlPdp = await this.profileService.uploadedPdp(this.pdpSource);
        if (urlPdp && urlPdp.message) {
          const value = {
            ...this.formGroup.value,
            image: urlPdp.message,
          };
          this.profileService
            .editUser(this.user['_id'], value)
            .subscribe((res: any) => {
              if (res && res.message) {
                const newUser = {
                  ...this.user,
                  ...this.formGroup.value,
                  image: urlPdp.message,
                } as Users;

                this.profileService.checkUserInfo(newUser);
                this.notifs.sucess(res.message);
              }
              this.isLoading$.next(false);
            });
        }
        this.isLoading$.next(false);

        this.isLoading$.next(false);
      } catch (error) {
        this.notifs.warn('Error upload file');
        this.isLoading$.next(false);
      }
    } else {
      const newUser = {
        ...this.user,
        ...this.formGroup.value,
        image: this.isdeletePic === true ? 'not image' : this.user['image'],
      } as Users;

      this.profileService
        .editUser(this.user['_id'], this.formGroup.value)
        .subscribe(
          (res: any) => {
            if (res && res.message) {
              this.profileService.checkUserInfo(newUser);
              this.notifs.sucess(res.message);
            }
            this.isLoading$.next(false);
          },
          (error) => this.isLoading$.next(false)
        );
    }
  }

  public cancel(): void {
    this.isLoading$.next(false);
  }

  // helpers for View
  // isControlValid(controlName: string): boolean {
  //   const control = this.formGroup.controls[controlName];
  //   return control.valid && (control.dirty || control.touched);
  // }

  // isControlInvalid(controlName: string): boolean {
  //   const control = this.formGroup.controls[controlName];
  //   return control.invalid && (control.dirty || control.touched);
  // }
}
