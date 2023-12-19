import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue, ViewportScroller } from '@angular/common';

import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable, firstValueFrom, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

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
  EcomService,
  ServerDetectService,
  CookiesService,
} from 'src/app/shared/services';
import {
  AllCollections,
  Collections,
  PorductSpecs,
  PriceCopy,
} from 'src/app/shared/copy';
import { CollectionUrlParser } from 'src/app/shared/constants';
import { CollectionsService } from '../collections.service';
import { Producto } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  animations: [
    trigger('contentExpansion', [
      state(
        'expanded',
        style({ height: '*', opacity: 1, visibility: 'visible' })
      ),
      state(
        'collapsed',
        style({ height: '0px', opacity: 0, visibility: 'hidden' })
      ),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
  ],
})
export class CollectionComponent implements OnInit, OnDestroy {
  lang: string;
  langObj: LanguageObj;

  isMobile$: Observable<boolean>;
  prices$: Observable<any>;
  ids$: Observable<any>;
  unsuscribe$ = new Subject();

  allCollections = AllCollections;
  collections = Collections;
  copy;
  prodSpecs = PorductSpecs;
  priceCopy = PriceCopy;
  collParser = CollectionUrlParser;
  prices;
  id;
  subProd;
  url;
  internalLinks: Array<{ name: string; route: string }>;
  dbProducts: Record<string, Producto>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private langSc: LanguageService,
    private seoSc: SeoService,
    private collectionsSc: CollectionsService,
    private layoutSc: LayoutService,
    public dialog: MatDialog,
    private scroller: ViewportScroller,
    private ecomSc: EcomService,
    private serverDetSc: ServerDetectService,
    private coockieSc: CookiesService
  ) {}

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.langObj = this.langSc.currentLangObj;
    // this.coockieSc.deleteCookie('_onboarding');

    this.isMobile$ = this.layoutSc.detectMobile();
    this.getIds();
    this.getPrices();
    this.getProducts();
    if (
      this.serverDetSc.isBrowserSide() &&
      !this.onboardingShown() &&
      this.ecomSc.isEcom === false
    ) {
      this.openDialog();
      this.coockieSc.setCookie('_onboarding', 'yes');
    }
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  onboardingShown() {
    return this.coockieSc.getCookie('_onboarding') === 'yes' ? true : false;
  }

  getIds(): Observable<any> {
    return (this.ids$ = this.route.paramMap.pipe(
      tap(coll => {
        const colUrl = coll.get('collection');
        if (colUrl) {
          this.id = this.collParser[colUrl] ? this.collParser[colUrl] : colUrl;
        }
        this.setCopy();
        this.internalLinks = this.buildInternalLinks();
        this.setSeo();
      })
    ));
  }

  getProducts() {
    this.ecomSc
      .getProducts()
      .pipe(
        takeUntil(this.unsuscribe$),
        startWith(this.ecomSc.products),
        tap(products => {
          if (products) {
            this.dbProducts = products;
          }
        })
      )
      .subscribe();
  }

  originalOrder = (
    a: KeyValue<string, any>,
    b: KeyValue<string, any>
  ): number => {
    return 0;
  };

  showCollection(item) {
    return this.ecomSc.isEcom ? item.value.ecom : true;
  }

  filterBlends(products) {
    console.log(products);
    if (this.ecomSc.isEcom) {
      return products.filter(product => product.ecom);
    } else {
      return products;
    }
  }

  filterSizes(products) {
    return products.map(product => ({
      ...product,
      sizes: product.sizes.filter(
        size => this.dbProducts[size.code].packaging === 'caja'
      ),
    }));
  }

  setCopy() {
    if (this.id === 'all') {
      this.copy = this.allCollections;
    } else {
      this.copy = this.collections[this.id];
    }
  }

  getPrices() {
    return (this.prices$ = this.collectionsSc
      .getPrices()
      .pipe(tap(prices => (this.prices = prices))));
  }

  // getFragment() {
  //   this.route.fragment.subscribe((fragment: string) => {
  //     this.scrollTo(fragment);
  //   });
  // }

  async scrollTo(id: string) {
    const offset = (await firstValueFrom(this.isMobile$)) ? 56 : 64;
    this.scroller.setOffset([0, offset]);
    this.scroller.scrollToAnchor(id);
  }

  selectSubProd(event) {
    // console.log(event);
  }

  setSeo() {
    const linksArr = this.buildInternalLinks();
    let metaTags: any = { slug: linksArr[linksArr.length - 1].route };
    if (this.id !== 'all') {
      metaTags = {
        title: this.copy[this.lang].title,
        description: this.copy[this.lang].carrouselCopy,
        image: this.copy.featureImg,
        slug: linksArr[linksArr.length - 1].route,
      };
    }
    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`${linksArr[linksArr.length - 1].route}`);
  }

  getRet(ret) {
    // console.log(ret);
  }

  onSwiper(swiper) {
    // nada
  }

  onSlideChange() {
    // console.log('slide change');
  }

  buildInternalLinks(): Array<{ name: string; route: string }> {
    const colLang = this.lang === 'es' ? 'colecciones' : 'collections';
    const allLang = this.lang === 'es' ? 'todos' : 'all';

    return [
      { name: 'home', route: '/' },
      { name: `${colLang}`, route: `/${this.lang}/${colLang}` },
      {
        name: this.id === 'all' ? allLang : this.id,
        route: `/${this.lang}/${colLang}/${this.id}`,
      },
    ];
  }

  isLocal() {
    return this.langObj.countrycode === 'AR';
  }

  setPrices(): number {
    if (this.isLocal()) {
      return this.prices.local;
    } else {
      return this.prices.ext;
    }
  }

  currencySymbol(): string {
    if (this.isLocal()) {
      return 'AR $';
    } else {
      return 'US $';
    }
  }

  defLocale(): string {
    return this.langSc.defLocale();
  }

  selectedProduct(color, colKey?: string) {
    const colLang = this.lang === 'es' ? 'colecciones' : 'collections';
    if (colKey) {
      this.router.navigate([`${this.lang}/${colLang}/${colKey}/${color}`], {
        queryParams: { id: this.id },
      });
    } else {
      this.router.navigate([`${this.lang}/${colLang}/${this.id}/${color}`]);
    }
  }

  openDialog() {
    this.dialog.open(OnboardingComponent);
  }

  buildBgStyle(img) {
    return {
      'background-image': `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${img})`,
    };
  }
}

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class OnboardingComponent {
  stepsArray = [
    {
      num: 1,
      text: 'Selecciona los productos y cantidades que te interesen',
    },
    {
      num: 2,
      text: 'Cerra el presupuesto desde el carrito de compra',
    },
    {
      num: 3,
      text: '¡Hace click en enviar!',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CollectionComponent,
    public dialogRef: MatDialogRef<CollectionComponent>,
    public langSc: LanguageService
  ) {}

  close() {
    this.dialogRef.close();
  }
}
