import { Injectable } from '@angular/core';
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdbService {
  private _dataChange: Subject<any> = new Subject<any>();
  private _dbPromise!: Promise<IDBPDatabase<any>>;
  isCalled: boolean
  constructor() {
    if (!('indexedDB' in window)) {
      return;
    } else {
      this.connectToIDB();
    }
  }

  dataChanged(): Observable<any> {
    return this._dataChange;
  }

  public connectToIDB() {
    this._dbPromise = openDB('semwee', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('infetList'))
          db.createObjectStore('infetList', {
            keyPath: 'id',
          });
        if (!db.objectStoreNames.contains('checkRevelancy'))
          db.createObjectStore('checkRevelancy', {
            keyPath: 'id',
          });
      },
    });
  }

  public addItems(storeName: string, value: any[], id: any) {
    this._dbPromise
      .then((db: any) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        // this.getAllData(storeName).then((values: any) => {
        //   if (values.length > 1) {
        //     this.getItemIntoDB(storeName).then((res) => {
        //       if (res === id) {
        //         this.deleteItem(storeName, res);
        //       }
        //     });
        //   }
        // });
        store.add({ id, value });
        // this._dataChange.next(items);
        return tx.complete;
      })
      .then(function () {
        // console.log('added item to the store os!');
      })
      .catch((error) => {return throwError(error)});
  }

  public updateItems(storeName: string, value: any[], id: any) {
    this._dbPromise
      .then((db: any) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put({ id, value });
        return tx.complete;
      })
      .then(function () {})
      .catch((error) => {return throwError(error)});
  }

  getAllData(storeName: string) {
    return this._dbPromise
      .then((db: any) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return store.getAll();
      })
      .then((values: any) => {
        this._dataChange.next(values);
        return values;
      })
      .catch((error) => {return throwError(error)});
  }

  // demo1: Getting started
  getItemIntoDB(storeName: string): Promise<string> {
    return this._dbPromise
      .then((db: any) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        // return store.get("716ee6de-16aa-a2ab-e88b-dea57d4ae44a");
        return store.openCursor(null, 'prev');
      })
      .then((cursor) => {
        if (!cursor) {
          return;
        }
        return cursor && cursor.key;
      })
      .catch((error) => {return throwError(error)});
  }

  getItem(storeName: string, id: any): Promise<string> {
    return this._dbPromise
      .then((db: any) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return store.get(id);
      })
      .then((value) => {
        // console.log('values', value);
        return value;
      });
  }

  deleteItem(storeName: string, id?: any) {
    return this._dbPromise
      .then((db: any) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(id);
        return tx.complete;
      })
      .then(() => {
        // console.log('Item deleted');
      });
  }

  openCurson(storeName: string) {
    return this._dbPromise
      .then(function (db) {
        var tx = db.transaction(storeName, 'readonly');
        var store = tx.objectStore(storeName);
        return store.openCursor();
      })
      .then(function logItems(cursor: any) {
        if (!cursor) {
          return;
        }
        console.log('Cursored at:', cursor.key);
        for (var field in cursor.value) {
          console.log('max', cursor.value[field]);
        }
        return cursor.continue().then(logItems);
      })
      .then(function () {
        console.log('Done cursoring');
      });
  }

  getMaxKey = (db: any, storeName: string) =>
    new Promise((resolve, reject) => {
      this._dbPromise.then((db: any) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const openCursorRequest = store.openCursor(null, 'prev');
        openCursorRequest.onsuccess = () => {
          const cursor = openCursorRequest.result;
          resolve(cursor && cursor.key);
        };
        openCursorRequest.onerror = () => {
          reject(openCursorRequest.error);
        };
      });
    });

  // getItem(target: string) {
  //   return this._dbPromise
  //     .then((db: any) => {
  //       const tx = db.transaction(target, "readonly");
  //       const store = tx.objectStore(target);
  //       return store.openCursor(null, "prev");
  //     })
  //     .then((cursor) => {
  //       if (!cursor) {
  //         return;
  //       }
  //       const maxKey = cursor && cursor.key;
  //       console.log("max", maxKey);
  //       // return maxKey;
  //       const x = this.getMaxKey(this._dbPromise, target).then((max) => {
  //         console.log("max", max);
  //       });
  //     });
  // }
}
