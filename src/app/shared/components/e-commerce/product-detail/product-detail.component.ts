import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

import { SwiperComponent } from 'swiper/angular';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  Thumbs,
} from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay, Thumbs]);

import { Colors, ProductDetail } from 'src/app/shared/copy';
import { Color, Producto } from 'src/app/shared/interfaces';
import { EcomService } from '../../../services/ecom.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LanguageService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  // @Input() prodName: string;
  @Input() productObj: any;
  @Input() collection: any;
  @Input() colId: any;
  @Input() dbProducts: Record<string, Producto>;
  @Input() samples: boolean;
  @Input() initQ: number;
  @Output() add = new EventEmitter();
  unsuscribe$ = new Subject();
  lang: string;
  isEcom: boolean;
  copy = ProductDetail;

  // form variables
  qForm: FormGroup;
  // initQ = 20;
  excess = 0;
  eq: number;
  netQ: number | null;
  totalQ: number;
  units: number | null;
  boxes: number | null;
  packaging: boolean;
  subTotal: number;
  addComplements = true;

  // productObj;
  thumbsSwiper: any;
  // dbProducts: Record<string, Producto>;
  selectedSize;
  selectedProduct: Producto;
  imgArray: Array<string> = [];
  imgObjArray: Record<string, Array<string>> = {};

  // copy & constants
  allColors: Record<string, Color> = Colors;

  constructor(
    private ecomSc: EcomService,
    private fb: FormBuilder,
    private langSc: LanguageService
  ) {
    this.isEcom = ecomSc.isEcom;
  }

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
    if (!this.initQ) {
      this.initQ = 20;
      this.excess = 15;
    }
    this.buildForm();
    this.buildImgArray();
    this.selectedSize = this.productObj.sizes[0];
    this.selectedProduct = this.dbProducts[this.selectedSize.code];
    this.calcFinalQ();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  ngAfterViewChecked(): void {
    this.watchForm();
  }

  buildImgArray() {
    if (this.samples) {
      this.buildAltImgArray();
    } else {
      this.buildTerrazzoImgArray();
    }
  }

  setImgArray() {
    if (this.samples) {
      return this.imgObjArray[this.selectedSize.code];
    } else {
      return this.imgArray;
    }
  }

  buildTerrazzoImgArray() {
    const obj = this.allColors[this.productObj.name];
    this.imgArray.push(obj.url);
    if (obj.secImgs) {
      obj.secImgs.forEach(img => this.imgArray.push(img));
    }
  }

  buildAltImgArray() {
    this.productObj.sizes.forEach(size => {
      const obj = this.allColors[size.code];
      this.imgObjArray[size.code] = [];
      this.imgObjArray[size.code].push(obj.url);
      if (obj.secImgs) {
        obj.secImgs.forEach(img => this.imgObjArray[size.code].push(img));
      }
    });
  }

  toSlide(index) {
    this.swiper.swiperRef.slideTo(index);
  }

  chooseSize(sizeObj) {
    this.selectedSize = sizeObj;
    this.selectedProduct = this.dbProducts[this.selectedSize.code];
    this.calcFinalQ();
  }

  hasPackaging() {
    return this.selectedProduct?.packaging === 'caja';
  }

  buildForm() {
    this.qForm = this.fb.group({
      quantity: [
        this.initQ,
        [Validators.required, this.greaterThanZeroValidator()],
      ],
      excess: [
        this.excess,
        [Validators.required, Validators.max(99), Validators.min(0)],
      ],
      totalQ: [null, Validators.required],
      product: [null, Validators.required],
      subTotal: [null, Validators.required],
      imageUrl: [null],
      isComplement: [null],
    });
  }

  greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = Number(control.value);
      const isNotValid = value <= 0;
      return isNotValid ? { greaterThanZero: { value: control.value } } : null;
    };
  }

  watchForm() {
    this.qForm
      .get('quantity')!
      .valueChanges.pipe(takeUntil(this.unsuscribe$))
      .subscribe(q => this.calcFinalQ());

    this.qForm
      .get('excess')!
      .valueChanges.pipe(takeUntil(this.unsuscribe$))
      .subscribe(q => this.calcFinalQ());
  }

  calcFinalQ() {
    this.eq = this.selectedProduct?.eq;
    const unitsPerPack = this.hasPackaging()
      ? this.selectedProduct.uPorBulto
      : 1;
    const qCtrl = this.qForm.get('quantity')!;
    const qExcess = this.qForm.get('excess')!;
    const q = this.ecomSc.round(qCtrl.value * (qExcess.value / 100 + 1), 3);

    if (q) {
      this.units = Math.ceil(q / this.eq);
      this.netQ = this.ecomSc.round(this.units * this.eq, 2);
      this.boxes = Math.ceil(this.units / unitsPerPack);
      this.totalQ = this.ecomSc.round(this.boxes * unitsPerPack * this.eq, 2);
      this.subTotal = this.ecomSc.round(
        this.totalQ * this.selectedProduct?.precioActual,
        2
      );
      this.qForm.patchValue({
        totalQ: this.totalQ,
        product: this.selectedProduct,
        subTotal: this.subTotal,
        imageUrl: this.setImgArray()[0],
        isComplement: false,
      });
    } else {
      this.netQ = this.boxes = this.units = null;
    }
  }

  addToCart() {
    this.add.emit({
      values: this.qForm.value,
      complements: this.addComplements,
    });
  }

  setTitle() {
    if (this.samples) {
      return `${this.copy.samples[this.lang]} - `;
    } else {
      return this.colId === 'raisedFloors'
        ? this.copy.raisedFloor[this.lang]
        : this.copy.terrazzo[this.lang];
    }
  }

  calcStock(aprox?: number) {
    if (!aprox) {
      aprox = 0;
    }
    let stock = false;
    const stockObj = this.selectedProduct.stock;
    for (const [key, value] of Object.entries(stockObj)) {
      if (value.disp > aprox) {
        stock = true;
        break;
      }
    }
    const text = stock
      ? this.copy.stock[this.lang]
      : this.copy.noStock[this.lang];
    return {
      text,
      stock,
    };
  }

  disableBtn() {
    if (this.samples) {
      return !this.qForm.valid || !this.calcStock().stock;
    } else {
      return !this.qForm.valid;
    }
  }
}
