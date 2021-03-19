import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '@app/shared/services/common.service';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { ConvertUploadFileService } from './convert-upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class LpValidatorService {

  public data: { displayColumns: string[], hideColumns: string[], data: any[] } = { displayColumns: ['select'], hideColumns: [], data: [] };

  public inferListData: { displayColumns: string[], hideColumns: string[], data: any[] } = { displayColumns: ['select'], hideColumns: [], data: [] };

  constructor(private http: HttpClient, private fakeData: ConvertUploadFileService, private common: CommonService) { }

  public sendFile(files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);
    return this.http.post<{ message: string, nameFile: string }>(`${environment.baseUrl}/validator/import-csv`, formData).toPromise();
  }

  public getUpload(files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    // const params = new HttpParams().set('nameFile', file);
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: []}>(`${environment.baseUrl}/validator/import-csv`, formData).pipe(
      map((result: any) => {
        if (result) {
          console.log('1 : ', result);
          

          let dataValue: any[] = [];
          result['default'].map((value: any) => {
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
        }

      })
    ).toPromise();
  }

  public postInferList(value: any) {
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/post-infer-list`, value)
      .pipe(
        map((values: any) => {
          if (values) {
            let dataValue: any[] = [];
            values.map((result: any) => {
              Object.keys(result).map((key: string, index: number) => {
                // console.log(key, index);
                if (!this.inferListData.displayColumns.includes(key)) {
                  this.inferListData.displayColumns.push(key);
                }
              })
              dataValue.push({ ...result, 'select': true });
            });

            this.common.isLoading$.next(true);

            return this.inferListData = {
              displayColumns: this.inferListData.displayColumns,
              hideColumns: [],
              data: dataValue
            };
          }

        })
      ).toPromise()
  }


  public getInfterList() {
    return this.http.get<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/get-infer-list`).pipe(
      map((values: any) => {
        if (values) {
          let dataValue: any[] = [];
          values.map((result: any) => {
            Object.keys(result).map((key: string, index: number) => {
              // console.log(key, index);
              if (!this.inferListData.displayColumns.includes(key)) {
                this.inferListData.displayColumns.push(key);
              }
            })
            dataValue.push({ ...result, 'select': true });
          });

          this.common.isLoading$.next(true);

          return this.inferListData = {
            displayColumns: this.inferListData.displayColumns,
            hideColumns: [],
            data: dataValue
          };
        }

      })
    ).toPromise();
  }
}
