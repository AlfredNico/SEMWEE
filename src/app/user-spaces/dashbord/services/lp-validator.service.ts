import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '@app/shared/services/common.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ConvertUploadFileService } from './convert-upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class LpValidatorService {

  public data: DataTypes = { displayColumns: ['select'], hideColumns: [], data: [] };

  public matching: DataTypes = { displayColumns: [], hideColumns: [], data: [] };

  public inferListData: { displayColumns: any[], hideColumns: any[], data: any[] } = { displayColumns: [], hideColumns: [], data: [] };

  constructor(private http: HttpClient, private fakeData: ConvertUploadFileService, private common: CommonService) { }

  public getUpload(idProjet: string, files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    // const params = new HttpParams().set('nameFile', file);
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/import-csv/${idProjet}`, formData).pipe(
      map((result: any) => {
        if (result) {
          // return this.converDataSelected(result);
          let values = [];
          result.map((val: any) => {
            Object.keys(val).map((key: string, index: number) => {
              if (!this.data.displayColumns.includes(key)) {
                this.data.displayColumns.push(key);
              }
            })
            values.push({ ...val, 'select': true });
          });

          return this.data = {
            displayColumns: this.data.displayColumns,
            hideColumns: [],
            data: values
          };
        }
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    ).toPromise();
  }

  public postInferList(value: any) {
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/post-infer-list`, value)
      .pipe(
        map((result: any) => {
          if (result) {
            console.log('result', result);
            // return this.converData(result);
            let inferer: any[] = [];
            result.map((res: any) => {
              Object.keys(res).map((key: string, index: number) => {
                // console.log(key, index);
                if (!this.inferListData.displayColumns.includes(key)) {
                  this.inferListData.displayColumns.push(key);
                }
              })
              inferer.push({ ...res });
            });

            console.log('inferer', inferer);
            return this.inferListData = {
              displayColumns: this.inferListData.displayColumns,
              hideColumns: [],
              data: inferer
            };
          }

        }),
        catchError((err) => {
          return this.handleError(err);
        })
      ).toPromise()
  }

  public handleError(error) {
    console.log(error);
    return throwError(error);
  }

  private converDataSelected(dataSurces: any[]): DataTypes {
    let dataValue: any[] = [];
    dataSurces.map((value: any) => {
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

  private converData(dataSurces: any[]): DataTypes {
    let dataValue: any[] = [];
    dataSurces.map((result: any) => {
      Object.keys(result).map((key: string, index: number) => {
        // console.log(key, index);
        if (!this.inferListData.displayColumns.includes(key)) {
          this.inferListData.displayColumns.push(key);
        }
        dataValue.push({ ...result });
      })
    });

    return this.inferListData = {
      displayColumns: this.inferListData.displayColumns,
      hideColumns: [],
      data: dataValue
    };
  }

  public converDataMatching(dataSurces: any[]): DataTypes {
    const columnAdd: string[] = ['Valid', 'Popular Search Queries', 'Website Browser'];
    const obj = { 'Valid': 'loadingQuery', 'Popular Search Queries': 'loadingQuery', 'Website Browser': 'loadingQuery' };
    let dataValue: any[] = [];
    dataSurces.map((values: any) => {
      Object.keys(values).map((key: string, index: number) => {
        // console.log(key, index);
        if (!this.matching.displayColumns.includes(key)) {
          if (index === 0) {
            this.matching.displayColumns.push(columnAdd[0]);
          }
          if (index === 2) {
            this.matching.displayColumns.push(columnAdd[1]);
          }
          if (index === 3) {
            this.matching.displayColumns.push(columnAdd[2]);
          }

          this.matching.displayColumns.push(key);
        }
      });

      dataValue.push({ ...values, ...obj });
    });

    return this.matching = {
      displayColumns: this.matching.displayColumns,
      hideColumns: [],
      data: dataValue
    };
  }


}
