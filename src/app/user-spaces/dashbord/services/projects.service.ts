import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  refresh$ = new BehaviorSubject<boolean>(true);
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
    this.refresh$.next(false)
    return this.http.put<{ message: string }>(`${environment.baseUrl}/project/update-project/${value._id}`, value)
  }

  uploadFiles(file: File) {
    const formData: FormData = new FormData();
    formData.append('image_project', file);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/get-project-img`, formData);
  }

  public deleteProjects(project_id: string) {
    return this.http.delete<{ message: string }>(`${environment.baseUrl}/project/delete-project/${project_id}`);
  }
}