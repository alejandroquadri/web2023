import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/shared/copy/cart';

import {
  SidenavService,
  EcomService,
  LanguageService,
  ServerDetectService,
  MpService,
  StripeService,
} from 'src/app/shared/services';
import {
  CartItem,
  MPitem,
  Producto,
  StripeItem,
} from 'src/app/shared/interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @Input() forSideNav: boolean;
  lang;
  copy = Cart;
  spinner = false;
  termsAccepted = false;

  constructor(
    private sideNavSc: SidenavService,
    public eComSc: EcomService,
    private router: Router,
    private langSc: LanguageService,
    private mpSc: MpService,
    private stripeSc: StripeService,
    private serverDetSc: ServerDetectService
  ) {}

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    if (this.serverDetSc.isBrowserSide()) {
      this.eComSc.setCart();
    }
  }

  close(): void {
    this.sideNavSc.closeS();
  }

  get isEcom() {
    return this.eComSc.isEcom as boolean;
  }

  get cartList() {
    return this.eComSc.cart as Array<CartItem>;
  }

  get qObj() {
    return this.eComSc.qObj;
  }

  getPrice(product: Producto): number {
    return this.isEcom ? product.precioEcom : product.precioActual;
  }

  // getBoxPrice(item: CartItem): number {
  //   return this.eComSc.round(item.subTotal / item.boxes, 2);
  // }

  getUnit(unit) {
    return this.eComSc.parseUnits(unit);
  }

  getDim(dim) {
    return this.eComSc.parseDim(dim);
  }

  remove(i: number): void {
    this.eComSc.removeItem(i);
  }

  endSale() {
    if (this.eComSc.carrySamples) {
      if (!this.eComSc.isEcom) {
        this.mpCheckout();
      } else {
        this.strippedCheckout();
        // this.close();
        // this.router.navigate([`/${this.lang}/checkout-us`]);
      }
    } else {
      if (this.eComSc.isEcom) {
        this.strippedCheckout();
        // this.close();
        // this.router.navigate([`/${this.lang}/checkout-us`]);
      } else {
        this.close();
        this.router.navigate([`/${this.lang}/checkout`]);
      }
    }
  }

  mpCheckout() {
    this.spinner = true;
    // const title =
    //   this.cartList.length > 1
    //     ? 'Productos Quadri'
    //     : this.cartList[0].product.descripcion;
    let description = '';
    this.cartList.forEach(item => {
      description += `${item.product.descripcion} x ${item.quantity} ;`;
    });
    const items: Array<MPitem> = [
      {
        title: description,
        quantity: 1,
        unit_price: this.qObj!.subTotal * 1.21,
        description,
        catalog_product_id: 'MLA1375998543',
      },
    ];
    firstValueFrom(this.mpSc.buyItem(items, true)).then((res: any) => {
      window.location.href = res.all.init_point;
      // this.spinner = false;
      this.eComSc.emptyCart();
    });
  }

  strippedCheckout() {
    this.spinner = true;
    const items: Array<any> = [];
    this.cartList.forEach(item => {
      items.push({
        code: item.product.codigo,
        quantity: item.boxes,
        name: item.product.descripcion,
        unit_price: item.product.precioCajaEcom!,
        description: `${item.boxes} ${this.copy.boxes[this.lang]}`,
        picture_url: item.imageUrl,
      });
    });
    // firstValueFrom(this.stripeSc.simpleCheckout(items)).then((res: any) => {
    //   console.log(res);
    //   window.location.href = res.url;
    //   // this.spinner = false;
    //   // this.eComSc.emptyCart();
    // });
  }

  showPrices() {
    if (this.isEcom) {
      return true;
    } else {
      return this.eComSc.carrySamples;
    }
  }

  returnId() {
    if (this.eComSc.carrySamples) {
      return 'samples-id';
    } else if (this.isEcom) {
      return 'purchase-id';
    } else {
      return '';
    }
  }
}
