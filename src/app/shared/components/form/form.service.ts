import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  doc,
  collection,
  serverTimestamp,
} from '@angular/fire/firestore';

import { Query } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  // saveQueryV(query) {
  //   const form: Query = {
  //     salesman: '',
  //     date: this.db.timestamp,
  //     status: 'Pendiente',
  //     ...query,
  //   };
  //   return this.db.add<Query>('queries', form);
  // }

  saveQuery(query) {
    const form: Query = {
      salesman: '',
      date: serverTimestamp(),
      status: 'Pendiente',
      ...query,
    };

    return addDoc(collection(this.firestore, 'queries'), form);
  }

  getId() {
    return doc(collection(this.firestore, 'queries')).id;
  }
}
