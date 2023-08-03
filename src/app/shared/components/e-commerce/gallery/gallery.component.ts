import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Observable, Subject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { Colors } from 'src/app/shared/copy';
import { Color, Producto } from 'src/app/shared/interfaces';
import {
  EcomService,
  LanguageService,
  LayoutService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnChanges {
  @Input() products: any; // por ahora voy a hacer un mock de esto
  @Input() dbProducts: Record<string, Producto>;
  @Output() selected = new EventEmitter();
  isL$: Observable<boolean>;
  unsuscribe$ = new Subject();

  allColors: Record<string, Color> = Colors;
  builtProd;

  isEcom: boolean;
  selectedProducts: Array<any>;

  constructor(
    private layOutSc: LayoutService,
    private langSc: LanguageService,
    private ecomSc: EcomService
  ) {
    this.isEcom = ecomSc.isEcom;
  }

  ngOnInit(): void {
    this.isL$ = this.layOutSc.detectL();
    this.buildSelectedArray();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['products'] &&
      changes['products'].previousValue !== undefined
    ) {
      this.buildSelectedArray();
    }
  }

  getScreenSize() {
    return this.layOutSc
      .detectScreenSize()
      .pipe(map(res => this.setColNums(res)));
  }

  setColNums(size) {
    const sizeObj = {
      xsmall: 2,
      small: 2,
      medium: 2,
      large: 3,
      xlarge: 3,
    };
    return sizeObj[size];
  }

  buildSelectedArray() {
    this.selectedProducts = [];
    this.products.forEach(product => {
      this.selectedProducts.push(product.sizes[0]);
    });
  }

  calcStock(code) {
    let stock = false;
    const stockObj = this.dbProducts[code].stock;
    for (const [key, value] of Object.entries(stockObj)) {
      if (value.disp > 20) {
        stock = true;
        break;
      }
    }
    return stock ? 'en stock' : 'a fabricar';
  }

  select(color) {
    this.selected.emit(color);
  }

  getName(color) {
    return this.allColors[color].name;
  }

  getProduct() {}

  findProduct(producuts: Producto[], code: string) {
    return producuts.find(product => product.codigo === code);
  }

  getPrice(product) {
    return this.isEcom ? product.precioEcom : product.precioActual;
  }

  getUnit(unit) {
    return this.ecomSc.parseUnits(unit);
  }

  getDim(dim) {
    return this.ecomSc.parseDim(dim);
  }

  filterSizes(sizes: Array<any>) {
    return sizes.filter(
      size => this.dbProducts[size.code].packaging === 'caja'
    );
  }
}
