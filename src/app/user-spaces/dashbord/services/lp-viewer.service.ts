import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LPAllProjects } from '../interfaces/lp-viewer-projects';

@Injectable({
  providedIn: 'root',
})
export class LPViewerProjectsService {
  refresh$ = new BehaviorSubject<boolean>(false);
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  public trigrer$ = new BehaviorSubject<boolean>(false);
  public subject = new Subject<any>();
  public currentSubject = this.subject.asObservable();
  isProjects = false;

  constructor(
    private http: HttpClient
  ) { }

  public getAllProjects(_idUsers): Observable<LPAllProjects[]> {
    return this.http.get<LPAllProjects[]>(
      `${environment.baseUrl}/lpviewer/get-project-lpviewer/${_idUsers}`
    ).pipe(
      map(projects => {
        return projects;
      }))
  }

  public deleteProjects(project_id: string) {
    return this.http.delete<{ message: string }>(
      `${environment.baseUrl}/lpviewer/delete-lpviewer/${project_id}`
    );
  }

  // public addProjects(data: any) {
  //   return this.http
  //     .post<{ message: string }>(
  //       `${environment.baseUrl}/project/add-project`,
  //       data
  //     )
  //     .toPromise();
  // }

  // public editProjects(value: { _id: number; project: Projects }) {
  //   return this.http.put<{ message: string }>(
  //     `${environment.baseUrl}/project/update-project/${value._id}`,
  //     value
  //   );
  // }

  // uploadFiles(file: File) {
  //   const formData: FormData = new FormData();
  //   formData.append('image_project', file);
  //   return this.http.post<{ message: string }>(
  //     `${environment.baseUrl}/project/get-project-img`,
  //     formData
  //   );
  // }

  // uploadImages(file: File) {
  //   const formData: FormData = new FormData();
  //   formData.append('image_project', file);
  //   return this.http
  //     .post<{ img: string }>(
  //       `${environment.baseUrl}/project/get-project-img`,
  //       formData
  //     )
  //     .toPromise();
  // }

  // public deleteProjects(project_id: string) {
  //   return this.http.delete<{ message: string }>(
  //     `${environment.baseUrl}/project/delete-project/${project_id}`
  //   );
  // }

  // public deleteCatalogue(project_id: string) {
  //   return this.http.delete<{ message: string }>(
  //     `${environment.baseUrl}/validator/delete-product/${project_id}`
  //   );
  // }

  // checkProjectName(isAddItem: boolean, project?: Projects): AsyncValidatorFn {
  //   return (
  //     control: AbstractControl
  //   ): Observable<{ [key: string]: any } | null> => {
  //     const val = {
  //       nameProject: control.value,
  //       idUser: this.auth.currentUserSubject.value['_id'],
  //     };

  //     if (isAddItem === true) {
  //       return this.http
  //         .get(`${environment.baseUrl}/project/checkProject/${val.idUser}/${control.value}`)
  //         .pipe(
  //           map((res: any) =>
  //             (res.message && isAddItem) === true ? { projectName: true } : null
  //           ),
  //           catchError(() => of(null))
  //         );
  //     } else {
  //       return this.http
  //         .get(
  //           `${environment.baseUrl}/project/checkProjectUpdate/${project['user_id']}/${control.value}/${project['_id']}`
  //         )
  //         .pipe(
  //           map((res: any) =>
  //             res.message === true ? { projectName: true } : null
  //           ),
  //           catchError(() => of(null))
  //         );
  //     }
  //   };
  // }
}
