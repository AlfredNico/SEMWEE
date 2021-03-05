import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '@app/models/users';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  public sign_up(user: Users) {
    return this.http.post<{message: string}>(`${environment.URL_API}/auth/signup`, user).toPromise();
  }
}
