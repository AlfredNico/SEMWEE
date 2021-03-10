import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { ConvertUploadFileService } from './convert-upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class LpValidatorService {

  public data: { displayColumns: string[], hideColumns: string[], data: any[] } = { displayColumns: ['select'], hideColumns: [], data: [] };

  constructor(private http: HttpClient, private fakeData: ConvertUploadFileService) { }

  public sendFile(files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    // return this.http.post<{ message: string, nameFile: string }>(`${environment.URL_API}/validator/all-fast-csv`, formData);
    return this.http.post<{message: string, nameFile: string}>(`${environment.URL_API}/validator/all-fast-csv`, formData).toPromise();
  }

  public getUpload(value: {file: string}) {
    console.log(value);
    
    // const params = new HttpParams().set('nameFile', file);
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.URL_API}/validator/post-one-fast-csv`, value).pipe(
      map((result: any) => {
        console.log('result', result);
        
        let dataValue: any[] = [];

        result.map((value: any) => {
          Object.keys(value).map((key: string, index: number) => {
            // console.log(key, index);
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
      })
    );
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
