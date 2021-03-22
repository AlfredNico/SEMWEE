import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Projects } from '../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  public getAllProjects(): Observable<Projects[]> {
    return this.http.get<Projects[]>(`${environment.baseUrl}/project/get-project`);
  }

  public addProjects(data: any) {
    console.log(data);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/add-project`, data).pipe(
      map(result => {
        console.log('result ', result)
        return result;
      })
    ).toPromise();
  }

  public editProjects(_id: string) {
    return this.http.put<{ message: string }>(`${environment.baseUrl}/project/update-project`, _id);
  }

  uploadFiles(file: File) {
    const formData: FormData = new FormData();
    formData.append('image_project', file);
    return this.http.post<{ message: string }>(`${environment.baseUrl}/project/get-project-img`, formData);
  }

  public deleteProjects(project_id: number) {
    return this.http.delete<{message: string}>(`${environment.baseUrl}/project/delete-project/${project_id}`);
  }
}