import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgotPwdService {

  constructor(private http: HttpClient) { }

  public forgetPassword(value: {email: string, baseUrl: string}) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/auth/forgetPassword`, value).toPromise();
  }

  public resetPassword(value: { newPass: string, resetLink: string }) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/auth/resetPassword`, value).
      toPromise();
  }
}
