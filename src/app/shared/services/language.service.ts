import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { CODES, DefaultLangObj } from '../constants';

export interface LanguageObj {
  ip?: string;
  registry?: string;
  countrycode: string;
  countryname?: string;
  asn?: any;
  spam?: boolean;
  tor?: boolean;
  city?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // currentLangObj: LanguageObj;
  // currentLang: string;
  // countryCodes = CODES;

  currentLangObj: LanguageObj = DefaultLangObj;
  currentLang = 'es';
  countryCodes = CODES;

  constructor(private http: HttpClient) {}

  getIp(): Observable<LanguageObj> {
    return this.http.get<LanguageObj>('https://iplist.cc/api').pipe(
      startWith(DefaultLangObj),
      map((ip: LanguageObj) => {
        this.currentLangObj = ip;
        // console.log('hay lang obj', this.currentLangObj);
        this.currentLang =
          this.countryCodes[this.currentLangObj.countrycode] || 'en';
        if (ip) {
          return ip;
        } else {
          return { countrycode: 'AR' };
        }
      })
    );
  }

  setLanguage(url) {
    const arrayUrl = url.split(/\//g);
    this.currentLang = arrayUrl[1];
    return arrayUrl[1];
  }

  setLang() {
    return firstValueFrom(this.getIp());
  }

  splitRoute(route: string): Array<string> {
    return route.split(/\//g);
  }

  camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  defLocale() {
    return this.currentLang === 'es' ? 'es' : 'en-US';
  }
}
