import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Database, objectVal, ref, listVal } from '@angular/fire/database';

import { Color } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LookbookService {
  constructor(private afd: Database) {}

  // getColorsV(): Observable<Record<string, Color>> {
  //   return this.db.getObject(`newWeb/colors`);
  // }

  // getLookbookV() {
  //   return this.db.getObject(`newWeb/lookbook`);
  // }

  getColors(): Observable<Record<string, Color>> {
    return objectVal(ref(this.afd, 'newWeb/colors'));
  }

  getLookbook() {
    return listVal(ref(this.afd, 'newWeb/lookbook'));
  }
}
