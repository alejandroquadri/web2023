import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CkApiService {
  url = 'https://api.convertkit.com/v3/';
  api_key = 'Tm6C6zi5XftVev5cbgc31g';
  api_secret = 'FsKmVxwmrcHExjxah7zmPIdwC5Zk7I1uuBNjGyZpCrg';
  quoteFormId = '3407886';
  newSuscribedTagId = '3947734'; // la id de la tag NewSuscribed

  constructor(private http: HttpClient) {}

  addToQuoteForm(email: string, first_name: string) {
    const options = {
      params: {
        api_key: this.api_key,
        email,
        first_name,
      },
    };
    return this.http.post(
      `${this.url}forms/${this.quoteFormId}/subscribe`,
      null,
      options
    );
  }

  addSuscribedTag(email: string, first_name: string) {
    const body = {
      api_key: this.api_key,
      email,
      first_name,
    };
    return this.http.post(
      `${this.url}tags/${this.newSuscribedTagId}/subscribe`,
      body
    );
  }
}
