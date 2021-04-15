import { Users } from './../../../models/users';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  constructor(private http: HttpClient) {}

  public editUser(_id: any, user: Users) {
    console.log('user', user);
    return this.http.put<{ message: string }>(
      `${environment.baseUrl}/user/updateUser`,
      user
    );
  }

  public uploadedPdp(file: any) {
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.http
      .post<{ message: string }>(
        `${environment.baseUrl}/user/add-imageUser`,
        formData
      )
      .toPromise();
  }
}
