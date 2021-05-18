import { IdbService } from './../../../services/idb.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { environment } from '@environments/environment';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LpValidatorService {
  public matching: DataTypes = {
    displayColumns: [],
    hideColumns: [],
    data: [],
  };

  public progressBarValue: number = 0;
  public trigger$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private readonly idb: IdbService) { }

  public getUpload(idProjet: string, files: File) {
    const formData: FormData = new FormData();
    formData.append('files', files);

    return this.http
      .post<DataTypes>(
        `${environment.baseUrl}/validator/import-csv/${idProjet}`,
        formData
      )
      .pipe(
        map((results: any) => {
          this.idb.addItems('infetList', results, idProjet);
          const head: string[] = Object.keys(results[0]);
          if (head.indexOf('select') !== -1) {
            head.splice(head.indexOf('select'), 1);
          }

          head.unshift('number', 'select');
          return {
            displayColumns: head,
            data: results,
            hideColumns: [],
          };
        }),
        catchError((err) => {
          return this.handleError(err);
        })
      )
      .toPromise();
  }

  private searchItem(
    _id: any,
    dataSources: any[],
    data: any,
    assign: Function
  ) {
    return this.http
      .get<any>(`${environment.baseUrl}/validator/search-item/${_id}`)
      .pipe(
        map((result: any) => {
          if (result) {
            const tmp = {
              Valid: result.valid,
              Popular_Search_Queries: result.psq,
              Website_Best_Position: result.webSitePosition,
            };
            data[result._id] = tmp;
            assign(this.converDataMatching(dataSources, data, true));
          }
        }),
        catchError((err) => {
          return this.handleError(err);
        })
      )
      .toPromise();
  }

  public searchAllItem(dataSources: any[], data: any, assign: Function) {
    return dataSources.map((value: any, index: number) => {
      if (value.Valid == undefined || value.Valid == 'loadingQuery') {
        this.searchItem(value._id, dataSources, data, assign);

        /*  progress bar value */
        this.progressBarValue =
          (((index + 1) as number) * 100) / dataSources.length - 1;
        this.trigger$.next(true);
      }
      return { ...value };
    });
  }

  public postInferList(idProjet: any, value: any) {
    return this.http
      .post<{ displayColumns: string[]; hideColumns: string[]; data: [] }>(
        `${environment.baseUrl}/validator/post-infer-list`,
        value
      )
      .pipe(
        map((results: any) => {
          this.idb.addItems('checkRevelancy', results, idProjet);
          const headers = [
            'number',
            'select',
            'List_Page_Label',
            'Number_of_Item',
            'List_Page_Main_Query',
            'Item_Type',
            '_1st_Property',
            '_2nd_Property',
            '_3rd_Property',
            '_4th_Property',
            '_5th_Property',
            'Property_Schema',
            '_id',
            'idProduct',
          ];
          return {
            displayColumns: headers,
            data: results,
            hideColumns: [],
          };
        }),
        catchError((err) => {
          return this.handleError(err);
        })
      )
      .toPromise();
  }

  public handleError(error) {
    console.log(error);
    return throwError(error);
  }

  public converDataMatching(
    dataSurces: any[],
    obj: any = {},
    afterSearch: boolean = false
  ): DataTypes {
    console.log('data', dataSurces)
    const headers = [
      'number',
      'select',
      'Valid',
      'List_Page_Label',
      'Popular_Search_Queries',
      'Number_of_Items',
      'List_Page_Main_Query',
      'Website_Best_Position',
      'Item_Type',
      '_1st_Property',
      '_2nd_Property',
      '_3rd_Property',
      '_4th_Property',
      '_5th_Property',
      'property_Schema',
      '_id',
      'idProduct',
    ];

    let dataValue: any[] = [];
    dataSurces.map((values: any) => {
      // Object.keys(values).map((key: string, index: number) => {
      //   //console.log(key, index);
      //   if (!this.matching.displayColumns.includes(key)) {
      //     if (index === 0)
      //       this.matching.displayColumns.push('select', columnAdd[0]);
      //     if (index === 1) this.matching.displayColumns.push(columnAdd[1]);
      //     if (index === 3) this.matching.displayColumns.push(columnAdd[2]);

      //     this.matching.displayColumns.push(key);
      //   }
      // });

      if (values['select'] === true) {
        const tmp =
          obj[values['_id']] != undefined
            ? obj[values['_id']]
            : {
              Valid: 'loadingQuery',
              Popular_Search_Queries: 'loadingQuery',
              Website_Best_Position: 'loadingQuery',
            };
        // if (afterSearch && obj[values['_id']] == undefined) {
        //   tmp = { 'Valid': false, 'Popular Search Queries': 0, 'Website Browser': 0 }
        // }
        //console.log(obj[values['idProduct']] + " : ", tmp);

        dataValue.push({ ...values, ...tmp });
      }
    });

    return (this.matching = {
      displayColumns: headers,
      hideColumns: [],
      data: dataValue,
    });
  }
}
