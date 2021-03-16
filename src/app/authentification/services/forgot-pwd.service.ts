import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgotPwdService {

  constructor(private http: HttpClient) { }

  public forgetPassword(email: string) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/forgetPassword`, email).toPromise();
  }

  public resetPassword(value: { email: string, token: string }) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/resetPassword`, value).
      toPromise();
  }
}
