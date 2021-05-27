import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { CommonService } from '@app/shared/services/common.service';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LPAllProjects } from '../interfaces/lp-viewer-projects';

@Injectable({
  providedIn: 'root',
})
export class LpEditorService {
  /* Emittter value from clicked USER */
  public itemsObservables$ = new BehaviorSubject<any>(undefined);
  /* Emittter value dataSources after filter USER */
  public dataSources$ = new BehaviorSubject<any>(undefined);

  refresh$ = new BehaviorSubject<boolean>(false);
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  public trigrer$ = new BehaviorSubject<boolean>(false);
  public subject = new Subject<any>();
  public currentSubject = this.subject.asObservable();
  isProjects = false;

  public isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private readonly common: CommonService
  ) {
    this.isLoading$.subscribe(res => {
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
    ).pipe(
      map(projects => {
        return projects;
      }))
  }

  public deleteOneProjects(project_id: string) {
    return this.http.delete<{ message: string }>(
      `${environment.baseUrl}/lpviewer/delete-lpviewer/${project_id}`
    );
  }

  getAllData(params: HttpParams) {
    return this.http.get(`${environment.baseUrl}/validator/-getimport-viewer`, {
      params,
    });
  }

  upload(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    return this.http
      .post(`${environment.baseUrl}/validator/import-viewer`, data)
      .pipe(
        map((result) => {
          const header = Object.keys(result[0]);
          // header.unshift('star', 'flag', 'number');
          header.unshift('all');
          return {
            columns: header,
            data: result,
          };
        })
      );
  }

  uploadNewContent(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    return this.http
      .post(`${environment.baseUrl}/validator/new-content`, data)
      .pipe(
        map((result) => {
          const header = Object.keys(result[0]);
          // header.unshift('star', 'flag', 'number');
          header.unshift('all');
          return {
            columns: header,
            data: result,
          };
        })
      );
  }

  public getSavedProjects(idProject): Observable<LPAllProjects[]> {
    return this.http.get<any>(
      `${environment.baseUrl}/lpviewer/get-permalink/${idProject}`
    );
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

  sendFiles(value: { idProject: any; fileData: any }) {
    const data = value.fileData;
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

  public putDisplayColums(_idHeader: any, header: string) {
    return this.http.put(
      `${environment.baseUrl}/lpviewer/put-lpviewer-header/${_idHeader}`,
      header
    );
  }
}
