import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LpViwersService {

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<any> {
    const data = new FormData()
    data.append('file', file)
    return this.http.post(`${environment.baseUrl}/validator/import-viewer`, data)
      .pipe(
        map(result => {
          return {
            columns: Object.keys(result[0]),
            data: result
          }
        })
      )
  }
}
