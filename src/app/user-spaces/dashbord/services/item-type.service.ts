import { ItemType } from './../interfaces/item-type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemTypeService {
  constructor(private http: HttpClient) {}
  public appygItemType(data: ItemType) {
    return this.http
      .put<{ message: string }>(
        `${environment.baseUrl}/validator/put-item-type`,
        data
      )
      .toPromise();
  }

  public getItemType(_id: any) {
    return this.http
      .get(`${environment.baseUrl}/validator/get-item-type/${_id}`)
      .toPromise();
  }

  public deletegetItemType(_id: any) {
    return this.http
      .get<{ message: string }>(
        `${environment.baseUrl}/validator/delete-item-type/${_id}`
      )
      .toPromise();
  }
}

// // CRUD ItemType
// router.get("/get-item-type/:idItemtypeInferlist",auth.authentification,TuneitCtrl.getItemtype);
// router.post("/post-item-type",auth.authentification,TuneitCtrl.postItemtype);
// router.put("/put-item-type/:itemtype_id",auth.authentification,TuneitCtrl.putItemtype);
// router.delete("/delete-item-type/:itemtype_id",auth.authentification,TuneitCtrl.deleteItemtype);
