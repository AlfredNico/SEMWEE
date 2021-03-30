import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  refresh$ = new BehaviorSubject<boolean>(false);
  private subject = new Subject<any>();
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;
  // isVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isProjects = false;

  constructor(private http: HttpClient) { }

  public getAllProjects(_idUsers): Observable<Projects[]> {
    return this.http.get<Projects[]>(`${environment.baseUrl}/project/get-project/${_idUsers}`);
  }

  public addProjects(data: any) {
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/add-project`, data)
      .toPromise();
  }

  public editProjects(value: { _id: number, project: Projects }) {
    return this.http.put<{ message: string }>(`${environment.baseUrl}/project/update-project/${value._id}`, value).pipe(
      tap(() => {
        console.log('edit');
        this.subject.next();
        this.invokeFirstComponentFunction.emit();
      })
    )
  }

  uploadFiles(file: File) {
    const formData: FormData = new FormData();
    formData.append('image_project', file);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/get-project-img`, formData);
  }

  public deleteProjects(project_id: string) {
    return this.http.delete<{ message: string }>(`${environment.baseUrl}/project/delete-project/${project_id}`);
  }

  // sendClickEvent() {
  //   this.subject.next();
  // }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}