import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LegalService {
  constructor() {}

  removeWhitespace(str) {
    return str
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  }
}
