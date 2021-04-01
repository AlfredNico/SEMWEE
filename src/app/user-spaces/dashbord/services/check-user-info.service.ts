import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { environment } from '@environments/environment';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckUserInfoService {

  public data: { displayColumns: any[], hideColumns: any[], data: any[] } = { displayColumns: ['select'], hideColumns: [], data: [] };

  constructor(private http: HttpClient) { }

  checkProject(_idProduit: any) {
    return this.http.get<any[]>(`${environment.baseUrl}/project/get-project-product/${_idProduit}`).pipe(
      map((results: any) => {
        return results;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    ).toPromise();
  }

  public handleError(error) {
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error);
    return throwError(error);
  }
}
