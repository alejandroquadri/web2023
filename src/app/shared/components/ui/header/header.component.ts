import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

import {
  trigger,
  transition,
  animate,
  style,
  state,
  keyframes,
} from '@angular/animations';

import { Observable } from 'rxjs';

import {
  CopyService,
  SidenavService,
  LanguageService,
  LayoutService,
  EcomService,
} from 'src/app/shared/services';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('cartBadge', [
      state(
        'idle',
        style({
          scale: '*',
        })
      ),
      state(
        'adding',
        style({
          scale: '*',
        })
      ),
      transition(
        'idle => adding',
        animate(
          '0.5s',
          keyframes([
            style({ transform: 'rotate(15deg) scale(1.3)' }),
            style({ transform: 'rotate(-15deg) scale(1.3)' }),
            style({ transform: 'rotate(15deg) scale(1.3)' }),
            style({ transform: 'rotate(0deg) scale(1.3)' }),
          ])
        )
      ),
      transition('void => *', [
        style({ transform: 'translateX(200%)' }),
        animate('300ms ease-in-out'),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  // @Input() isMobile$: Observable<boolean>;
  // @Input() isMobile: boolean;

  // layout$: Observable<boolean>;
  data$: Observable<any>;
  route$: Observable<boolean>;
  logo: any;
  lang: string;
  cartBadgeState = false;

  stickyUrls = [
    'eshome',
    'enhome',
    'encontact',
    'escontacto',
    'escheckout',
    'encheckout',
    'esquote',
    'enquote',
    'blog',
    'esnot-found',
    'ennot-found',
    'esinspiracion',
    'enlookbook',
    'escolecciones',
    'encollections',
  ];
  absUrl = ['eshome', 'enhome', 'esquote', 'enquote'];
  ctaBtnUrl = ['esquote', 'enquote'];
  checkoutUrl = ['escheckout', 'encheckout'];

  timedOutCloser;

  constructor(
    private sidenavSc: SidenavService,
    // private layoutSc: LayoutService,
    public platform: Platform,
    private copySc: CopyService,
    public langSc: LanguageService,
    private router: Router,
    public eComSc: EcomService
  ) {
    // this.obsLayout();
  }

  ngOnInit(): void {
    this.setLogo();
    // this.obsLayout();
  }

  setLogo() {
    this.logo = this.copySc.logos.logoImg;
  }

  changeState() {
    this.cartBadgeState = true;
    setTimeout(() => {
      this.cartBadgeState = false;
    }, 2000);
    // this.cartBadgeState = !this.cartBadgeState;
  }

  // obsLayout(): void {
  //   this.layout$ = this.layoutSc.detectMobile();
  // }

  openSide(): void {
    this.sidenavSc.toggle();
  }

  getUrl() {
    const url = this.router.url;
    const parsedUrl = url.replace(/\//g, '');
    return parsedUrl;
    // return !this.stickyUrls.includes(parsedUrl)
  }

  isSticky() {
    let url = this.getUrl();
    if (url.substring(2, 6) === 'blog') {
      url = 'blog';
    }
    return !this.stickyUrls.includes(url);
  }

  isAbs() {
    let url = this.getUrl();
    return this.absUrl.includes(url);
  }

  showQuoteBtn() {
    const url = this.getUrl();
    return !this.ctaBtnUrl.includes(url);
  }

  showCartBtn() {
    const url = this.getUrl();
    return !this.checkoutUrl.includes(url);
  }

  shouldShow(item) {
    if (!item.countries) {
      return true;
    } else if (item.exclude) {
      return !item.countries.includes(this.langSc.currentLangObj.countrycode);
    } else {
      return item.countries.includes(this.langSc.currentLangObj.countrycode);
    }
  }

  openCart() {
    // to do
    this.sidenavSc.toggleS();
  }

  getCartLength() {
    return this.eComSc.cart.length;
  }

  get cartLength() {
    return this.eComSc.cart.length as number;
  }

  get cartState() {
    return this.eComSc.cartState as boolean;
  }

  showBadge() {
    return this.eComSc.cart.length === 0 ? 'hidden' : null;
  }
}
