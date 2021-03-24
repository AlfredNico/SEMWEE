import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/authentification/services/auth.service';
import { Users } from '@app/models/users';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private user: Users;
  constructor(private http: HttpClient, private auth: AuthService) {
    this.user = this.auth.currentUserSubject.value;
  }

  public getAllProjects(): Observable<Projects[]> {
    console.log('id ', this.user._id);

    return this.http.get<Projects[]>(`${environment.baseUrl}/project/get-project/${this.user._id}`);
  }

  public addProjects(data: any) {
    console.log(data);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/add-project`, data).pipe(
      map(result => {
        return result;
      })
    ).toPromise();
  }

  public editProjects(value: { _id: number, project: Projects }) {
    console.log(value);

    return this.http.put<{ message: string }>(`${environment.baseUrl}/project/update-project/${value._id}`, value);
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