import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EcomService, LanguageService } from 'src/app/shared/services';
import { SamplesCopy } from 'src/app/shared/copy/samples';
import { MPitem, Producto } from 'src/app/shared/interfaces';
import { MpService } from '../shared/services/mp.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss'],
})
export class SamplesComponent implements OnInit {
  dbProducts: Record<string, Producto>;
  internalLinks: Array<{ name: string; route: string }>;
  id;
  lang: string;
  copy = SamplesCopy;
  productWebObj;

  constructor(
    private eComSc: EcomService,
    private router: Router,
    private location: Location,
    private langSc: LanguageService,
    private mpSc: MpService
  ) {}

  ngOnInit(): void {
    this.dbProducts = this.eComSc.products;
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.id = this.location.path().substring(4);
    this.productWebObj = this.copy.products[0];
  }

  addToCart(product) {
    console.log(product);
    if (!this.eComSc.carrySamples) {
      this.eComSc.switchToSamples();
    }
    this.eComSc.addItemCart(product.values, product.complements);
  }

  buy(form) {
    console.log(form);
    const item = form.values;
    const items: Array<MPitem> = [
      {
        title: item.product.descripcion,
        quantity: item.quantity,
        unit_price: item.subTotal,
        catalog_product_id: 'MLA1375998543',
        picture_url:
          'https://http2.mlstatic.com/D_NQ_NP_873943-MLA70349932001_072023-F.jpg',
      },
    ];
    firstValueFrom(this.mpSc.buyItem(items, true)).then((res: any) => {
      console.log(res);
      window.open(res.all.init_point, '_blank');
      // window.open(res.sandbox_init_point, '_blank');
    });
  }
}
