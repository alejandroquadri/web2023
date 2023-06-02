import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ICONS } from 'src/app/shared/constants';
import { Footer } from 'src/app/shared/copy';
import {
  LanguageService,
  CopyService,
  ServerDetectService,
  LayoutService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  // @Input() data: any;
  // copy$: Observable<any>;
  copy = Footer;
  isMobile$: Observable<boolean>;
  lang: string;
  icons = ICONS;
  ig;
  fb;
  pin;

  constructor(
    private langSc: LanguageService,
    private copySc: CopyService,
    private serverDetSc: ServerDetectService,
    private layoutSc: LayoutService
  ) {
    this.addIcons();
  }

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
    this.isMobile$ = this.layoutSc.detectMobile();
    // this.getCopy();
    // this.copy = this.copySc.initCopy.footer;
  }

  getCopy() {
    // this.copy$ = this.copySc.getCopyStd('footer');
  }

  addIcons() {
    const isServer = this.serverDetSc.isServerSide();
    this.ig = this.copySc.registerIcon(this.icons.ig, 'instagram', isServer);
    this.fb = this.copySc.registerIcon(this.icons.fb, 'facebook', isServer);
    this.pin = this.copySc.registerIcon(
      this.icons.pinterest,
      'pinterest',
      isServer
    );
  }

  shouldShow(item) {
    if (!item.countries) {
      return true;
    } else {
      return item.countries.includes(this.langSc.currentLangObj.countrycode);
    }
  }

  // addIcons() {
  //   const p = this.getPath();
  //   console.log(p);
  //   const isServer = isPlatformServer(this.platformId);
  //   this.ig = this.copySc.registerIcon(`${p}${this.icons.ig}`, 'instagram', isServer);
  //   this.fb = this.copySc.registerIcon(`${p}${this.icons.fb}`, 'facebook', isServer);
  //   this.pin = this.copySc.registerIcon(`${p}${this.icons.pinterest}`, 'pinterest', isServer);
  // }

  // getPath() {
  //   return this.serverDetSc.isServerSide() ? 'http://localhost:4200/' : '';
  // }
}
