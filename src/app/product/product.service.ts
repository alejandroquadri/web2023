import { Injectable, inject } from '@angular/core';

import { Database, objectVal, ref } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private afd: Database) {}

  // getPricesV() {
  //   return this.db.getObject(`newWeb/webPrices`);
  // }

  getPrices() {
    const doc = ref(this.afd, 'newWeb/webPrices');
    return objectVal(doc);
  }
}
