import { Injectable } from '@angular/core';
import { CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { LanguageService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class LanguageGuard implements CanActivateChild {
  constructor(private langSc: LanguageService) {}

  canActivate(state: RouterStateSnapshot) {
    console.log(state.url[0]['path']);
    return true;
  }

  async canActivateChild() {
    return this.checkLangObj();
  }

  async checkLangObj(): Promise<boolean> {
    // if (!this.langSc.currentLangObj) {
    //   await this.langSc.setLang();
    // }
    return new Promise((res, rej) => res(true));
  }
}
