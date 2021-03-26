import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public refresh$ = new BehaviorSubject<boolean>(true);

  private user: Users;
  constructor(private http: HttpClient, private auth: AuthService) {
    this.user = this.auth.currentUserSubject.value;
  }

  public getAllProjects(_idUsers): Observable<Projects[]> {
    return this.http.get<Projects[]>(`${environment.baseUrl}/project/get-project/${_idUsers}`);
  }

  public addProjects(data: any) {
    console.log(data);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/add-project`, data).pipe(
      map(result => {
        tap(() => this.refresh$.next(false));
        return result;
      })
    )
      .toPromise();
  }

  public editProjects(value: { _id: number, project: Projects }) {
    this.refresh$.next(false)
    return this.http.put<{ message: string }>(`${environment.baseUrl}/project/update-project/${value._id}`, value).pipe(
      tap(() => this.refresh$.next(false))
    );
  }

  uploadFiles(file: File) {
    const formData: FormData = new FormData();
    formData.append('image_project', file);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/get-project-img`, formData);
  }

  public deleteProjects(project_id: string) {
    this.refresh$.next(false)
    return this.http.delete<{ message: string }>(`${environment.baseUrl}/project/delete-project/${project_id}`);
  }
}