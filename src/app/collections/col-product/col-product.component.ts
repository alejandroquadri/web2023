import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, combineLatest } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { CollectionUrlParser } from 'src/app/shared/constants';
import { Collections, Colors } from 'src/app/shared/copy';
import { Producto } from 'src/app/shared/interfaces';
import {
  EcomService,
  LanguageObj,
  LanguageService,
  SeoService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-col-product',
  templateUrl: './col-product.component.html',
  styleUrls: ['./col-product.component.scss'],
})
export class ColProductComponent implements OnInit, OnDestroy, AfterViewInit {
  ids$: Observable<any>;
  unsuscribe$ = new Subject();

  lang: string;
  colId: string;
  prodId: string;
  paramId: string;
  colData: any;
  dbProducts: Record<string, Producto>;
  internalLinks: Array<{ name: string; route: string }>;
  allColors = Colors;
  productWebObj;
  productData: Producto;

  // constants & copy
  collParser = CollectionUrlParser;
  collections = Collections;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scroller: ViewportScroller,
    private langSc: LanguageService,
    private eComSc: EcomService,
    private seoSc: SeoService
  ) {}

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.getIds();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scroller.scrollToPosition([0, 0]);
    }, 500);
  }

  getIds(): void {
    this.ids$ = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap,
    ]).pipe(
      tap(([url, queryParams]) => {
        const colUrl = url.get('collection');
        this.prodId = url.get('product')!;
        this.paramId = queryParams.get('id')!;
        if (colUrl) {
          this.colId = this.collParser[colUrl]
            ? this.collParser[colUrl]
            : colUrl;
        }
        this.setCopy();
        this.internalLinks = this.buildInternalLinks();
        this.setSeo();
      })
    );
  }

  getProducts() {
    this.eComSc
      .getProducts()
      .pipe(
        takeUntil(this.unsuscribe$),
        startWith(this.eComSc.products),
        tap(products => {
          if (products) {
            this.dbProducts = products;
          }
        })
      )
      .subscribe();
  }

  setCopy(): void {
    if (this.colId) {
      this.colData = this.collections[this.colId];
    }
    this.productWebObj = this.findProduct();
  }

  findProduct() {
    return this.colData.products.find(product => product.name === this.prodId);
  }

  buildInternalLinks(): Array<{ name: string; route: string }> {
    const colLang = this.lang === 'es' ? 'colecciones' : 'collections';
    const allLang = this.lang === 'es' ? 'todos' : 'all';
    return [
      { name: 'home', route: '/' },
      { name: `${colLang}`, route: `/${this.lang}/${colLang}` },
      {
        name: this.paramId ? allLang : this.colId,
        route: `/${this.lang}/${colLang}/${
          this.paramId ? this.paramId : this.colId
        }`,
      },

      {
        name: this.prodId,
        route: `/${this.lang}/${colLang}/${this.colId}/${this.prodId}`,
      },
    ];
  }

  addToCart(product) {
    this.eComSc.addItemCart(product.values, product.complements);
  }

  setSeo() {
    const linksArr = this.buildInternalLinks();
    const metaTags = {
      title: `Quadri | ${this.lang === 'es' ? 'Terrazo' : 'Terrazzo'} ${
        this.allColors[this.productWebObj.name].name
      }`,
      description: `${this.lang === 'es' ? 'Terrazo' : 'Terrazzo'} ${
        this.allColors[this.productWebObj.name].name
      }`,
      image: this.allColors[this.productWebObj.name].url,
      slug: linksArr[linksArr.length - 1].route,
    };
    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`${linksArr[linksArr.length - 1].route}`);
  }
}
