import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { UrlParser, CollectionUrlParser } from '../constants';
import { Collections } from 'src/app/shared/copy';

@Injectable({
  providedIn: 'root',
})
export class NotFoundGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let allow = false;
    const id = route.paramMap.get('id');
    const col = route.paramMap.get('collection');
    if (id) {
      const parser = UrlParser;
      if (parser[id]) {
        allow = true;
      }
    }
    if (col) {
      const collections = Collections;
      const colParser = CollectionUrlParser;
      const colId = colParser[col] ? colParser[col] : col;
      if (colId === 'all' || collections[colId]) {
        allow = true;
      }
    }
    if (allow) {
      return true;
    } else {
      this.router.navigate(['not-found']);
      return false;
    }
  }
}
