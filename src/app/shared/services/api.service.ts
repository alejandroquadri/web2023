import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://localhost:3000/api'; // proxi local

  constructor(private http: HttpClient) {}

  get(endpoint: string, params?: any) {
    console.log('busco este endpoint', endpoint);
    console.log('uso este url', `${this.url}/${endpoint}`);
    return this.http.get(`${this.url}/${endpoint}`, { params });
  }

  post(endpoint: string, body: any, options?: any) {
    return this.http.post(`${this.url}/${endpoint}`, body, options);
  }

  put(endpoint: string, body: any, options?: any) {
    return this.http.put(`${this.url}/${endpoint}`, body, options);
  }

  delete(endpoint: string, options?: any) {
    return this.http.delete(`${this.url}/${endpoint}`, options);
  }

  patch(endpoint: string, body: any, options?: any) {
    return this.http.put(`${this.url}/${endpoint}`, body, options);
  }
}
