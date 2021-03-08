import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http: HttpClient) { }

  public sendFile(files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    return this.http.post<{ message: string }>(`${environment.URL_API}/validator/all-fast-csv`, formData).toPromise();
  }
  public getUpload(){
    return this.http.get<any[]>(`${environment.URL_API}/validator/get-all-fast-csv`).toPromise();
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
