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

  constructor(private http: HttpClient) {}

  public getAllProjects(_idUsers): Observable<LPAllProjects[]> {
    return this.http
      .get<LPAllProjects[]>(
        `${environment.baseUrl}/lpviewer/get-project-lpviewer/${_idUsers}`
      )
      .pipe(
        map((projects) => {
          return projects;
        })
      );
  }

  public deleteProjects(project_id: string) {
    return this.http.delete<{ message: string }>(
      `${environment.baseUrl}/lpviewer/delete-lpviewer/${project_id}`
    );
  }
}
