import { PropertyType } from './../interfaces/property-value';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertyValueService {
  constructor(private http: HttpClient) {}

  public appyPropertyValue(data: PropertyType) {
    return this.http
      .put<{ message: string }>(
        `${environment.baseUrl}/validator/put-item-property`,
        data
      )
      .toPromise();
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
