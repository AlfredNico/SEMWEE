import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
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

  private searchItem(_idProduit: any, dataSources: any[] , data: any,assign: Function){
    return this.http.get<any>(`${environment.baseUrl}/validator/search-item/`).pipe(
      map((result: any) => {
        if (result) {
          const tmp = { 'Valid': result.valid, 'Popular Search Queries': result.psq, 'Website Browser': result.webSitePosition };
          return data[result._id] = tmp;
          // assign(this.converDataMatching(dataSources,data));
        }
      }),
      catchError((err) => {
        return this.handleError(err);
      })
    ).toPromise();
  }

  public searchAllItem(dataSources: any[],data: any,assign: Function){
    return dataSources.map((value: any) => {
      if(value.Valid == undefined || value.Valid == 'loadingQuery'){
        this.searchItem(value._id,dataSources,data,assign).then(
          result => {
            value['Valid'] = result['Valid'];
            value['Popular Search Queries'] = result['Popular Search Queries'];
            value['Website Browser'] = result['Website Browser'];
          }
        )
      }
      return { ...value}
    });
  }

  public postInferList(value: any) {
    return this.http.post<{ displayColumns: string[], hideColumns: string[], data: [] }>(`${environment.baseUrl}/validator/post-infer-list`, value)
      .pipe(
        map((result: any) => {
          if (result) {
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

  public converDataMatching(dataSurces: any[],obj: any = {}): DataTypes {
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
      const tmp = obj[values['idProduct']] != undefined ? obj[values['idProduct']] : { 'Valid': 'loadingQuery', 'Popular Search Queries': 'loadingQuery', 'Website Browser': 'loadingQuery' }

      dataValue.push({ ...values, ...tmp });
    });

    return this.matching = {
      displayColumns: this.matching.displayColumns,
      hideColumns: [],
      data: dataValue
    };
  }


}
