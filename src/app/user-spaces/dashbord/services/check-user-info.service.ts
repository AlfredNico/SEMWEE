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

  getInferList(_idProduit: any){
    return this.http.get<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/import-csv/${_idProduit}`).pipe(
      map((result: any) => {
        if (result) {

          console.log('result', result)
          let dataValue: any[] = [];
          result.map((value: any) => {
            Object.keys(value).map((key: string, index: number) => {
              if (!this.data.displayColumns.includes(key)) {
                this.data.displayColumns.push(key);
              }
            })
            dataValue.push({ ...value, 'select': true });
          });
          return this.data = {
            displayColumns: this.data.displayColumns,
            hideColumns: [],
            data: dataValue
          };
        }
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
