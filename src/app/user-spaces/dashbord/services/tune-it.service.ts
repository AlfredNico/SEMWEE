import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TuneItService {

  constructor(private http: HttpClient) { }

   public appy( data: any, _id?: any) {
     if (_id) {
       return this.http
         .post<{ message: string }>(
           `${environment.baseUrl}/post-item-type`,data
         )
     }else {
        return this.http
         .put<{ message: string }>(
           `${environment.baseUrl}/put-item-type/${_id}`,data
         )
     }
  }

  public getTuneIt(_id){
      return this.http
         .get<{ message: string }>(
           `${environment.baseUrl}/get-item-type/${_id}`,
         ).toPromise();
  }

   public deleteTuneIt(_id){
      return this.http
         .get<{ message: string }>(
           `${environment.baseUrl}/delete-item-type/${_id}`,
         ).toPromise();
  }



  // CRUD ItemType
// router.get("/get-item-type/:idItemtypeInferlist",auth.authentification,TuneitCtrl.getItemtype);
// router.post("/post-item-type",auth.authentification,TuneitCtrl.postItemtype);
// router.put("/put-item-type/:itemtype_id",auth.authentification,TuneitCtrl.putItemtype);
// router.delete("/delete-item-type/:itemtype_id",auth.authentification,TuneitCtrl.deleteItemtype);
}
