import { Injectable, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Status404Guard implements CanActivate {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  canActivate(): boolean {
    this.redirectNotFound();
    return false;
  }

  redirectNotFound(): void {
    this.document.location.href =
      'https://erpquadri.herokuapp.com/api/notfoundHtml';
  }
}
