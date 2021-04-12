import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TuneItService {

  constructor(private http: HttpClient) { }

   public appy( data: any, _id?: any) {
     if (!_id) {
       return this.http
         .post(
           `${environment.baseUrl}/validator/post-item-type`,data
         ).toPromise();
     }else {
        return this.http
         .put(
           `${environment.baseUrl}/validator/put-item-type/${_id}`,data
         ).toPromise();
     }
  }

  public getTuneIt(_id){
      return this.http
         .get(
           `${environment.baseUrl}/validator/get-item-type/${_id}`,
         ).toPromise();
  }

   public deleteTuneIt(_id){
      return this.http
         .get<{ message: string }>(
           `${environment.baseUrl}/validator/delete-item-type/${_id}`,
         ).toPromise();
  }

}

  // CRUD ItemType
// router.get("/get-item-type/:idItemtypeInferlist",auth.authentification,TuneitCtrl.getItemtype);
// router.post("/post-item-type",auth.authentification,TuneitCtrl.postItemtype);
// router.put("/put-item-type/:itemtype_id",auth.authentification,TuneitCtrl.putItemtype);
// router.delete("/delete-item-type/:itemtype_id",auth.authentification,TuneitCtrl.deleteItemtype);

// tuneItItemtype :

// Editspelling: { type: String, default: '' },
// Synonimyze: { type: String, default: '' },
// Editsynonimize: { type: String, default: '' },
// idinferlist: {type: Schema.Types.ObjectId, required: true, ref: 'Inferlist' },


// tuneItPropertyValue :

// NomProperty : { type: String, default: '' },
// Editspelling: { type: String, default: '' },
// Synonimyze: { type: String, default: '' },
// Editsynonimize: { type: String, default: '' },
// SemanticScope : { type: String, default: '' },
// Apply_on_the_colum : { type: Boolean, default: false },
// Apply_on_the_table : { type: Boolean, default: false },
// idinferlist: {type: Schema.Types.ObjectId, required: true, ref: 'Inferlist' },
