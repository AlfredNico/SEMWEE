import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  refresh$ = new BehaviorSubject<boolean>(false);
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  public trigrer$ = new BehaviorSubject<boolean>(false);
  public subject = new Subject<any>();
  public currentSubject = this.subject.asObservable();
  // isVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isProjects = false;

  constructor(private http: HttpClient) {}

  public getAllProjects(_idUsers): Observable<Projects[]> {
    return this.http.get<Projects[]>(
      `${environment.baseUrl}/project/get-project/${_idUsers}`
    );
  }

  public addProjects(data: any) {
    return this.http
      .post<{ message: string }>(
        `${environment.baseUrl}/project/add-project`,
        data
      )
      .toPromise();
  }

  public editProjects(value: { _id: number; project: Projects }) {
    return this.http.put<{ message: string }>(
      `${environment.baseUrl}/project/update-project/${value._id}`,
      value
    );
  }

  uploadFiles(file: File) {
    const formData: FormData = new FormData();
    formData.append('image_project', file);
    return this.http.post<{ message: string }>(
      `${environment.baseUrl}/project/get-project-img`,
      formData
    );
  }

  uploadImages(file: File) {
    const formData: FormData = new FormData();
    formData.append('image_project', file);
    return this.http
      .post<{ img: string }>(
        `${environment.baseUrl}/project/get-project-img`,
        formData
      )
      .toPromise();
  }

  public deleteProjects(project_id: string) {
    return this.http.delete<{ message: string }>(
      `${environment.baseUrl}/project/delete-project/${project_id}`
    );
  }

  checkProjectName(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return of(['nico', 'zaho', 'john'].includes(control.value)).pipe(
        map((res) => (res ? { projectName: true } : null)),
        catchError(() => of(null))
      );

      // return this.http.post(`${environment.baseUrl}/project/delete-project`, {control}).pipe(
      //    map(res => (res ? { projectName : true} : null)),
      //    catchError(()=> of(null))
      // )
    };
  }
}
