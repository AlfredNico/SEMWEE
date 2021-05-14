import { Observable } from 'rxjs';
import { AuthService } from './../../../authentification/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Users } from './../../../models/users';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@app/classes/users';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
  ) { }

  public editUser(_id: any, user: Users): Observable<{ message: any }> {
    // console.log('user', user);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.cookieService.get('SEMEWEE')}`
    );
    return this.http.put<{ message: string }>(
      `${environment.baseUrl}/user/updateUser`,
      user,
      { headers: headers }
    );
  }

  public uploadedPdp(file: any): Promise<{ message: any }> {
    const formData: FormData = new FormData();
    formData.append('image', file);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.cookieService.get('SEMEWEE')}`
    );

    return this.http
      .post<{ message: string }>(
        `${environment.baseUrl}/user/add-imageUser`,
        formData,
        { headers: headers }
      )
      .toPromise();
  }

  public updateUnderstand(num: any, userId: any): Promise<{ message: any }> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.cookieService.get('SEMEWEE')}`
    );

    return this.http
      .post<{ message: string }>(
        `${environment.baseUrl}/user/updateUnderstand`,
        {
          "id": userId,
          "understand": num
        },
        { headers: headers }
      )
      .toPromise();
  }

  public checkUserInfo(user: Users): void {
    console.log("etoooo")
    if (localStorage.getItem('currentUser') !== null) {
      localStorage.removeItem('currentUser');
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else if (this.cookieService.check('SEMEWEE') === true) {
      this.cookieService.set('_id', user._id);

      if (this.cookieService.check('firstname') === true)
        this.cookieService.delete('firstname');

      if (this.cookieService.check('lastname') === true)
        this.cookieService.delete('lastname');

      if (this.cookieService.check('email') === true)
        this.cookieService.delete('email');

      if (this.cookieService.check('image') === true)
        this.cookieService.delete('image');

      this.cookieService.set(
        'firstname',
        user.firstname,
        0.2,
        '/',
        undefined,
        false,
        'Strict'
      );
      this.cookieService.set(
        'lastname',
        user.lastname,
        0.2,
        '/',
        undefined,
        false,
        'Strict'
      );
      this.cookieService.set(
        'email',
        user.email,
        0.2,
        '/',
        undefined,
        false,
        'Strict'
      );
      this.cookieService.set(
        'image',
        user.image,
        0.2,
        '/',
        undefined,
        false,
        'Strict'
      );
      this.cookieService.set(
        'understand',
        '' + user.understand,
        0.2,
        '/',
        undefined,
        false,
        'Strict'
      );
    }
    this.authService.currentUserSubject.next(new User(user));
  }
}
