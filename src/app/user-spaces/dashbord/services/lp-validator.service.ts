import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LpValidatorService {

  public dataView: { columns: string[], data: [] } = { columns: ['select'], data: []};

  constructor(private http: HttpClient) { }

  public sendFile(files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    return this.http.post<{ message: string, nameFile: string }>(`${environment.URL_API}/validator/all-fast-csv`, formData).toPromise();
  }
  public getUpload(nameFile: any) {
    const params = new HttpParams().set('nameFile', nameFile);
    return this.http.get<any[]>(`${environment.URL_API}/validator/get-all-fast-csv`, { params: params }).toPromise();
  }
  // public sendFile(files: File) {
  //   const formData: FormData = new FormData();
  //   formData.append('files', files);

  //   return this.http.post<{message: string}>(`${environment.URL_API}/validator/all-fast-csv`, formData).pipe(
  //     mergeMap(() => this.http.get<any[]>(`${environment.URL_API}/validator/get-all-fast-csv`))
  //   )
  //   .toPromise();
  // }
}
