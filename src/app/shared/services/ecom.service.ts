import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';

import { CartItem, Producto, CompObj, QObj } from '../interfaces';
import { ProdImgs } from '../constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EcomService {
  private firestore: Firestore = inject(Firestore);
  isEcom = environment.init.eCom;
  products: Record<string, Producto>;
  prodCrude: Array<Producto>;
  cart: CartItem[] = [];
  subTotal = 0;
  qObj: QObj | null;
  compObj: CompObj | null;
  init = true;

  compImgs = ProdImgs;

  // animation
  cartState = false;

  constructor() {}

  // from Firebase

  // getProductsViejo(): Observable<Record<string, Producto>> {
  //   return this.db
  //     .colValue$<Producto[]>('products', ref =>
  //       ref.where('tipo', 'in', ['producto', 'producto reventa', 'servicio'])
  //     )
  //     .pipe(
  //       tap(products => (this.prodCrude = products)),
  //       map(products => this.prodObj(products)),
  //       tap(productsObj => (this.products = productsObj))
  //     );
  // }

  getProducts() {
    const prodColRef = collection(this.firestore, 'products');
    const q = query(
      prodColRef,
      where('tipo', 'in', ['producto', 'producto reventa', 'servicio'])
    );

    const data = collectionData(q) as Observable<Producto[]>;
    return data.pipe(
      tap(products => (this.prodCrude = products)),
      map(products => this.prodObj(products)),
      tap(productsObj => (this.products = productsObj))
    );
  }

  prodObj(products: Producto[]): Record<string, Producto> {
    const prodObj = {} as Record<string, Producto>;
    products.forEach(product => (prodObj[product.codigo] = product));
    return prodObj;
  }

  // Helper funcs

  round(value: number, decimals: number): number {
    let d: string | number = '1';
    for (let i = 0; i < decimals; i++) {
      d += '0';
    }
    d = Number(d);
    return Math.round((value + Number.EPSILON) * d) / d;
  }

  addItemCart(item, complements): void {
    this.removeComplements();
    this.qObj = null;
    this.compObj = null;
    this.cart.push(item);
    if (complements) {
      this.calcTotal();
    }
    this.changeCartState();
  }

  changeCartState() {
    this.cartState = true;
    setTimeout(() => {
      this.cartState = false;
    }, 1000);
  }

  removeItem(i: number): void {
    if (this.qObj) {
      const val = this.cart[i];
      const itemSubTotal = val.subTotal;
      // resto la cantidad del subtotal
      this.qObj.subTotal = this.round(this.qObj.subTotal - itemSubTotal, 2);
      // lo remuevo del carrito
      this.cart.splice(i, 1);
    }
  }

  calcTotal() {
    console.log('calculo total');
    this.qObj = this.calcQ(this.cart);
    this.compObj = this.calcExtras(this.qObj);
    const extrasArr = this.addComplements(this.compObj);
    this.cart = [...this.cart, ...extrasArr];
  }

  calcQ(array: CartItem[]) {
    let m2Placa = 0;
    let m2Pt = 0;
    let m2Rus = 0;
    let ml = 0;
    let m2Ext = 0;
    let subTotal = 0;
    array.forEach(item => {
      subTotal += item.subTotal;
      if (item.product.familia === 'piso tecnico') {
        m2Pt += item.quantity;
      } else if (
        item.product.familia === 'placas' ||
        item.product.familia === 'placas cortes'
      ) {
        m2Placa += item.quantity;
      } else if (item.product.familia === 'rusticato') {
        m2Rus += item.quantity;
      } else if (item.product.familia === 'exteriores') {
        m2Ext += item.quantity;
      } else if (item.product.familia === 'zocalos') {
        ml += item.quantity;
      }
    });
    return {
      m2Placa: this.round(m2Placa, 2),
      m2Pt: this.round(m2Pt, 2),
      m2Rus: this.round(m2Rus, 2),
      m2Ext: this.round(m2Ext, 2),
      ml: this.round(ml, 2),
      subTotal: this.round(subTotal, 2),
    };
  }

  calcExtras(compObj) {
    const grout = this.calcGrout(compObj);
    const glue = this.calcGlue(compObj);
    const impPol = this.calcImpPol(compObj);
    const impAc = this.calcImpAc(compObj);
    const sop = this.calcSop(compObj);

    return {
      grout,
      glue,
      impPol,
      impAc,
      sop,
    };
  }

  calcGrout(compObj: QObj) {
    if (compObj.ml) {
      compObj.m2Placa += compObj.ml * 0.4 * 0.1;
    }
    const netGrout = 0.5 * compObj.m2Placa + 0.25 * compObj.m2Rus;
    const bags = Math.ceil(netGrout / 5);
    return bags;
  }

  calcGlue(compObj: QObj) {
    if (compObj.ml) {
      compObj.m2Placa += compObj.ml * 0.4 * 0.1;
    }
    const glue = Math.ceil((compObj.m2Placa + compObj.m2Rus) / 6);
    return glue;
  }

  calcImpPol(compObj: QObj) {
    if (compObj.ml) {
      compObj.m2Placa += compObj.ml * 0.4 * 0.1;
    }
    const imp = Math.ceil((compObj.m2Placa + compObj.m2Pt) / 10);
    return imp;
  }

  calcImpAc(compObj: QObj) {
    const imp = Math.ceil(compObj.m2Rus / 10);
    return imp;
  }

  calcSop(compObj: QObj) {
    const sop = Math.ceil(compObj.m2Pt / 0.16);
    return sop;
  }

  findProduct(code: string): Producto | undefined {
    return this.prodCrude.find(product => product.codigo === code);
  }

  addComplements(complements: CompObj) {
    const compArray = [] as CartItem[];
    Object.keys(complements).forEach(name => {
      const q = complements[name];
      if (q > 0) {
        const product = this.getComplement(name);
        if (product) {
          const itemSubTotal = this.round(product.precioActual * q, 2);
          compArray.push({
            quantity: q,
            product,
            isComplement: true,
            excess: 0,
            subTotal: itemSubTotal,
            totalQ: q,
            imageUrl: this.compImgs[name] || null,
          });
          // ademas de agregarlo al array lo sumo al subtotal
          if (this.qObj) {
            this.qObj.subTotal = this.round(
              this.qObj.subTotal + itemSubTotal,
              2
            );
          }
        }
      }
    });
    return compArray;
  }

  getComplement(name: string): Producto | undefined {
    const prodObj = {
      impPol: 'ImpPolMate',
      impAc: 'ImpAcr',
      grout: 'PasBCe5kg',
      glue: 'PegamentoWeber',
      sop: 'Sop12',
    };
    const code: string = prodObj[name];
    return this.findProduct(code);
  }

  removeComplements() {
    const spliceIndexes = new Array();
    this.cart.forEach((val, index) => {
      if (val.isComplement) {
        spliceIndexes.push(index);
      }
    });

    this.removeIndexes(spliceIndexes);
  }

  removeIndexes(spliceIndexes) {
    this.cart = this.cart.filter((val, index) => {
      return !val.isComplement;
      // return spliceIndexes.indexOf(index) == -1;
    });
  }

  emptyCart() {
    this.cart = [];
  }
}
