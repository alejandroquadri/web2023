import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MPitem, MPshipments } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MpService {
  url = 'https://erp-api.quadri.com.ar/api/';
  // url = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  buyItem(items: Array<MPitem>, hasShipments: boolean) {
    const shipments = !hasShipments
      ? {}
      : ({
          mode: 'me2',
          local_pickup: true,
          dimensions: '22x13x9,3000',
          // free_methods: [],
          // free_methods_types: [],
        } as MPshipments);

    const body = {
      items,
      // shipments,
    };
    return this.http.post(`${this.url}buy`, body);
  }
}
