import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { CommonService } from '@app/shared/services/common.service';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConvertUploadFileService } from './convert-upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class LpValidatorService {

  public matching: DataTypes = { displayColumns: [], hideColumns: [], data: [] };

  constructor(private http: HttpClient) { }

  public getUpload(idProjet: string, files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    return this.http.post<DataTypes>(`${environment.baseUrl}/validator/import-csv/${idProjet}`, formData).pipe(
      map((results: any) => {
        let obj = {
          displayColumns: [] as string[],
          data: [] as any[],
          hideColumns: [] as string[]
        };

        obj.displayColumns = Object.keys(results[0]);
        obj.displayColumns.unshift('select');
        results.reduce((tbObj: any, td: any, index: number) => {
          obj.data[index - 1] = { ...td, 'select': true };
        });
        return obj;
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    ).toPromise();
  }

  private searchItem(_id: any, dataSources: any[], data: any, assign: Function) {
    return this.http.get<any>(`${environment.baseUrl}/validator/search-item/${_id}`).pipe(
      map((result: any) => {
        if (result) {
          const tmp = { 'Valid': result.valid, 'Popular Search Queries': result.psq, 'Website Browser': result.webSitePosition };
          data[result._id] = tmp;
          assign(this.converDataMatching(dataSources, data, true));
        }
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    ).toPromise();
  }

  public searchAllItem(dataSources: any[], data: any, assign: Function) {
    return dataSources.map((value: any) => {
      if (value.Valid == undefined || value.Valid == 'loadingQuery') {
        this.searchItem(value._id, dataSources, data, assign)
      }
      return { ...value }
    });
  }

  public postInferList(value: any) {
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/post-infer-list`, value)
      .pipe(
        map((results: any) => {
          let infer = {
            displayColumns: [] as string[],
            data: [] as any[],
            hideColumns: [] as string[]
          };

          infer.displayColumns = Object.keys(results[0]);
          results.reduce((tbObj: any, td: any, index: number) => {
            infer.data[index - 1] = td;
          });
          return infer;

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

  public converDataMatching(dataSurces: any[], obj: any = {}, afterSearch: boolean = false): DataTypes {
    const columnAdd: string[] = ['Valid', 'Popular Search Queries', 'Website Browser'];
    let dataValue: any[] = [];
    dataSurces.map((values: any) => {
      Object.keys(values).map((key: string, index: number) => {
        //console.log(key, index);
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
      var tmp = obj[values['_id']] != undefined ? obj[values['_id']] : { 'Valid': 'loadingQuery', 'Popular Search Queries': 'loadingQuery', 'Website Browser': 'loadingQuery' }
      // if (afterSearch && obj[values['_id']] == undefined) {
      //   tmp = { 'Valid': false, 'Popular Search Queries': 0, 'Website Browser': 0 }
      // }
      //console.log(obj[values['idProduct']] + " : ", tmp);
      dataValue.push({ ...values, ...tmp });
    });

    return this.matching = {
      displayColumns: this.matching.displayColumns,
      hideColumns: [],
      data: dataValue
    };
  }


}
