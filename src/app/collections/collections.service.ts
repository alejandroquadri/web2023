import { Injectable } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  constructor(private afd: Database) {}

  // getPrices() {
  //   return this.db.getObject(`newWeb/webPrices`);
  // }

  getPrices() {
    return objectVal(ref(this.afd, 'newWeb/webPrices'));
  }
}
