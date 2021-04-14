import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PropertyValue } from '../interfaces/property-value';

@Injectable({
  providedIn: 'root',
})
export class PropertyValueService {
  constructor(private http: HttpClient) {}

  public appyPropertyValue(
    data: PropertyValue,
    _id?: any
  ): Promise<{ message: string }> {
    if (_id === undefined) {
      return this.http
        .post<{ message: string }>(
          `${environment.baseUrl}/validator/post-item-property`,
          data
        )
        .toPromise();
    } else {
      console.log('edit');
      return this.http
        .put<{ message: string }>(
          `${environment.baseUrl}/validator/put-item-property/${_id}`,
          data
        )
        .toPromise();
    }
  }

  public getPropertyValue(_id: any, propertName: string) {
    return this.http
      .get(
        `${environment.baseUrl}/validator/get-item-property/${_id}/${propertName}`
      )
      .toPromise();
  }

  public deletePropertyValue(_id: any) {
    return this.http
      .get<{ message: string }>(
        `${environment.baseUrl}/validator/delete-item-property/${_id}`
      )
      .toPromise();
  }
}

// /CRUD ItemPropertyValue
// router.get("/get-item-property/:idinferlist/:iditemproperty",auth.authentification,TuneitCtrl.getItemproperty);
// router.post("/post-item-property",auth.authentification,TuneitCtrl.postItemproperty);
// router.put("/put-item-property/:itemtype_id_property",auth.authentification,TuneitCtrl.putItemproperty);
// router.delete("/delete-item-property/:itemtype_id_property",auth.authentification,TuneitCtrl.deleteItemproperty);
