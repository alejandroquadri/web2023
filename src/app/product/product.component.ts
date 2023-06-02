import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { combineLatest, Observable, map, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

import {
  LanguageService,
  SeoService,
  LayoutService,
  LanguageObj,
} from 'src/app/shared/services';
import { ProductService } from './product.service';
import { Products } from 'src/app/shared/copy';
import { UrlParser } from 'src/app/shared/constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  // animations: [matExpansionAnimations.bodyExpansion]
})
export class ProductComponent implements OnInit, AfterViewInit {
  // @ViewChild('accordionItem') accItem :CdkAccordionItem;

  lang: string;
  langObj: LanguageObj;
  copy$: Observable<any>;

  isMobile$: Observable<boolean>;
  prices$: Observable<any>;
  ids$: Observable<any>;

  copy;
  prices;
  id;
  subProd;
  url;
  internalLinks: Array<{ name: string; route: string }>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private langSc: LanguageService,
    private seoSc: SeoService,
    private productSc: ProductService,
    private layoutSc: LayoutService,
    public dialog: MatDialog,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.langObj = this.langSc.currentLangObj;

    this.isMobile$ = this.layoutSc.detectMobile();
    this.getIds();
    // this.getPrices();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getFragment();
    }, 2000);
  }

  getIds(): Observable<{ id: string; subProd: string }> {
    return (this.ids$ = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap,
    ]).pipe(
      map(([id, subProd]) => {
        this.id = id.get('id');
        if (
          (this.id === 'losetas' || this.id === 'pavers') &&
          !subProd.get('subProd')
        ) {
          this.subProd = '12x50';
        } else {
          this.subProd = subProd.get('subProd');
        }
        return { id: this.id, subProd: this.subProd };
      }),
      tap(() => {
        this.url = UrlParser[this.id];
        this.setCopy();
        this.internalLinks = this.buildInternalLinks();
        this.setSeo();
      })
    ));
  }

  setCopy() {
    this.copy = Products[this.subProd || this.url];
  }

  getPrices() {
    return (this.prices$ = this.productSc
      .getPrices()
      .pipe(tap(prices => (this.prices = prices))));
  }

  getFragment() {
    this.route.fragment.subscribe((fragment: string) => {
      this.scrollTo(fragment);
    });
  }

  scrollTo(id: string) {
    const offset = firstValueFrom(this.isMobile$) ? 56 : 64;
    this.scroller.setOffset([0, offset]);
    this.scroller.scrollToAnchor(id);
  }

  selectSubProd(event) {
    // console.log(event);
  }

  setSeo() {
    const linksArr = this.buildInternalLinks();
    const metaTags = {
      title: this.copy[this.lang].title,
      description: this.copy[this.lang].carrouselCopy,
      image: this.copy.featureImg,
      slug: linksArr[linksArr.length - 1].route,
    };

    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`${linksArr[linksArr.length - 1].route}`);
  }

  getRet(ret) {
    console.log(ret);
  }

  onSwiper(swiper) {
    // console.log(swiper);
    // nada
  }

  onSlideChange() {
    // console.log('slide change');
  }

  buildInternalLinks() {
    if (this.subProd) {
      return [
        { name: 'home', route: '/' },
        { name: this.id, route: `/${this.lang}/${this.id}` },
        {
          name: this.subProd,
          route: `/${this.lang}/${this.id}/${this.subProd}`,
        },
      ];
    } else {
      return [
        { name: 'home', route: '/' },
        { name: this.id, route: `/${this.lang}/${this.id}` },
      ];
    }
  }

  isLocal() {
    return this.langObj.countrycode === 'AR';
  }

  setPrices() {
    if (this.isLocal()) {
      return this.prices.local;
    } else {
      return this.prices.ext;
    }
  }

  currencySymbol() {
    if (this.isLocal()) {
      return 'AR $';
    } else {
      return 'US $';
    }
  }
}
