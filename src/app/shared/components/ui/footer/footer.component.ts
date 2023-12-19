import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ICONS } from 'src/app/shared/constants';
import { Footer } from 'src/app/shared/copy';
import {
  LanguageService,
  CopyService,
  ServerDetectService,
  LayoutService,
  EcomService,
} from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  // @Input() data: any;
  // copy$: Observable<any>;
  copy = Footer;
  isEcom = environment.init.eCom;
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
    private layoutSc: LayoutService,
    private ecomSc: EcomService
  ) {
    this.addIcons();
    this.isEcom;
  }

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
    this.isMobile$ = this.layoutSc.detectMobile();
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

  mailTo() {
    return `mailto:${
      this.isEcom ? this.copy.email.eCom : this.copy.email.local
    }`;
  }

  callTo() {
    return `tel:${
      this.isEcom ? this.copy.callPhone.eCom : this.copy.callPhone.local
    }`;
  }
}
