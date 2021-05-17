import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LpEditorService {

  public itemsObservables$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) { }

  getAllData(params: HttpParams) {
    return this.http.get(`${environment.baseUrl}/validator/-getimport-viewer`, { params });
  }

  upload(file: File): Observable<any> {
    const data = new FormData()
    data.append('file', file)
    return this.http.post(`${environment.baseUrl}/validator/import-viewer`, data)
      .pipe(
        map(result => {
          const header = Object.keys(result[0]);
          // header.unshift('star', 'flag', 'number');
          header.unshift('all');
          return {
            columns: header,
            data: result
          }
        })
      )
  }
}
