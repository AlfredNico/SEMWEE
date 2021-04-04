import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '@app/models/users';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private http: HttpClient) {}

  public sign_up(user: Users) {
    return this.http
      .post<{ message: string; user?: Users }>(
        `${environment.baseUrl}/auth/signup`,
        user
      )
      .toPromise();
  }
}
