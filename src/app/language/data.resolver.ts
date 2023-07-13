import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, firstValueFrom } from 'rxjs';

import { EcomService, ServerDetectService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<any> {
  constructor(
    private serverDetectSc: ServerDetectService,
    private ecomSc: EcomService
  ) {}

  resolve(): Promise<any> | any {
    // if (this.serverDetectSc.isBrowserSide()) {
    //   console.log('no es server, voy derecho en lang service');
    //   return Promise.resolve(null);
    // } else {
    //   return firstValueFrom(this.ecomSc.getProducts());
    // }
    if (!this.ecomSc.products) {
      // console.log('nadie busco productos, los busco');
      return firstValueFrom(this.ecomSc.getProducts().pipe(take(1)));
    } else {
      // console.log('ya estan los productos');
    }
  }
}
