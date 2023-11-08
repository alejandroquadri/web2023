import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StripeCustomerData, StripeItem } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  // url = 'https://erp-api.quadri.com.ar/api/';
  url = 'http://localhost:3000/api/';
  pricePerPallet = 450;
  boxesPerPallet = 32;

  constructor(private http: HttpClient) {}

  simpleCheckout(items: Array<StripeItem>) {
    const body = {
      items,
      shippingAomunt: this.calcShipping(items),
    };
    console.log(body);
    return this.http.post(`${this.url}simple-stripe-checkout`, body);
  }

  embeddedFormCheckout(items: Array<StripeItem>) {
    const body = {
      items,
      shippingAomunt: this.calcShipping(items),
    };
    console.log(body);
    return this.http.post(`${this.url}embedded-stripe-checkout`, body);
  }

  getSessionData(sessionId: string) {
    return this.http.get(`${this.url}session-status`, {
      params: { session_id: sessionId },
    });
  }

  mixedCheckout(items: Array<StripeItem>, customerData: StripeCustomerData) {
    const body = {
      items,
      customerData,
    };
    console.log(body);
    return this.http.post(`${this.url}mixed-stripe-checkout`, body);
  }

  createPaymentIntent(total): Observable<any> {
    console.log(total);
    total = total * 100;
    return this.http.post(`${this.url}create-payment-intent`, {
      total,
    });
  }

  calcShipping(items: Array<StripeItem>) {
    let totalBoxes = 0;
    items.forEach(item => {
      totalBoxes += item.quantity;
    });
    const pallets = Math.ceil(totalBoxes / this.boxesPerPallet);
    return pallets * this.pricePerPallet;
  }
}
