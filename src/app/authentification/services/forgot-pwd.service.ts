import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPwdService {

  constructor(private http: HttpClient) { }

  public sign_up(email: string) {
    return this.http.post<{ message: string }>(`${environment.URL_API}/auth/signup`, email).toPromise();
  }
}
