import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { EcomService, ServerDetectService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<any> {
  constructor(private ecomSc: EcomService) {}

  // resolve(): Promise<any> | any {
  //   if (!this.ecomSc.products) {
  //     return firstValueFrom(this.ecomSc.getProducts().pipe(take(1)));
  //   }
  // }

  resolve(): Promise<any> | any {
    if (!this.ecomSc.products) {
      return Promise.all([
        firstValueFrom(this.ecomSc.getProducts().pipe(take(1))),
        firstValueFrom(this.ecomSc.getGallerySecondaryImgs().pipe(take(1))),
      ]);
    }
  }
}
