import { Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ServerDetectService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  // true si estoy usando angular de manera convencional
  isBrowserSide() {
    return isPlatformBrowser(this.platformId);
  }

  // true si estoy cargando angular con pre-renderer
  isServerSide() {
    return isPlatformServer(this.platformId);
  }
}
