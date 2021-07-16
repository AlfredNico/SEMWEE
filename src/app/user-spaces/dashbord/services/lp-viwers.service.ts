import { CommonService } from '@app/shared/services/common.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LPAllProjects } from '../interfaces/lp-viewer-projects';

@Injectable({
  providedIn: 'root',
})
export class LpViwersService {
  public dataSources$ = new BehaviorSubject<any>([]);

  public itemsObservables$ = new BehaviorSubject<any>(undefined);
  public data$ = new BehaviorSubject<any>(undefined);
  public isLoading$ = new BehaviorSubject<boolean>(true);
  public checkInfoSubject$ = new Subject();
  public isloadingHistory = new Subject<boolean>();

  //Numriéque facet components
  public numeriqueFaceteBehavior$ = new BehaviorSubject<any>(undefined);
  public numeriqueFacete: any[] = [];

  constructor(
    private http: HttpClient,
    private readonly common: CommonService
  ) {
    this.isLoading$.subscribe((res) => {
      if (res === true) {
        this.common.showSpinner('table', true, '');
      } else {
        this.common.hideSpinner('table');
      }
    });
  }

  public getAllProjects(_idUsers): Observable<LPAllProjects[]> {
    return this.http.get<LPAllProjects[]>(
      `${environment.baseUrl}/lpviewer/get-project-lpviewer/${_idUsers}`
    );
  }

  public getSavedProjects(idProject): Observable<any> {
    return this.http
      .get(`${environment.baseUrl}/lpviewer/get-permalink/${idProject}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  upload(file: File, idUser: any): Observable<any> {
    const data = new FormData();
    data.append('files', file);
    return this.http
      .post(`${environment.baseUrl}/lpviewer/post-lpviewer/${idUser}`, data)
      .pipe(map((result) => result));
  }

  sendProjectNames(value: {
    idUser: any;
    ProjectName: string;
    sizefile: any;
    headers: any[];
  }): Observable<{ idProject: any }> {
    return this.http.post<{ idProject: any }>(
      `${environment.baseUrl}/lpviewer/post-project`,
      value
    );
  }

  sendFiles(
    value: {
      idProject: any;
      fileData: any;
      namehistory: string;
      idHeader: number;
      header: string[];
    },
    idname: any
  ) {
    const data = {
      data: value.fileData,
      name: value.namehistory,
      idHeader: value.idHeader,
      idName: idname,
      header: value.header,
    };
    return this.http.post(
      `${environment.baseUrl}/lpviewer/to-history/${value.idProject}`,
      data
    );
  }

  public addFacetFilter(value: { idProject: any; value: string }) {
    return this.http.post(
      `${environment.baseUrl}/lpviewer/post-parametre-lpviewer`,
      value
    );
  }

  public addFilter(value: { idProject: any; value: any }) {
    return this.http.post(
      `${environment.baseUrl}/lpviewer/post-parametre-lpviewer2`,
      value
    );
  }

  public postDisplayColums(idproject, _idHeader: any, header: string[]) {
    return this.http.post(
      `${environment.baseUrl}/lpviewer/put-lpviewer-header/${idproject}/${_idHeader}`,
      header
    );
  }

  // public getAllHistoryName(idProject): Observable<LPViewerHistory[]> {
  //   return this.http.get<LPViewerHistory[]>(
  //     `${environment.baseUrl}/lpviewer/get-history-name/${idProject}`
  //   );
  // }

  public getOnedateHistory(value: any): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}/lpviewer/get-One-data-history/${value.idProject}/${value.idName}`
    );
  }

  public getHeaderExport(idProject: any, idHeader: any): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}/lpviewer/get-lpviewer-header/${idProject}/${idHeader}`
    );
  }

  public getTestApi(value : File){
    const data = new FormData();
    data.append('files', value);
    return this.http.post<any>(`${environment.baseUrl}/lpviewer/get-test-lpviewer`, data);
  }
  // /get-One-data-history/:idProject/:idHistory
}
