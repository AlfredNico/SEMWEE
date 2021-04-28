import { IdbService } from './../../../services/idb.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { environment } from '@environments/environment';
import { BehaviorSubject, of, throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { promise } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root',
})
export class CheckUserInfoService {
  private listeData = new BehaviorSubject<any[]>([]);
  private listeDataLoaded = of(false);
  constructor(private http: HttpClient, private idb: IdbService) {}

  public checkProject(_idProduit: any) {
    return Promise.all([
      this.idb.getItem('infetList', _idProduit),
      this.idb.getItem('checkRevelancy', _idProduit),
    ]).then((res) => {
      if (res[0] || res[1]) {
        if (res[0] && res[1])
          {
            return of(Array(res[0]['value'], res[1]['value']));
          }
        else if (res[0]){
           return of(Array(res[0]['value'], Array()))
          };
      } else {
        return this.http
          .get<any[]>(
            `${environment.baseUrl}/project/get-project-product/${_idProduit}`
          )
          .pipe(
            map((results: any) => {
              if (results[0].length > 0)
                this.idb.addItems('infetList', results[0], _idProduit);
              if (results[1].length > 0)
                this.idb.addItems('checkRevelancy', results[1], _idProduit);

              return results;
            }),
            catchError((err) => {
              return this.handleError(err);
            })
          );
      }
    });
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
