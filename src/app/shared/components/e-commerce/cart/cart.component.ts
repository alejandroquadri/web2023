import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  SidenavService,
  EcomService,
  LanguageService,
} from 'src/app/shared/services';
import { CartItem } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @Input() forSideNav: boolean;
  lang;
  isEcom: boolean;

  constructor(
    private sideNavSc: SidenavService,
    public eComSc: EcomService,
    private router: Router,
    private langSc: LanguageService
  ) {
    this.isEcom = this.eComSc.isEcom;
  }

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }

  close(): void {
    this.sideNavSc.closeS();
  }

  get cartList() {
    return this.eComSc.cart as Array<CartItem>;
  }

  get qObj() {
    return this.eComSc.qObj;
  }

  remove(i: number): void {
    this.eComSc.removeItem(i);
  }

  endSale() {
    this.close();
    this.router.navigate([`/${this.lang}/checkout`]);
  }
}
