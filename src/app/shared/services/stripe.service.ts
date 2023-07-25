import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StripeItem } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  // url = 'https://erp-api.quadri.com.ar/api/';
  url = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  stripeCheckout(items: Array<StripeItem>) {
    const body = {
      items,
    };
    console.log(body);
    return this.http.post(`${this.url}stripe-checkout`, body);
  }
}
