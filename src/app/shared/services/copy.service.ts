import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  initData;
  initCopy: any;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  getIcon(icon, name: string) {
    return this.iconRegistry.addSvgIconLiteral(
      name,
      this.sanitizer.bypassSecurityTrustHtml(icon)
    );
  }

  registerIcon(path, name, server?) {
    if (server) {
      this.iconRegistry.addSvgIconLiteral(
        name,
        this.sanitizer.bypassSecurityTrustHtml('<svg></svg>')
      );
    } else {
      this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(path)
      );
    }
    return name;
  }
}
