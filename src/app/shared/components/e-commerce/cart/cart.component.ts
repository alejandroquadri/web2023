import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/shared/copy/cart';

import {
  SidenavService,
  EcomService,
  LanguageService,
  ServerDetectService,
  MpService,
} from 'src/app/shared/services';
import { CartItem, MPitem } from 'src/app/shared/interfaces';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @Input() forSideNav: boolean;
  lang;
  isEcom: boolean;
  copy = Cart;
  spinner = false;

  constructor(
    private sideNavSc: SidenavService,
    public eComSc: EcomService,
    private router: Router,
    private langSc: LanguageService,
    private mpSc: MpService,
    private serverDetSc: ServerDetectService
  ) {
    this.isEcom = this.eComSc.isEcom;
  }

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

  get cartList() {
    return this.eComSc.cart as Array<CartItem>;
  }

  get qObj() {
    return this.eComSc.qObj;
  }

  getPrice(product) {
    return this.isEcom ? product.precioEcom : product.precioActual;
  }

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
      }
    } else {
      this.close();
      this.router.navigate([`/${this.lang}/checkout`]);
    }
  }

  mpCheckout() {
    this.spinner = true;
    const title =
      this.cartList.length > 1
        ? 'Productos Quadri'
        : this.cartList[0].product.descripcion;
    let description = '';
    this.cartList.forEach(item => {
      description += `${item.product.descripcion} x ${item.quantity} ;`;
    });
    const items: Array<MPitem> = [
      {
        title,
        quantity: 1,
        unit_price: this.qObj!.subTotal,
        description,
        catalog_product_id: 'MLA1375998543',
      },
    ];
    // const items: Array<MPitem> = [];
    // this.cartList.forEach(item => {
    //   const mpItem: MPitem = {
    //     title: item.product.descripcion,
    //     quantity: item.quantity,
    //     unit_price: item.product.precioActual,
    //     id: item.product.codigo,
    //     catalog_product_id: 'MLA1375998543',
    //     // picture_url: item.imageUrl,
    //   };
    //   items.push(mpItem);
    // });
    firstValueFrom(this.mpSc.buyItem(items, true)).then((res: any) => {
      // para que abra en otra tab
      // window.open(res.all.init_point, '_blank');
      // window.open(res.sandbox_init_point, '_blank');
      // this.eComSc.cart = [];
      // this.close();

      // para que abra en la misma ventana
      window.location.href = res.all.init_point;
      this.spinner = false;
    });
  }

  strippedCheckout() {
    // todo
  }

  showPrices() {
    if (this.eComSc.isEcom) {
      return true;
    } else {
      return this.eComSc.carrySamples;
    }
  }
}
