import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';

import {
  LanguageService,
  SeoService,
  LayoutService,
  ServerDetectService,
  LanguageObj,
} from 'src/app/shared/services';
import {
  Landing,
  ProductMenu,
  TerrazzoArt,
  ThreeFeatures,
} from 'src/app/shared/copy';

// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';
import { environment } from 'src/environments/environment';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  fullCopy;
  lang: string;
  langObj: LanguageObj;
  imgs: any;
  init = true;
  wrapperHeight;
  eCom = environment.init.eCom;

  copy = Landing;
  prodCopy = ProductMenu;
  terrazzoArt = TerrazzoArt;
  threeFeatures = ThreeFeatures;

  constructor(
    private langSc: LanguageService,
    private seoSc: SeoService,
    public layoutSc: LayoutService,
    private serverDetSc: ServerDetectService,
    public platform: Platform,
    private router: Router
  ) {
    // this.isMobile$ = this.layoutSc.detectMobile();
  }

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.langObj = this.langSc.currentLangObj;
    this.setSeo();
  }

  setSeo() {
    const metaTags = {
      title: this.copy?.seo[this.lang].title,
      description: this.copy?.seo[this.lang].desc,
      slug: '',
    };
    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`/${this.lang}`);
  }

  toQuote() {
    this.router.navigate([`${this.lang}/quote`]);
  }

  toProd(product) {
    this.router.navigate([`${this.lang}/${product[this.lang].url}`]);
  }

  toTiles(tiles) {
    this.router.navigate([`${this.lang}/${tiles}`]);
  }

  toCol(col) {
    const colLang = this.lang === 'es' ? 'colecciones' : 'colections';
    if (col === 'collections') {
      this.router.navigate([`${this.lang}/${colLang}`]);
    } else {
      this.router.navigate([`${this.lang}/${colLang}/${col}`]);
    }
  }

  routeTo(url) {
    this.router.navigate([`${this.lang}/${url}`]);
  }

  isServer() {
    return this.serverDetSc.isServerSide();
  }

  isLocal() {
    return this.langObj.countrycode === 'AR';
  }
}
