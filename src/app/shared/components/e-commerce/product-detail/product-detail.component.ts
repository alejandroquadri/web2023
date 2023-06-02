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

import { Colors } from 'src/app/shared/copy';
import { Color, Producto } from 'src/app/shared/interfaces';
import { EcomService } from '../../../services/ecom.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Output() add = new EventEmitter();
  unsuscribe$ = new Subject();
  lang: string;
  isEcom = false;

  // form variables
  qForm: FormGroup;
  initQ = 20;
  excess = 15;
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

  // copy & constants
  allColors: Record<string, Color> = Colors;

  constructor(
    private ecomSc: EcomService,
    private fb: FormBuilder,
    private langSc: LanguageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.lang = this.langSc.currentLang;
    this.buildImgArray();
    this.selectedSize = this.productObj.sizes[0];
    this.selectedProduct = this.dbProducts[this.selectedSize.code];
    this.calcFinalQ();
    console.log(this.colId);
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  ngAfterViewChecked(): void {
    this.watchForm();
  }

  buildImgArray() {
    const obj = this.allColors[this.productObj.name];
    this.imgArray.push(obj.url);
    if (obj.secImgs) {
      obj.secImgs.forEach(img => this.imgArray.push(img));
    }
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
      quantity: [this.initQ, Validators.required],
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
        imageUrl: this.imgArray[0],
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
    const terrazzo = this.lang === 'es' ? 'Terrazo' : 'Terrazzo';
    const raisedFloor =
      this.lang === 'es' ? 'Piso técnico terrazo' : 'Terrazzo raised floor';
    return this.colId === 'raisedFloors' ? raisedFloor : terrazzo;
  }
}
