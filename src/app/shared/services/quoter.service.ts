import { EcomService } from './ecom.service';
import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  doc,
  collection,
  runTransaction,
  writeBatch,
  serverTimestamp,
  FieldValue,
} from '@angular/fire/firestore';

import { DateFnsService, CookiesService } from 'src/app/shared/services';
import { CartItem, Quote, QuoteItem } from '../interfaces';
import { Query } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class QuoterService {
  private firestore: Firestore = inject(Firestore);

  constructor(
    private dateFns: DateFnsService,
    private cookiesSc: CookiesService,
    private ecomSc: EcomService
  ) {}

  async getQuoteNum(): Promise<number> {
    //  busco primero cual es el ultimo numero guardado
    return new Promise(async (res, rej) => {
      try {
        const quoteSettingsRef = doc(this.firestore, 'crm_settings', 'quotes');
        const num = await runTransaction(this.firestore, async tr => {
          const qSettings = await tr.get(quoteSettingsRef);
          if (!qSettings.exists()) {
            throw 'Document does not exist!';
          }
          const newCount: number = (qSettings.data()['counter'] += 1);
          tr.update(quoteSettingsRef, { counter: newCount });
          return newCount;
        });
        res(num);
      } catch (e) {
        rej(`Transaction failed: ${e}`);
      }
    });
  }

  buildQuoteForm(quoteObj: CartItem[], contactObj, num: number): Quote {
    const items = this.buildQuoteFormItems(quoteObj);
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.total;
    });
    const iva = this.ecomSc.round(subtotal * 0.21, 2);
    return {
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      calcIVA: 0.21,
      calcPIIBB: 0,
      currency: 'Pesos',
      date: this.dateFns.getFormatedDate(new Date(), 'yyyy-MM-dd'),
      iibb: 0,
      iva,
      name: contactObj.name,
      email: contactObj.email,
      phone: contactObj.phone,
      number: num,
      payment: 'Efectivo - Anticipado',
      salesman: 'Stizza Daniela',
      subtotal,
      origin: 'web',
      total: this.ecomSc.round(iva + subtotal, 2),
      items,
      project: null,
    } as Quote;
  }

  buildQuoteFormItems(quoteObj: CartItem[]): Array<QuoteItem> {
    const itemArr = [] as Array<QuoteItem>;

    quoteObj.forEach(item => {
      const prod = item.product;
      if (prod) {
        itemArr.push({
          code: prod.codigo,
          color: prod.color,
          currency: 'Pesos',
          description: prod.descripcion,
          discount: 0,
          price: prod.precioActual,
          finalPrice: prod.precioActual,
          quantity: item.totalQ,
          quantityNl: this.ecomSc.round(item.totalQ / prod.eq, 2),
          unit: prod.unidad,
          total: this.ecomSc.round(prod.precioActual * item.totalQ, 2),
        });
      }
    });
    return itemArr;
  }

  buildQueryObj(contactData, pspNum): Query {
    const cookieObj = this.cookiesSc.getCookieObj();
    const form: Query = {
      // date: this.db.timestamp,
      date: serverTimestamp(),
      email: contactData.email,
      interest: '',
      name: contactData.name,
      origin: 'automaticQuote',
      salesman: '',
      query: `Prespuesto N° ${pspNum}`,
      telephone: contactData.phone,
      status: 'Pendiente',
      ...cookieObj,
    };
    return form;
  }

  save(quote: Quote, query: Query) {
    return new Promise((res, rej) => {
      try {
        const batch = writeBatch(this.firestore);
        const setAuditObj = this.auditSetObject();

        // save psp with query  with a generated id

        const pspRef = doc(collection(this.firestore, 'crm_quotes'));
        quote.query = query;
        batch.set(pspRef, { ...quote, ...setAuditObj });

        // save query
        const queryRef = doc(collection(this.firestore, 'queries'));
        batch.set(queryRef, query);

        // save all
        res(batch.commit());
      } catch (err) {
        rej(err);
      }
    });
  }

  auditSetObject(): { createdAt: FieldValue; updatedAt: FieldValue } {
    return {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  auditUpdateObject(): { updatedAt: FieldValue } {
    return {
      updatedAt: serverTimestamp(),
    };
  }
}
