import { filter, first } from 'rxjs/operators';
import { Injectable, NgZone, inject } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Database, objectVal, ref, listVal } from '@angular/fire/database';

import { CartItem, Producto, CompObj, QObj } from '../interfaces';
import { DimParser, ProdImgs, UnitsParser } from '../constants';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class EcomService {
  private firestore: Firestore = inject(Firestore);
  isEcom = environment.init.eCom;
  carrySamples = false;
  products: Record<string, Producto>;
  secImgs: Record<string, Array<string>>;
  prodCrude: Array<Producto>;
  cart: CartItem[] = [];
  subTotal = 0;
  qObj: QObj | null;
  compObj: CompObj | null;
  init = true;

  compImgs = ProdImgs;

  // animation
  cartState = false;
  saveCartDebounce: number | null = null;

  constructor(
    private authSc: AuthService,
    private afd: Database,
    private ngZone: NgZone,
    private localStorageSc: LocalStorageService
  ) {}

  // setting mode

  switchToSamples() {
    this.carrySamples = true;
    this.cart = [];
  }

  switchToQuote() {
    this.carrySamples = false;
    this.cart = [];
  }

  showPrices() {
    if (this.isEcom) {
      return true;
    } else {
      return this.carrySamples;
    }
  }

  parseUnits(unit) {
    const unitParser = UnitsParser;
    const config = this.isEcom ? 'ecom' : 'local';
    return unitParser[config][unit];
  }

  parseDim(dim) {
    const dimParser = DimParser;
    return this.isEcom ? dimParser[dim] || dim : dim;
  }

  // **** Firebase functions

  // esta funcion corre en el resolver al cargar la web
  getProducts() {
    const prodColRef = collection(this.firestore, 'products');
    const q = query(
      prodColRef,
      where('tipo', 'in', [
        'producto',
        'producto reventa',
        'servicio',
        'muestras',
      ])
    );

    const data = collectionData(q) as Observable<Producto[]>;
    return data.pipe(
      tap(products => (this.prodCrude = products)),
      map(products => this.prodObj(products)),
      tap(productsObj => {
        this.products = productsObj;
        // es importante recien ahora cargar el carrito porque si no no estan los productos disponibles para mirar.
      })
    );
  }

  getGallerySecondaryImgs() {
    return objectVal(ref(this.afd, 'newWeb/secProdImgs')).pipe(
      tap((secImgs: any) => {
        this.secImgs = secImgs;
      })
    );
  }

  prodObj(products: Producto[]): Record<string, Producto> {
    const prodObj = {} as Record<string, Producto>;
    products.forEach(product => (prodObj[product.codigo] = product));
    return prodObj;
  }

  // *** Modifications to cart

  addItemCart(item, complements): void {
    this.removeComplements();
    this.qObj = null;
    this.compObj = null;
    this.cart.push(item);
    // la funcion calcTotal() lo que hace es armar el objeto qObj
    // este objeto cuenta todas las cantidades de m2, ml, m2 de pt.
    // de esta forma luego puedo calcular cuanto se necesita de cada uno
    this.calcTotal();
    if (complements) {
      this.addCompToCart();
    }
    this.changeCartState();
    this.saveCart();
  }

  removeItem(i: number): void {
    if (this.qObj) {
      const val = this.cart[i];
      const itemSubTotal = val.subTotal;
      // resto la cantidad del subtotal
      this.qObj.subTotal = this.round(this.qObj.subTotal - itemSubTotal, 2);
      // lo remuevo del carrito
      this.cart.splice(i, 1);

      // en caso que el articulo que este removiendo sea un producto entonces recalculo complementos
      if (!val.isComplement) {
        // remuevo los complementos
        this.removeComplements();
        // recalculo el total
        this.calcTotal();
        this.addCompToCart();
      }
      this.saveCart();
    }
  }

  removeComplements() {
    // esta funcion borra los articulos que son complementos del carrito
    const spliceIndexes = new Array();
    this.cart.forEach((val, index) => {
      if (val.isComplement) {
        spliceIndexes.push(index);
      }
    });

    this.cart = this.cart.filter((val, index) => {
      return !val.isComplement;
      // return spliceIndexes.indexOf(index) == -1;
    });
    this.saveCart();
  }

  emptyCart() {
    this.cart = [];
    this.saveCart();
  }

  // *** Helper funcs

  calcTotal() {
    this.qObj = this.calcQ(this.cart);
  }

  addCompToCart() {
    if (this.isEcom === false) {
      this.compObj = this.calcExtras(this.qObj);
      const extrasArr = this.buildCompArray(this.compObj);
      this.cart = [...this.cart, ...extrasArr];
    }
  }

  round(value: number, decimals: number): number {
    let d: string | number = '1';
    for (let i = 0; i < decimals; i++) {
      d += '0';
    }
    d = Number(d);
    return Math.round((value + Number.EPSILON) * d) / d;
  }

  changeCartState() {
    this.cartState = true;
    setTimeout(() => {
      this.cartState = false;
    }, 1000);
  }

  calcQ(array: CartItem[]): QObj {
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
    // const impPol = this.calcImpPol(compObj);
    const impSell = this.calcImpSell(compObj);
    const impAc = this.calcImpAc(compObj);
    const sop = this.calcSop(compObj);

    return {
      grout,
      glue,
      // impPol,
      impSell,
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

  calcImpSell(compObj: QObj) {
    if (compObj.ml) {
      compObj.m2Placa += compObj.ml * 0.4 * 0.1;
    }
    const imp = Math.ceil((compObj.m2Placa + compObj.m2Pt) / 8);
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

  buildCompArray(complements: CompObj) {
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
            units: q,
            boxes: q,
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
      impSell: 'ImpSell500',
      impAc: 'ImpAcr',
      grout: 'PasBCe5kg',
      glue: 'PegamentoWeberGris',
      sop: 'Sop12',
    };
    const code: string = prodObj[name];
    return this.findProduct(code);
  }

  findProduct(code: string): Producto | undefined {
    return this.prodCrude.find(product => product.codigo === code);
  }

  // persist Ecom funcs

  saveCart() {
    const simpliedCart = this.simplifyCart(
      JSON.parse(JSON.stringify(this.cart))
    );
    const toSave = JSON.stringify(simpliedCart);
    this.localStorageSc.saveData('cart', toSave);
  }

  empyCartOnPersist() {
    this.localStorageSc.saveData('cart', '[]');
  }

  simplifyCart(cart) {
    return cart.map(item => {
      if (item.product && item.product.codigo) {
        item.product = item.product.codigo;
      }
      return item;
    });
  }

  rebuildCart(simplifiedCart) {
    return simplifiedCart.map(item => {
      const productCode = item.product as string;
      if (this.products[productCode]) {
        item.product = this.products[productCode];
      }
      return item;
    });
  }

  setCart() {
    let cart = this.localStorageSc.getData('cart');
    if (cart) {
      const jsonCart = JSON.parse(cart);
      this.cart = this.rebuildCart(jsonCart);
      if (this.cart.length > 0 && this.cart[0].product.familia === 'muestras') {
        this.carrySamples = true;
      }
      this.calcTotal();
    } else {
      this.cart = [];
    }
  }

  saveCartToFb() {
    const user = this.authSc.currentUser;
    if (user) {
      // lo corro fuera del ciclo de deteccion de angular. No es necesario que termine de guardar el carro para que angular acualice ninguna vista
      return this.ngZone.runOutsideAngular(() => {
        setDoc(
          doc(this.firestore, 'web_users', user.uid),
          { cart: this.cart },
          { merge: true }
        ).catch(err => console.log('error saving cart', err));
      });
    }
  }

  async setCartFb() {
    const user = (await firstValueFrom(
      this.authSc.authState$.pipe(
        filter(user => user !== null),
        first()
      )
    )) as User;
    const cart = await getDoc(doc(this.firestore, 'web_users', user.uid));
    if (cart.exists()) {
      const savedCart = cart.data()['cart'] as CartItem[];
      this.cart = savedCart;
      if (this.cart.length > 0 && this.cart[0].product.familia === 'muestras') {
        this.carrySamples = true;
      }
      this.calcTotal();
    } else {
      this.cart = [];
    }
  }
}
