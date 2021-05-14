import { CommonService } from '@app/shared/services/common.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LpViwersService {

  public dataSources$ = new BehaviorSubject<any>([]);

  public itemsObservables$ = new BehaviorSubject<any>(undefined);
  public isLoading$ = new BehaviorSubject<boolean>(true);
  public checkInfoSubject$ = new Subject();

  constructor(private http: HttpClient, private readonly common: CommonService) {
    this.isLoading$.subscribe(res => {
      if (res === true) {
        this.common.showSpinner('table', true, '');
      } else {
        this.common.hideSpinner('table');
      }
    })
  }

  getAllData(params: HttpParams) {
    return this.http.get(`${environment.baseUrl}/validator/-getimport-viewer`, { params });
  }

  upload(file: File, idUser: any): Observable<any> {
    const data = new FormData()
    data.append('files', file)
    return this.http.post(`${environment.baseUrl}/lpviewer/post-lpviewer/${idUser}`, data)
      .pipe(
        map(result => {
          const header = Object.keys(result[0]);
          header.unshift('all');
          return {
            columns: header,
            data: result
          }
        })
      )
  }

}
